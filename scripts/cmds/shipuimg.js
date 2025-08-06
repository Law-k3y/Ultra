const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
 const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
 return base.data.mahmud;
};

module.exports = {
 config: {
 name: "shipuimg",
 author: "Chitron Bhattacharjee",
 version: "1.7-fix",
 cooldowns: 10,
 role: 0,
 category: "Image gen",
 guide: {
 en: "{p}shipui <prompt>"
 }
 },

 onStart: async function ({ message, args, api, event, usersData }) {
 if (args.length === 0) {
 return api.sendMessage("📛 | Please provide a prompt.", event.threadID, event.messageID);
 }

 const prompt = args.join(" ");
 const cacheDir = path.join(__dirname, "cache");
 if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

 // Get current user balance
 const userData = await usersData.get(event.senderID);
 const currentBalance = userData.money || 0;

 const cost = 20;
 if (currentBalance < cost) {
 return message.reply(`❌ | You need at least ${cost} coins to use this command.\n💰 Your balance: ${currentBalance}`);
 }

 // Deduct manually and set
 await usersData.set(event.senderID, {
 money: currentBalance - cost
 });

 message.reply(
 "🌸 𝓣𝓱𝓲𝓼 𝓬𝓸𝓶𝓶𝓪𝓷𝓭 𝓬𝓸𝓼𝓽 ❺×❹ = ❷⓿ 𝓬𝓸𝓲𝓷𝓼\n💫 𝓓𝓮𝓭𝓾𝓬𝓽𝓮𝓭 𝓯𝓻𝓸𝓶 𝔂𝓸𝓾𝓻 𝓫𝓪𝓵𝓪𝓷𝓬𝓮!"
 );

 api.sendMessage("🖌️ 𝓗𝓸𝓵𝓭 𝓸𝓷~ 𝓨𝓸𝓾𝓻 𝓹𝓱𝓸𝓽𝓸𝓼 𝓪𝓻𝓮 𝓬𝓸𝓶𝓲𝓷𝓰... 🦆", event.threadID, event.messageID);

 try {
 const styles = ["ultra detailed", "4k resolution", "realistic lighting", "artstation", "digital painting"];
 const imagePaths = [];

 for (let i = 0; i < 4; i++) {
 const enhancedPrompt = `${prompt}, ${styles[i % styles.length]}`;
 const response = await axios.post(`${await baseApiUrl()}/api/poli/generate`, {
 prompt: enhancedPrompt
 }, {
 responseType: "arraybuffer",
 headers: {
 "author": module.exports.config.author
 }
 });

 const filePath = path.join(cacheDir, `generated_${Date.now()}_${i}.png`);
 fs.writeFileSync(filePath, response.data);
 imagePaths.push(filePath);
 }

 const attachments = imagePaths.map(p => fs.createReadStream(p));
 message.reply({
 body: "✅ | 𝓗𝓮𝓻𝓮 𝓪𝓻𝓮 𝔂𝓸𝓾𝓻 𝓫𝓮𝓪𝓾𝓽𝓲𝓯𝓾𝓵 𝓰𝓮𝓷𝓮𝓻𝓪𝓽𝓮𝓭 𝓲𝓶𝓪𝓰𝓮𝓼~ 💖",
 attachment: attachments
 });

 } catch (error) {
 console.error("Image generation error:", error);
 message.reply("❌ | Couldn't generate images. Try again later.");
 }
 }
};