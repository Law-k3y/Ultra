module.exports = {
 config: {
 name: "tag",
 aliases: [],
 version: "2.1",
 category: '𝗧𝗔𝗚',
 role: 0,
 author: "Chitron Bhattacharjee",
 countDown: 3,
 description: {
 en: '𝗧𝗮𝗴𝘀 𝗮 𝘂𝘀𝗲𝗿, 𝗮𝗹𝗹, 𝗮𝗱𝗺𝗶𝗻𝘀 𝗼𝗿 𝗰𝗵𝗶𝘁𝗿𝗼𝗻-𝗹𝗶𝗸𝗲 𝗻𝗮𝗺𝗲𝘀 𝘄𝗶𝘁𝗵 𝘀𝘁𝘆𝗹𝗲.'
 },
 guide: {
 en: `Reply to a message or use:\n{pn} [name]\n{pn} [name] [message]\n\n🔹 {pn} all\n🔹 {pn} admins\n🔹 {pn} author`
 }
 },

 onStart: async ({ api, event, usersData, threadsData }) => {
 const { threadID, messageID, messageReply, senderID, body } = event;
 try {
 const threadData = await threadsData.get(threadID);
 const members = threadData.members.map((m, i) => ({
 Name: m.name,
 UserId: m.userID,
 isAdmin: ["admin", "adminGroup", "MANAGER", 1, 2].includes(m.role)
 }));

 let namesToTag = [];
 let args = body.trim().split(/\s+/);
 const prefix = global.GoatBot.config.prefix;
 const cmd = module.exports.config.name;
 if (body.startsWith(prefix)) {
 args = body.slice(prefix.length).trim().split(/\s+/);
 if (args[0] === cmd) args.shift();
 }

 let extraMessage = args.slice(1).join(" ");
 let replyMessageID = messageID;
 let senderName = await usersData.getName(senderID);

 if (messageReply) {
 replyMessageID = messageReply.messageID;
 const uid = messageReply.senderID;
 const name = await usersData.getName(uid);
 namesToTag.push({ Name: name, UserId: uid });
 extraMessage = args.join(" ");
 } else {
 const sub = args[0]?.toLowerCase();

 switch (sub) {
 case "all":
 namesToTag = members;
 break;
 case "admins":
 namesToTag = members.filter(p => p.isAdmin);
 break;
 case "author":
 namesToTag = members.filter(p => p.Name.toLowerCase().includes("chitron"));
 break;
 default:
 const keyword = args[0] || "dip";
 namesToTag = members.filter(p =>
 p.Name.toLowerCase().includes(keyword.toLowerCase()));
 extraMessage = args.slice(1).join(" ");
 break;
 }

 if (namesToTag.length === 0) {
 return api.sendMessage('❎ No matching users found.', threadID, messageID);
 }
 }

 const mentions = namesToTag.map(({ Name, UserId }) => ({
 tag: `@${Name}`,
 id: UserId
 }));

 const mentionNames = namesToTag.map(({ Name }) => `@${Name}`).join(', ');
 const finalText =
 `${mentionNames}, @${senderName} 𝗺𝗲𝗻𝘁𝗶𝗼𝗻𝗲𝗱 𝘆𝗼𝘂\n\n✨ 𝗖𝗵𝗲𝗰𝗸 𝘁𝗵𝗶𝘀 𝗼𝘂𝘁!` +
 (extraMessage ? `\n\n💬 ${extraMessage}` : '');

 return api.sendMessage({
 body: finalText,
 mentions: [
 ...mentions,
 { tag: `@${senderName}`, id: senderID }
 ]
 }, threadID, replyMessageID);

 } catch (e) {
 api.sendMessage(`❌ Error: ${e.message}`, threadID, messageID);
 }
 }
};