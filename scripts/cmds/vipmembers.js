const fs = require('fs').promises;
const path = require('path');
const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", 'png', "animated_image", "video", "audio"];
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
 config: {
 name: "vip",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 vi: "",
 en: "handle vip members"
 },
 longDescription: {
 vi: "",
 en: "handle vip members"
 },
 category: "admin",
 guide: {
 vi: "",
 en: "{p} vip <message> to sent msg to vip user\n{p} vip add {uid} \n {p} vip remove {uid} \n {p} vip list"
 }
 },

 langs: {
 vi: {

 },
 en: {
 missingMessage: "you need to be vip member to use this feature.",
 sendByGroup: "\n- Sent from group: %1\n- Thread ID: %2",
 sendByUser: "\n- Sent from user",
 content: "\n\nContent:%1\nReply this message to send message",
 success: "Sent your message to VIP successfully!\n%2",
 failed: "An error occurred while sending your message to VIP\n%2\nCheck console for more details",
 reply: "📍 Reply from VIP %1:\n%2",
 replySuccess: "Sent your reply to VIP successfully!",
 feedback: "📝 Feedback from VIP user %1:\n- User ID: %2\n%3\n\nContent:%4",
 replyUserSuccess: "Sent your reply to VIP user successfully!",
 noAdmin: "You don't have permission to perform this action.",
 addSuccess: "Member has been added to the VIP list!",
 alreadyInVIP: "Member is already in the VIP list!",
 removeSuccess: "Member has been removed from the VIP list!",
 notInVIP: "Member is not in the VIP list!",
 list: "VIP Members list:\n%1",
 vipModeEnabled: "VIP mode has been enabled ✅",
 vipModeDisabled: "VIP mode has been disabled ✅"
 }
 },

 onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
 const vipDataPath = path.join(__dirname, 'vip.json'); 
 const { senderID, threadID, isGroup } = event;

 if (!config.adminBot.includes(senderID)) {
 return message.reply(getLang("noAdmin"));
 }

 if (args[0] === 'on') {
 try {
 config.whiteListMode.enable = true;
 const vipData = await fs.readFile(vipDataPath).then(data => JSON.parse(data)).catch(() => ({}));
 if (!vipData.permission) {
 vipData.permission = [];
 }
 config.whiteListMode.whiteListIds = vipData.permission; 
 await fs.writeFile(client.dirConfig, JSON.stringify(config, null, 2));
 return message.reply(getLang("vipModeEnabled"));
 } catch (error) {
 console.error("Error enabling VIP mode:", error);
 return message.reply("An error occurred while enabling VIP mode.");
 }
 } else if (args[0] === 'off') {
 try {
 config.whiteListMode.enable = false;
 await fs.writeFile(client.dirConfig, JSON.stringify(config, null, 2));
 return message.reply(getLang("vipModeDisabled"));
 } catch (error) {
 console.error("Error disabling VIP mode:", error);
 return message.reply("An error occurred while disabling VIP mode.");
 }
 }

 
 if (args[0] === 'add' && args.length === 2) {
 const userId = args[1];
 const vipData = await fs.readFile(vipDataPath).then(data => JSON.parse(data)).catch(() => ({}));
 if (!vipData.permission) {
 vipData.permission = [];
 }
 if (!vipData.permission.includes(userId)) {
 vipData.permission.push(userId);
 await fs.writeFile(vipDataPath, JSON.stringify(vipData, null, 2));
 return message.reply(getLang("addSuccess"));
 } else {
 return message.reply(getLang("alreadyInVIP"));
 }
 } else if (args[0] === 'remove' && args.length === 2) {
 const userId = args[1];
 const vipData = await fs.readFile(vipDataPath).then(data => JSON.parse(data)).catch(() => ({}));
 if (!vipData.permission) {
 vipData.permission = [];
 }
 if (vipData.permission.includes(userId)) {
 vipData.permission = vipData.permission.filter(id => id !== userId);
 await fs.writeFile(vipDataPath, JSON.stringify(vipData, null, 2));
 return message.reply(getLang("removeSuccess"));
 } else {
 return message.reply(getLang("notInVIP"));
 }
 } else if (args[0] === 'list') {
 const vipData = await fs.readFile(vipDataPath).then(data => JSON.parse(data)).catch(() => ({}));
 const vipList = vipData.permission ? await Promise.all(vipData.permission.map(async id => {
 const name = await usersData.getName(id);
 return `${id}-(${name})`;
 })) : '';
 return message.reply(getLang("list", vipList.join('\n') || ''));
 } else if (!config.whiteListMode.enable) {
 
 return message.reply("Turn on Vip mode to send msg to vip members.");
 }

 
 const vipData = await fs.readFile(vipDataPath).then(data => JSON.parse(data)).catch(() => ({}));
 if (!vipData.permission || !vipData.permission.includes(senderID)) {
 return message.reply(getLang("missingMessage"));
 }

 if (!args[0]) {
 return message.reply(getLang("missingMessage"));
 }

 const senderName = await usersData.getName(senderID);
 const msg = "==📨️ VIP MESSAGE 📨️=="
 + `\n- User Name: ${senderName}`
 + `\n- User ID: ${senderID}`

 const formMessage = {
 body: msg + getLang("content", args.join(" ")),
 mentions: [{
 id: senderID,
 tag: senderName
 }],
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
 } catch (error) {
 console.error("Error sending message to VIP:", error);
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
 mentions: [{
 id: event.senderID,
 tag: senderName
 }],
 attachment: await getStreamsFromAttachment(
 event.attachments.filter(item => mediaTypes.includes(item.type))
 )
 };

 api.sendMessage(formMessage, threadID, (err, info) => {
 if (err)
 return message.err(err);
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
 mentions: [{
 id: event.senderID,
 tag: senderName
 }],
 attachment: await getStreamsFromAttachment(
 event.attachments.filter(item => mediaTypes.includes(item.type))
 )
 };

 api.sendMessage(formMessage, threadID, (err, info) => {
 if (err)
 return message.err(err);
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
 default: {
 break;
 }
 }
 }
};