const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
 config: {
 name: "gemini",
 aliases: ["g"],
 version: "1.2",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Ask Gemini AI"
 },
 longDescription: {
 en: "Ask Gemini anything with optional image input"
 },
 category: "ai",
 guide: {
 en: "{pn} your question\n{pn} (reply to image with question)"
 }
 },

 onStart: async function ({ message, event, args, api }) {
 const { threadID, messageID, messageReply } = event;
 const query = args.join(" ");
 if (!query) return message.reply("💬 | What would you like to ask Gemini?");

 const repliedImg = messageReply?.attachments?.[0]?.type === "photo" ? messageReply.attachments[0].url : null;
 const imageUrl = repliedImg || null;

 const apiKey = "AIzaSyCBMJ_DbFcJAA4yvN8ASYl18fKf5dYdV6E";
 const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

 message.reply("🔮 | Gemini is thinking...", async (err, thinkingMsg) => {
 if (err || !thinkingMsg?.messageID) return;

 const sendStyledReply = async (text) => {
 const styled = `╭────────────╮\n ▄ 🧠 𝗦𝗵𝗶𝗣𝘂 𝗔𝗜 𝘀𝗮𝗶𝗱:\n▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n\n${text}\n\n──────────────`;
 try {
 await api.unsendMessage(thinkingMsg.messageID);
 } catch {}
 return message.reply(styled);
 };

 if (imageUrl) {
 const fileName = `img-${Date.now()}.jpg`;
 const filePath = path.join(__dirname, "cache", fileName);

 try {
 const response = await axios({
 method: "GET",
 url: imageUrl,
 responseType: "stream"
 });

 const writer = fs.createWriteStream(filePath);
 response.data.pipe(writer);

 writer.on("finish", async () => {
 try {
 const imageBuffer = fs.readFileSync(filePath);
 const base64 = imageBuffer.toString("base64");

 const payload = {
 contents: [{
 role: "user",
 parts: [
 { text: query },
 {
 inline_data: {
 data: base64,
 mimeType: "image/jpeg"
 }
 }
 ]
 }]
 };

 const geminiRes = await axios.post(url, payload, {
 headers: { "Content-Type": "application/json" }
 });

 const text = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*/g, '') || "❌ | No response from Gemini.";
 fs.unlinkSync(filePath);
 sendStyledReply(text);
 } catch (err) {
 console.error(err);
 sendStyledReply("❌ | Error processing image with Gemini.");
 }
 });
 } catch {
 sendStyledReply("❌ | Couldn't download the image.");
 }
 } else {
 try {
 const payload = {
 contents: [{
 role: "user",
 parts: [{ text: query }]
 }]
 };

 const geminiRes = await axios.post(url, payload, {
 headers: { "Content-Type": "application/json" }
 });

 const text = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*/g, '') || "❌ | No response from Gemini.";
 sendStyledReply(text);
 } catch (err) {
 console.error(err);
 sendStyledReply("❌ | Gemini is under maintenance.");
 }
 }
 });
 }
};