const axios = require("axios");

module.exports = {
 config: {
 name: "memberlist",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: "MemberList",
 longDescription: "MemberList",
 category: "image",
 guide: "{pn}"
 },
 onStart: async function ({ api, event }) {
 try {
 const threadInfo = await api.getThreadInfo(event.threadID);
 const participants = threadInfo.participantIDs;

 let message = `𝗚𝗥𝗢𝗨𝗣 𝗡𝗔𝗠𝗘: ${threadInfo.name}\n𝗚𝗥𝗢𝗨𝗣 𝗜𝗗: ${event.threadID}\n`;

 for (const userId of participants) {
 const userProfile = await api.getUserInfo(userId);
 const username = userProfile[userId].name;
 message += `𝗨𝗦𝗘𝗥 𝗡𝗔𝗠𝗘: ${username}\n𝗨𝗦𝗘𝗥 𝗜𝗗: ${userId}\n`;
 }

 api.sendMessage(message, event.threadID);
 } catch (error) {
 console.error(error);
 }
 }
};