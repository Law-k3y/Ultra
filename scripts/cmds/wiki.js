const axios = require("axios");

module.exports = {
 config: {
 name: "wikisearch",
 aliases: ["wiki", "wikibio", "wikiimg", "wikiquote", "wikifight", "wikifact", "wikipersonality", "wikitoday", "wikivideo", "wikirelated"],
 version: "2.3",
 author: "Chitron Bhattacharjee",
 role: 0,
 shortDescription: {
 en: "উইকিপিডিয়া চালিত কমান্ড"
 },
 longDescription: {
 en: "উইকিপিডিয়া থেকে তথ্য, বায়ো, ছবি, উক্তি, মজার যুদ্ধ ও আরও অনেক কিছু খুঁজুন এবং অন্বেষণ করুন"
 },
 category: "fun",
 guide: {
 en: `ব্যবহার:
{pn} [বিষয়] — আর্টিকেল খুঁজুন
{pn}bio @user — মজার বায়ো তৈরি করুন
{pn}quote [বিষয়] — উক্তি দেখুন
{pn}img [বিষয়] — ছবিটি দেখুন
{pn}fight A vs B — মজার যুদ্ধ
{pn}fact — র‍্যান্ডম তথ্য
{pn}personality [BD নাম] — তথ্য নিন
{pn}today — ইতিহাসে আজকের দিন
{pn}video [বিষয়] — ভিডিও প্রিভিউ
{pn}related [বিষয়] — সম্পর্কিত দেখুন`}
 },

 onStart: async function ({ message, event, args, usersData }) {
 const input = args.join(" ").trim();
 const lower = args.map(a => a.toLowerCase());
 const sub = lower[0];

 if (!input) return message.reply("❗ দয়া করে একটি বিষয় বা সাবকম্যান্ড লিখুন।");

 // 📌 সাবকম্যান্ড হ্যান্ডেলিং
 if (sub === "bio" && event.mentions) {
 const uid = Object.keys(event.mentions)[0];
 const name = await usersData.getName(uid);
 return message.reply(`👤 *${name} এর উইকিপিডিয়া বায়ো*
━━━━━━━━━━━━━━
${name} হলো এই চ্যাটের একজন প্রভাবশালী ব্যক্তি। তার অনলাইন উপস্থিতি, ইমোজি স্প্যাম এবং সবার জন্য মজার পরিবেশ তৈরির জন্য বিখ্যাত।`);
 }

 if (sub === "quote") {
 const quoteTopic = args.slice(1).join(" ");
 const qRes = await axios.get(`https://en.wikiquote.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(quoteTopic)}&utf8=1`);
 const first = qRes.data.query.search[0]?.title;
 if (!first) return message.reply("❌ কোনো উক্তি পাওয়া যায়নি।");
 return message.reply(`🧠 *${first} এর উক্তি:*
━━━━━━━━━━━━━━
"${quoteTopic}" — [উৎস: Wikiquote]`);
 }

 if (sub === "img") {
 const topic = args.slice(1).join(" ");
 const imgRes = await axios.get("https://en.wikipedia.org/w/api.php", {
 params: {
 action: "query",
 titles: topic,
 prop: "pageimages",
 format: "json",
 piprop: "original"
 }
 });
 const pages = imgRes.data.query.pages;
 const page = Object.values(pages)[0];
 if (!page.original) return message.reply("❌ কোনো ছবি পাওয়া যায়নি।");
 return message.reply({
 body: `🖼️ *উইকিপিডিয়া থেকে ছবি*
━━━━━━━━━━━━━━
🔗 ${page.original.source}
© Shipu Ai`,
 attachment: await global.utils.getStreamFromURL(page.original.source)
 });
 }

 if (sub === "fight") {
 const fightString = input.slice(6).split(" vs ");
 if (fightString.length !== 2) return message.reply("⚔️ ব্যবহার: +wikifight A vs B");
 return message.reply(`⚔️ *উইকি যুদ্ধ শুরু!*
━━━━━━━━━━━━━━
${fightString[0]} প্রথমে মিম ছুঁড়লো।
${fightString[1]} প্রতিক্রিয়া দিলো ক্রিঞ্জ দিয়ে।
শেষে দুজনকেই মডারেটর টাইমআউট দিলো।`);
 }

 if (sub === "fact") {
 const facts = [
 "অক্টোপাসের তিনটি হৃদয় থাকে।",
 "মধু কখনো নষ্ট হয় না।",
 "কলা একটি বেরি কিন্তু স্ট্রবেরি নয়।",
 "নীল তিমির হৃদস্পন্দন ২ মাইল দূর থেকেও শোনা যায়।"
 ];
 return message.reply(`📌 *জানা অজানা তথ্য:*
━━━━━━━━━━━━━━
${facts[Math.floor(Math.random() * facts.length)]}`);
 }

 if (sub === "personality") {
 const topic = args.slice(1).join(" ");
 return message.reply(`🔍 *বাংলাদেশি ব্যক্তিত্ব: ${topic}*
━━━━━━━━━━━━━━
সম্পূর্ণ তথ্যের জন্য ➤ +wiki ${topic} ব্যবহার করুন।`);
 }

 if (sub === "today") {
 try {
 const day = new Date();
 const month = `${day.getMonth() + 1}`.padStart(2, '0');
 const date = `${day.getDate()}`.padStart(2, '0');
 const formatted = `${month}/${date}`;

 const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${date}`);
 const events = res.data.events;

 if (!events || events.length === 0) return message.reply("❌ আজকের জন্য কোনো উল্লেখযোগ্য ঘটনা পাওয়া যায়নি।");

 const lines = events.slice(0, 3).map((e, i) => `${i + 1}. ${e.text}`);
 return message.reply(`📅 *ইতিহাসে আজ (${date}-${month})*
━━━━━━━━━━━━━━
${lines.join("\n")}`);
 } catch (err) {
 console.error(err);
 return message.reply("❌ আজকের ঘটনাসমূহ আনতে সমস্যা হয়েছে। পরে চেষ্টা করুন।");
 }
 }

 if (sub === "video") {
 return message.reply("🎞️ উইকিপিডিয়া ভিডিও সংরক্ষণ করে না। অনুগ্রহ করে ইউটিউব বা অন্যান্য উৎস দেখুন।");
 }

 if (sub === "related") {
 return message.reply("📚 সম্পর্কিত টপিক দেখতে আর্টিকেলের 'See Also' সেকশন চেক করুন।");
 }

 // 🔎 প্রধান উইকিপিডিয়া সার্চ (বাংলা)
 const res = await axios.get(`https://bn.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(input)}`);
 const summary = res.data;

 if (!summary.extract) return message.reply("❌ তথ্য পাওয়া যায়নি। অনুগ্রহ করে বিষয়টি সঠিকভাবে লিখুন।");

 const formatted = `📘 *${summary.title}*
━━━━━━━━━━━━━━
${summary.extract}`;
 await message.reply(formatted);

 // ছবি শেষে
 if (summary.originalimage) {
 await message.reply({
 body: `🖼️ *উইকিপিডিয়া ছবি*
━━━━━━━━━━━━━━
🔗 ${summary.originalimage.source}
© Shipu Ai`,
 attachment: await global.utils.getStreamFromURL(summary.originalimage.source)
 });
 }
 }
};