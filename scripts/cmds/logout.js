module.exports = {
 config: {
 name: "logout",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 45,
 role: 0,
 shortDescription: "Logout Bot's Account",
 longDescription: "Logout Bot's Account",
 category: "owner",
 guide: "{p}{n}"
 },
 onStart: async function({ event, api }) {
const permission = global.GoatBot.config.GOD;
 if (!permission.includes(event.senderID)) {
 api.sendMessage("You don't have enough permission to use this command. Only My Authors Have Access.", event.threadID, event.messageID);
 return;
 }
 api.sendMessage("Successfully logged out...", event.threadID, event.messageID);
 api.logout();
}
};