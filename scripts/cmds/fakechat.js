const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
 config: {
 name: "fakechat",
 version: "1.4",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 aliases: ["chatedit", "fchat"],
 shortDescription: {
 en: "Generate fake Messenger screenshot"
 },
 description: {
 en: "Create a fake Messenger screenshot with UID/mention and custom messages"
 },
 category: "fun",
 guide: {
 en: "+fakechat <@mention or UID> - <text1> - [text2] - [mode=dark]\n\nAutomatically fetches name from UID.\nEach use costs 50 coins.\nDefault mode is light."
 }
 },

 onStart: async function ({ args, message, event, api, usersData }) {
 if (args.length < 2) return message.reply("⚠️ Usage:\n+fakechat <@mention or UID> - <text1> - [text2] - [mode]");

 const input = args.join(" ").split("-").map(i => i.trim());
 let [target, text1, text2 = "", modeRaw = "light"] = input;

 // Get UID from mention or raw input
 let uid;
 if (Object.keys(event.mentions).length > 0) {
 uid = Object.keys(event.mentions)[0];
 } else if (/^\d{6,}$/.test(target)) {
 uid = target;
 } else {
 return message.reply("❌ Invalid UID or mention.");
 }

 // Fetch user name from Facebook API
 let name = "User";
 try {
 const userInfo = await api.getUserInfo(uid);
 name = userInfo[uid]?.name || name;
 } catch (e) {
 // fallback to "User"
 }

 const mode = modeRaw.toLowerCase() === "dark" ? "dark" : "light";

 // 💸 Check and deduct 50 coins
 const balance = await usersData.get(event.senderID, "money") || 0;
 if (balance < 50) return message.reply("❌ You need at least 50 coins to use this command.");
 await usersData.set(event.senderID, { money: balance - 50 });

 // Prepare API
 const apiURL = `https://fchat-5pni.onrender.com/fakechat?uid=${encodeURIComponent(uid)}&name=${encodeURIComponent(name)}&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&mode=${mode}`;

 const cachePath = path.join(__dirname, "tmp", `fchat_${event.senderID}.png`);
 fs.ensureDirSync(path.dirname(cachePath));

 const file = fs.createWriteStream(cachePath);
 https.get(apiURL, res => {
 res.pipe(file);
 file.on("finish", () => {
 file.close(() => {
 message.reply({
 body: `🎭 Fake Chat Created\n👤 Name: ${name}\n💬 Text1: ${text1}${text2 ? `\n💬 Text2: ${text2}` : ""}\n🎨 Mode: ${mode.toUpperCase()}\n💸 -50 coins`,
 attachment: fs.createReadStream(cachePath)
 }, () => fs.unlinkSync(cachePath));
 });
 });
 }).on("error", err => {
 fs.unlink(cachePath, () => {});
 message.reply("❌ Failed to generate fake chat.");
 });
 }
};