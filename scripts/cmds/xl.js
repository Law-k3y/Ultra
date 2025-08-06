const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
 config: {
 name: 'xl',
 version: '1.0',
 author: "Chitron Bhattacharjee",
 countDown: 10,
 role: 0,
 longDescription: {
 en: 'Generate an image from text using SDXL.'
 },
 category: 'image',
 guide: {
 en: '{pn} prompt [--ar=<ratio>] or [--ar <ratio>]'
 }
 },

 onStart: async function ({ message, api, args, event, usersData }) {
 const cost = 50;

 if (!args[0]) {
 return message.reply(`😡 Please enter a text prompt\nExample: \n+xl a cat\n+xl a girl --ar 2:3`);
 }

 // Check and deduct coins
 const userData = await usersData.get(event.senderID);
 const balance = userData.money || 0;

 if (balance < cost) {
 return message.reply(`❌ | You need at least ${cost} coins.\n💰 Your balance: ${balance}`);
 }

 await usersData.set(event.senderID, { money: balance - cost });

 message.reply("💸 𝓣𝓱𝓲𝓼 𝓬𝓸𝓼𝓽 ❺⓿ 𝓬𝓸𝓲𝓷𝓼\n⏳ 𝓖𝓮𝓷𝓮𝓻𝓪𝓽𝓲𝓷𝓰 𝓲𝓶𝓪𝓰𝓮...");

 let ratio = "1:1";
 const ratioIndex = args.findIndex(arg => arg.startsWith("--ar="));
 if (ratioIndex !== -1) {
 ratio = args[ratioIndex].split("=")[1];
 args.splice(ratioIndex, 1);
 } else {
 const flagIndex = args.findIndex(arg => arg === "--ar");
 if (flagIndex !== -1 && args[flagIndex + 1]) {
 ratio = args[flagIndex + 1];
 args.splice(flagIndex, 2);
 }
 }

 const prompt = args.join(" ");
 const query = `xl31?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}`;
 const imageURL = `https://smfahim.xyz/${query}`;
 const startTime = Date.now();

 try {
 const res = await axios.get(imageURL, { responseType: "arraybuffer" });

 const folder = path.join(__dirname, "cache");
 if (!fs.existsSync(folder)) fs.mkdirSync(folder);

 const filePath = path.join(folder, `${Date.now()}_xl.png`);
 fs.writeFileSync(filePath, res.data);

 const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);

 await message.reply({
 body: `🖼️ 𝓧𝓛 𝓜𝓸𝓭𝓮𝓵 𝓘𝓶𝓪𝓰𝓮\n⏱️ Time taken: ${timeTaken} sec`,
 attachment: fs.createReadStream(filePath)
 });

 api.setMessageReaction("✅", event.messageID, () => {}, true);
 } catch (err) {
 console.error("XL gen error:", err);
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 message.reply("❌ | Failed to generate image.");
 }
 }
};