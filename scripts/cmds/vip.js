const { getStreamsFromAttachment } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];
const { config } = global.GoatBot;
const { client } = global;
const vipModel = global.models.vipModel;

const OWNER_UID = "100081330372098"; // Always treated as VIP

module.exports = {
 config: {
 name: "vip",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "handle vip members"
 },
 longDescription: {
 en: "handle vip members"
 },
 category: "admin",
 guide: {
 en: "{p}vip <msg> to message VIPs\n{p}vip add <uid>\n{p}vip remove <uid>\n{p}vip list\n{p}vip on/off"
 }
 },

 langs: {
 en: {
 missingMessage: "You need to be a VIP member to use this feature.",
 sendByGroup: "\n- Sent from group: %1\n- Thread ID: %2",
 sendByUser: "\n- Sent from user",
 content: "\n\nContent: %1\nReply this message to send message",
 success: "Sent your message to VIP successfully!\n%2",
 failed: "An error occurred while sending your message to VIP\n%2",
 reply: "📍 Reply from VIP %1:\n%2",
 replySuccess: "Sent your reply to VIP successfully!",
 feedback: "📝 Feedback from VIP user %1:\n- User ID: %2\n%3\n\nContent: %4",
 replyUserSuccess: "Sent your reply to VIP user successfully!",
 noAdmin: "You don't have permission to perform this action.",
 addSuccess: "✅ Added to VIP list!",
 alreadyInVIP: "❗ Already in VIP list!",
 removeSuccess: "❌ Removed from VIP list!",
 notInVIP: "❗ User not in VIP list!",
 list: "🌟 VIP Members:\n%1",
 vipModeEnabled: "✅ VIP mode enabled",
 vipModeDisabled: "✅ VIP mode disabled"
 }
 },

 onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
 const { senderID, threadID, isGroup } = event;
 if (!config.adminBot.includes(senderID)) return message.reply(getLang("noAdmin"));

 if (args[0] === "on") {
 try {
 config.whiteListMode.enable = true;
 const vipDocs = await vipModel.find({});
 const dbIDs = vipDocs.map(v => v.userId);
 if (!dbIDs.includes(OWNER_UID)) dbIDs.push(OWNER_UID);
 config.whiteListMode.whiteListIds = dbIDs;
 await require("fs").promises.writeFile(client.dirConfig, JSON.stringify(config, null, 2));
 return message.reply(getLang("vipModeEnabled"));
 } catch (err) {
 console.error(err);
 return message.reply("❌ Error enabling VIP mode.");
 }
 }

 if (args[0] === "off") {
 try {
 config.whiteListMode.enable = false;
 await require("fs").promises.writeFile(client.dirConfig, JSON.stringify(config, null, 2));
 return message.reply(getLang("vipModeDisabled"));
 } catch (err) {
 console.error(err);
 return message.reply("❌ Error disabling VIP mode.");
 }
 }

 if (args[0] === "add" && args[1]) {
 const uid = args[1];
 if (uid === OWNER_UID) return message.reply("⚠️ Cannot add owner again!");
 const exists = await vipModel.findOne({ userId: uid });
 if (exists) return message.reply(getLang("alreadyInVIP"));
 await vipModel.create({ userId: uid });
 return message.reply(getLang("addSuccess"));
 }

 if (args[0] === "remove" && args[1]) {
 const uid = args[1];
 if (uid === OWNER_UID) return message.reply("❌ Cannot remove owner from VIP list!");
 const exists = await vipModel.findOne({ userId: uid });
 if (!exists) return message.reply(getLang("notInVIP"));
 await vipModel.deleteOne({ userId: uid });
 return message.reply(getLang("removeSuccess"));
 }

 if (args[0] === "list") {
 const vipDocs = await vipModel.find({});
 const allUIDs = [...new Set([...vipDocs.map(v => v.userId), OWNER_UID])];
 const vipList = await Promise.all(allUIDs.map(async uid => {
 const name = await usersData.getName(uid);
 return `${uid} - (${name})`;
 }));
 return message.reply(getLang("list", vipList.join("\n")));
 }

 // Check for VIP eligibility
 if (!config.whiteListMode.enable)
 return message.reply("🔒 VIP mode is off. Turn it on to use this feature.");

 const isVip = senderID === OWNER_UID || await vipModel.findOne({ userId: senderID });
 if (!isVip) return message.reply(getLang("missingMessage"));
 if (!args[0]) return message.reply(getLang("missingMessage"));

 const senderName = await usersData.getName(senderID);
 const msg = `==📨 VIP MESSAGE 📨==\n- User Name: ${senderName}\n- User ID: ${senderID}`;

 const formMessage = {
 body: msg + getLang("content", args.join(" ")),
 mentions: [{ id: senderID, tag: senderName }],
 attachment: await getStreamsFromAttachment(
 [...event.attachments, ...(event.messageReply?.attachments || [])]
 .filter(item => mediaTypes.includes(item.type))
 )
 };

 try {
 const messageSend = await api.sendMessage(formMessage, threadID);
 global.GoatBot.onReply.set(messageSend.messageID, {
 commandName,
 messageID: messageSend.messageID,
 threadID,
 messageIDSender: event.messageID,
 type: "userCallAdmin"
 });
 } catch (err) {
 console.error(err);
 return message.reply(getLang("failed"));
 }
 },

 onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
 const { type, threadID, messageIDSender } = Reply;
 const senderName = await usersData.getName(event.senderID);
 const { isGroup } = event;

 switch (type) {
 case "userCallAdmin": {
 const formMessage = {
 body: getLang("reply", senderName, args.join(" ")),
 mentions: [{ id: event.senderID, tag: senderName }],
 attachment: await getStreamsFromAttachment(
 event.attachments.filter(item => mediaTypes.includes(item.type))
 )
 };

 api.sendMessage(formMessage, threadID, (err, info) => {
 if (err) return message.err(err);
 message.reply(getLang("replyUserSuccess"));
 global.GoatBot.onReply.set(info.messageID, {
 commandName,
 messageID: info.messageID,
 messageIDSender: event.messageID,
 threadID: event.threadID,
 type: "adminReply"
 });
 }, messageIDSender);
 break;
 }

 case "adminReply": {
 let sendByGroup = "";
 if (isGroup) {
 const { threadName } = await api.getThreadInfo(event.threadID);
 sendByGroup = getLang("sendByGroup", threadName, event.threadID);
 }

 const formMessage = {
 body: getLang("feedback", senderName, event.senderID, sendByGroup, args.join(" ")),
 mentions: [{ id: event.senderID, tag: senderName }],
 attachment: await getStreamsFromAttachment(
 event.attachments.filter(item => mediaTypes.includes(item.type))
 )
 };

 api.sendMessage(formMessage, threadID, (err, info) => {
 if (err) return message.err(err);
 message.reply(getLang("replySuccess"));
 global.GoatBot.onReply.set(info.messageID, {
 commandName,
 messageID: info.messageID,
 messageIDSender: event.messageID,
 threadID: event.threadID,
 type: "userCallAdmin"
 });
 }, messageIDSender);
 break;
 }

 default: break;
 }
 }
};