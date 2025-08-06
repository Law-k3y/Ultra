const defaultRules = [
 "এই গ্রুপে গালাগালি বা বাজে ভাষা ব্যবহার নিষিদ্ধ।",
 "কোনো ধরনের স্প্যাম বা ফ্লাডিং করবেন না।",
 "অপ্রাসঙ্গিক বা অপ্রয়োজনীয় লিংক শেয়ার করা যাবে না।",
 "ধর্ম, রাজনীতি বা সংবেদনশীল বিষয়ে বিতর্ক থেকে বিরত থাকুন।",
 "কারো ব্যক্তিগত তথ্য শেয়ার করবেন না, সম্মান বজায় রাখুন।",
 "নতুন সদস্যদের স্বাগত জানান এবং সাহায্য করুন।",
 "এডমিনের অনুমতি ছাড়া কোনো বিজ্ঞাপন/প্রমোশন নয়।",
 "কোনো সদস্যকে ব্যক্তিগতভাবে অপমান করা নিষেধ।",
 "Group এ শুধুমাত্র বাংলা অথবা ইংরেজিতে কথা বলার চেষ্টা করুন।",
 "নিয়ম ভঙ্গ করলে ব্যান/মিউট/রিমুভ করা হতে পারে।"
];

module.exports = {
 config: {
 name: "rules",
 aliases: ["rule", "রুল", "রুলস", "নিয়ম", "আইন"],
 version: "1.7",
 author: "Chitron Bhattacharjee",
 role: 0,
 countDown: 5,
 shortDescription: {
 en: "view or manage group rules"
 },
 description: {
 en: "Show, add, edit, move or delete group rules with anime style output"
 },
 category: "group",
 guide: {
 en: "{pn} [add|-a] <text>\n{pn} [edit|-e] <n> <text>\n{pn} [move|-m] <n1> <n2>\n{pn} [delete|-d] <n>\n{pn} [reset|-r]"
 }
 },

 onChat: async function({ message, event, args, threadsData }) {
 const lowerBody = event.body?.toLowerCase();
 if (!["rules", "rule", "রুল", "রুলস", "নিয়ম", "আইন"].some(alias => lowerBody?.startsWith(alias))) return;
 await module.exports.onStart({ message, event, args, threadsData });
 },

 onStart: async function({ message, event, args, threadsData }) {
 const threadID = event.threadID;
 let rules = await threadsData.get(threadID, "data.rules");

 // First-time use: set default rules
 if (!rules || rules.length === 0) {
 rules = [...defaultRules];
 await threadsData.set(threadID, rules, "data.rules");
 }

 const sub = args[0];

 // RESET
 if (["reset", "-r"].includes(sub)) {
 await threadsData.set(threadID, [], "data.rules");
 return message.reply("💣 𝓐𝓵𝓵 𝓻𝓾𝓵𝓮𝓼 𝓱𝓪𝓿𝓮 𝓫𝓮𝓮𝓷 𝓻𝓮𝓼𝓮𝓽.\nAdd new ones with `+rules add <rule>`");
 }

 // ADD
 if (["add", "-a"].includes(sub)) {
 const content = args.slice(1).join(" ");
 if (!content) return message.reply("⚠️ 𝓟𝓵𝓮𝓪𝓼𝓮 𝓹𝓻𝓸𝓿𝓲𝓭𝓮 𝓻𝓾𝓵𝓮 𝓽𝓮𝔁𝓽 𝓽𝓸 𝓪𝓭𝓭.");
 rules.push(content);
 await threadsData.set(threadID, rules, "data.rules");
 return message.reply(`✅ 𝓡𝓾𝓵𝓮 𝓪𝓭𝓭𝓮𝓭: ${content}`);
 }

 // EDIT
 if (["edit", "-e"].includes(sub)) {
 const index = parseInt(args[1]) - 1;
 const content = args.slice(2).join(" ");
 if (isNaN(index) || !rules[index]) return message.reply("❌ 𝓘𝓷𝓿𝓪𝓵𝓲𝓭 𝓻𝓾𝓵𝓮 𝓷𝓾𝓶𝓫𝓮𝓻.");
 rules[index] = content;
 await threadsData.set(threadID, rules, "data.rules");
 return message.reply(`✏️ 𝓡𝓾𝓵𝓮 ${index + 1} 𝓾𝓹𝓭𝓪𝓽𝓮𝓭.`);
 }

 // MOVE
 if (["move", "-m"].includes(sub)) {
 const i1 = parseInt(args[1]) - 1;
 const i2 = parseInt(args[2]) - 1;
 if (isNaN(i1) || isNaN(i2) || !rules[i1] || !rules[i2]) return message.reply("❌ 𝓘𝓷𝓿𝓪𝓵𝓲𝓭 𝓲𝓷𝓭𝓮𝔁𝓮𝓼.");
 [rules[i1], rules[i2]] = [rules[i2], rules[i1]];
 await threadsData.set(threadID, rules, "data.rules");
 return message.reply(`🔀 𝓢𝔀𝓪𝓹𝓹𝓮𝓭 𝓻𝓾𝓵𝓮 ${i1 + 1} 𝓪𝓷𝓭 ${i2 + 1}.`);
 }

 // DELETE
 if (["delete", "-d"].includes(sub)) {
 const index = parseInt(args[1]) - 1;
 if (isNaN(index) || !rules[index]) return message.reply("❌ 𝓘𝓷𝓿𝓪𝓵𝓲𝓭 𝓻𝓾𝓵𝓮 𝓷𝓾𝓶𝓫𝓮𝓻.");
 const removed = rules.splice(index, 1);
 await threadsData.set(threadID, rules, "data.rules");
 return message.reply(`🗑️ 𝓡𝓮𝓶𝓸𝓿𝓮𝓭: ${removed[0]}`);
 }

 // SHOW RULES
 const formatted = rules.map((r, i) => `${i + 1}. ${r}`).join("\n");
 message.reply(`🌸 𝓣𝓱𝓲𝓼 𝓖𝓻𝓸𝓾𝓹 𝓡𝓾𝓵𝓮𝓼 🌸\n\n${formatted}`);
 }
};