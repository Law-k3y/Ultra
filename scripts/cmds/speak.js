const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const models = {
 "1": { name: "Joey", desc: "🧑 Male voice (American English)" },
 "2": { name: "Amy", desc: "👩 Female voice (British English)" },
 "3": { name: "Brian", desc: "🧔‍♂️ Male voice (British English)" },
 "4": { name: "Mizuki", desc: "👧 Female voice (Japanese)" }
};

module.exports = {
 config: {
 name: "speak",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: { en: "Text-to-speech using voice models" },
 longDescription: { en: "Generate speech from text using selected voice models (no API key needed)" },
 category: "media",
 guide: {
 en: `+speak Hello world
+speak Hello there -m2
+speak -m (list voice models)`
 }
 },

 onStart: async function ({ message, args, event }) {
 const input = args.join(" ");
 if (!input) return message.reply("❗ Please provide text. Example: `+speak Hello world`");

 if (input.toLowerCase() === "-m") {
 const listMsg = `
🎤 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗧𝗧𝗦 𝗠𝗼𝗱𝗲𝗹𝘀:

🔢 -m1: Joey 
🧑 Male voice (American English)

🔢 -m2: Amy 
👩 Female voice (British English)

🔢 -m3: Brian 
🧔‍♂️ Male voice (British English)

🔢 -m4: Mizuki 
👧 Female voice (Japanese)

📝 Use like: +speak Hello there -m2
 `.trim();
 return message.reply(listMsg);
 }

 // Extract model
 const modelMatch = input.match(/-m(\d+)/);
 const modelNum = modelMatch ? modelMatch[1] : "1";
 const voice = models[modelNum]?.name;
 if (!voice) return message.reply("❌ Invalid model number. Use `+speak -m` to see list.");

 // Remove -m flag from message
 const content = input.replace(`-m${modelNum}`, "").trim();
 if (!content) return message.reply("❗ Text is empty after removing model flag.");

 try {
 const res = await axios.post("https://ttsmp3.com/makemp3_new.php", new URLSearchParams({
 msg: content,
 lang: voice,
 source: "ttsmp3"
 }).toString(), {
 headers: {
 "Content-Type": "application/x-www-form-urlencoded"
 }
 });

 if (!res.data || !res.data.URL) return message.reply("⚠️ Failed to generate audio.");

 const fileName = `tts_${Date.now()}.mp3`;
 const filePath = path.join(__dirname, "cache", fileName);

 const audioRes = await axios.get(res.data.URL, { responseType: "stream" });
 await fs.ensureDir(path.dirname(filePath));
 const writer = fs.createWriteStream(filePath);

 audioRes.data.pipe(writer);
 writer.on("finish", () => {
 message.reply({
 body: `🗣️ *${content}*\n🎤 Voice: ${voice}`,
 attachment: fs.createReadStream(filePath)
 });
 });

 } catch (err) {
 console.error(err);
 return message.reply("❌ Error occurred while generating speech.");
 }
 }
};