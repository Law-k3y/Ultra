const axios = require("axios");
const deltaNext = 5;

function expToLevel(exp) {
 return Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
}

module.exports = {
 config: {
 name: "call",
 version: "1.0.1",
 author: "Chitron Bhattacharjee",
 countDown: 15,
 role: 0,
 shortDescription: {
 en: "Call bomber (BD only)"
 },
 description: {
 en: "Sends a series of call bomb requests to a Bangladeshi number. Cost: 100 coin"
 },
 category: "tools",
 guide: {
 en: "call 01xxxxxxxxx"
 }
 },

 onChat: async function ({ event, message, args, usersData }) {
 const input = args.join(" ").trim();
 if (!input.toLowerCase().startsWith("call")) return;

 const number = input.split(" ")[1];
 const senderID = event.senderID;

 // 🔍 Get user info
 const userData = await usersData.get(senderID);
 const exp = userData.exp || 0;
 const balance = userData.money || 0;
 const level = expToLevel(exp);

 // 🔐 Level requirement
 if (level < 2) {
 return message.reply("🚫 এই কমান্ড ব্যবহার করতে আপনার লেভেল কমপক্ষে 2 হতে হবে!");
 }

 // 📱 Invalid number
 if (!number || !/^01[0-9]{9}$/.test(number)) {
 return message.reply(
 "📵 একটি বৈধ বাংলাদেশি মোবাইল নাম্বার দিন!\n" +
 "👉 উদাহরণ: call 01xxxxxxxxx\n" +
 "⚠️ অনুগ্রহ করে কাউকে বিরক্ত করতে ব্যবহার করবেন না।\n" +
 "💸 প্রতি বারে ১০০ coin কাটা হবে।"
 );
 }

 // 💸 Balance check
 if (balance < 100) {
 return message.reply(`❌ আপনার কাছে যথেষ্ট coin নেই!\n🔻 দরকার: 100 coin\n🪙 আপনার coin: ${balance}`);
 }

 // ✅ Deduct coin
 await usersData.set(senderID, {
 money: balance - 100
 });

 message.reply(`📞 কল বোম্বিং শুরু হয়েছে ${number} নম্বরে...\n💸 ১০০ coin কাটা হয়েছে।\n🕐 অনুগ্রহ করে অপেক্ষা করুন...`);

 try {
 const response = await axios.get(`https://tbblab.shop/callbomber.php?mobile=${number}`);
 return message.reply(`✅ কল বোম্বিং সম্পন্ন হয়েছে ${number} নম্বরে!`);
 } catch (error) {
 return message.reply(`❌ ত্রুটি ঘটেছে: ${error.message}`);
 }
 },

 onStart: async function () {}
};