module.exports = {
 config: {
 name: "supportgc",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 30,
 role: 0,
 shortDescription: {
 en: "Add user to support group"
 },
 longDescription: {
 en: "This command adds the user to the admin support group."
 },
 category: "support",
 guide: {
 en: "To use this command, simply type -support."
 }
 },

 onStart: async function ({ api, args, message, event }) {
 const supportGroupId = "9815886431866723"; // ID of the support group

 const threadID = event.threadID;
 const userID = event.senderID;

 // Check if the user is already in the support group
 try {
 const threadInfo = await api.getThreadInfo(supportGroupId);
 const participantIDs = threadInfo.participantIDs;
 if (participantIDs.includes(userID)) {
 // User is already in the support group
 api.sendMessage(
 "You are already in the support group. If you didn't find it, please check your message requests or spam box.",
 threadID
 );
 } else {
 // Add user to the support group
 api.addUserToGroup(userID, supportGroupId, (err) => {
 if (err) {
 console.error("Failed to add user to support group:", err);
 api.sendMessage(
 "I can't add you because your ID is not allowed to message or your account is private. Please add me and try again...",
 threadID
 );
 } else {
 api.sendMessage(
 "You have been added to the admin support group. If you didn't find the box in your inbox, please check your message requests or spam box.",
 threadID
 );
 }
 });
 }
 } catch (e) {
 console.error("Failed to get thread info:", e);
 api.sendMessage(
 "Failed to retrieve the support group information. Please try again later.",
 threadID
 );
 }
 }
};