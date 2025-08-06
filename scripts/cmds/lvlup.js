module.exports = {
 config: {
 name: "levelup",
 version: "1.3",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 1,
 shortDescription: {
 en: "Set user's level (with exp sync)"
 },
 description: {
 en: "Boost or reduce user level and syncs XP with rank system"
 },
 category: "ranking",
 guide: {
 en: "{pn} @tag 10/20\n{pn} 25\n{pn} 100081330372098 -5 (by UID)"
 }
 },

 onStart: async function ({ message, event, args, usersData, envCommands }) {
 const deltaNext = envCommands["rank"]?.deltaNext || 5;

 // 🧠 Determine target ID (tag/reply/UID)
 let targetID;
 if (event.type === "message_reply") {
 targetID = event.messageReply.senderID;
 args.shift();
 } else if (Object.keys(event.mentions || {}).length > 0) {
 targetID = Object.keys(event.mentions)[0];
 args.shift();
 } else if (/^\d{6,}$/.test(args[0])) {
 targetID = args.shift();
 }

 if (!targetID)
 return message.reply("❌ | Please tag, reply, or give a UID of the user.");

 const input = args.find(arg => !isNaN(arg) || arg.includes("/"));
 if (!input)
 return message.reply("⚠️ | Provide a level number or range (e.g. 10/20 or -5)");

 // 🎯 Parse level change
 let levelChange;
 if (input.includes("/")) {
 const [min, max] = input.split("/").map(Number);
 if (isNaN(min) || isNaN(max) || min > max)
 return message.reply("❌ Invalid range.");
 levelChange = Math.floor(Math.random() * (max - min + 1)) + min;
 } else {
 levelChange = parseInt(input);
 }

 // 🧮 Get user and calculate level/exp
 const userData = await usersData.get(targetID);
 if (!userData)
 return message.reply("❌ | User not found in database.");

 const oldExp = userData.exp || 0;
 const oldLevel = Math.floor((1 + Math.sqrt(1 + 8 * oldExp / deltaNext)) / 2);
 const newLevel = oldLevel + levelChange;
 const newExp = Math.floor(((newLevel ** 2 - newLevel) * deltaNext) / 2);

 await usersData.set(targetID, { exp: newExp });

 return message.reply(
 `📈 𝗟𝗲𝘃𝗲𝗹 𝗨𝗽𝗱𝗮𝘁𝗲\n━━━━━━━━━━━━━━\n👤 𝗨𝘀𝗲𝗿: ${userData.name} (${targetID})\n🎚️ 𝗟𝗲𝘃𝗲𝗹: ${oldLevel} → ${newLevel}\n✨ 𝗘𝗫𝗣: ${oldExp} → ${newExp}`
 );
 }
};