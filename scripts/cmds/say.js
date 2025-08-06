const { createReadStream, unlinkSync, createWriteStream } = require("fs-extra");
const { resolve } = require("path");
const axios = require("axios");

module.exports = {
 config: {
 name: "say",
 version: "3.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Text to speech"
 },
 longDescription: {
 en: "Converts any text to voice in supported languages"
 },
 category: "fun",
 guide: {
 en:
`🎙️ Usage:
+say [lang] [text]
say [lang] [text]
say (as a reply)

🌍 Supported Languages:
en | ja | ko | ru | vi | in | tl | ne`
 }
 },

 onStart: async function ({ api, event, args }) {
 return module.exports.handle({ api, event, args });
 },

 onChat: async function ({ message, event }) {
 const body = event.body?.trim().toLowerCase();
 if (!body) return;

 // Must start with "say"
 if (!body.startsWith("say")) return;

 // Remove "say" from start
 const content = body.slice(3).trim();

 // Split into args
 const args = content ? content.split(/\s+/) : [];

 // Use replied text if nothing provided
 if (!args.length && event.messageReply?.body) {
 return module.exports.handle({ api: message.api, event, args: [] });
 }

 // Use args from message if text given
 if (args.length > 0) {
 return module.exports.handle({ api: message.api, event, args });
 }
 },

 handle: async function ({ api, event, args }) {
 try {
 const supportedLanguages = ["ru", "en", "ko", "ja", "tl", "vi", "in", "ne"];
 const defaultLang = "en";

 let content = event.type === "message_reply"
 ? event.messageReply.body
 : args.join(" ");

 if (!content) {
 return api.sendMessage("⚠️ দয়া করে কিছু লিখুন অথবা একটি মেসেজে রিপ্লাই দিন।", event.threadID, event.messageID);
 }

 let lang = defaultLang;
 let text = content;

 const firstWord = content.split(" ")[0].toLowerCase();
 if (supportedLanguages.includes(firstWord)) {
 lang = firstWord;
 text = content.substring(firstWord.length).trim();
 }

 if (!text) {
 return api.sendMessage("😿 টেক্সট খুঁজে পাচ্ছি না।", event.threadID, event.messageID);
 }

 const path = resolve(__dirname, "cache", `${event.threadID}_${event.senderID}.mp3`);
 const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

 const response = await axios.get(ttsUrl, { responseType: "stream" });

 const writer = response.data.pipe(createWriteStream(path));
 await new Promise((resolve, reject) => {
 writer.on("finish", resolve);
 writer.on("error", reject);
 });

 api.sendMessage({
 body: `🎧 Speaking (${lang})`,
 attachment: createReadStream(path)
 }, event.threadID, () => unlinkSync(path));

 } catch (error) {
 console.error("TTS Error:", error);
 api.sendMessage("💔 ভয়েস তৈরি করতে সমস্যা হয়েছে...\n🔧 " + (error.message || "Unknown error."), event.threadID, event.messageID);
 }
 }
};