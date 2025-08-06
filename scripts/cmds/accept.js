const moment = require("moment-timezone");

module.exports = {
 config: {
 name: "accept",
 aliases: ['acp'],
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 8,
 role: 2,
 shortDescription: "accept users",
 longDescription: "accept users",
 category: "Utility",
 },

 onReply: async function ({ message, Reply, event, api, commandName }) {
 const { author, listRequest, messageID } = Reply;
 if (author !== event.senderID) return;
 const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");

 clearTimeout(Reply.unsendTimeout);

 const form = {
 av: api.getCurrentUserID(),
 fb_api_caller_class: "RelayModern",
 variables: {
 input: {
 source: "friends_tab",
 actor_id: api.getCurrentUserID(),
 client_mutation_id: Math.round(Math.random() * 19).toString()
 },
 scale: 3,
 refresh_num: 0
 }
 };

 const success = [];
 const failed = [];

 if (args[0] === "add") {
 form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
 form.doc_id = "3147613905362928";
 }
 else if (args[0] === "del") {
 form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
 form.doc_id = "4108254489275063";
 }
 else {
 return api.sendMessage("⚠️ 𝒰𝓈𝒶𝑔𝑒: add | del <𝓃𝓊𝓂𝒷𝑒𝓇 / all>", event.threadID, event.messageID);
 }

 let targetIDs = args.slice(1);

 if (args[1] === "all") {
 targetIDs = [];
 const lengthList = listRequest.length;
 for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
 }

 const newTargetIDs = [];
 const promiseFriends = [];

 for (const stt of targetIDs) {
 const u = listRequest[parseInt(stt) - 1];
 if (!u) {
 failed.push(`❌ 𝒞𝒶𝓃'𝓉 𝒻𝒾𝓃𝒹 𝓃𝓊𝓂𝒷𝑒𝓇 ${stt}`);
 continue;
 }
 form.variables.input.friend_requester_id = u.node.id;
 form.variables = JSON.stringify(form.variables);
 newTargetIDs.push(u);
 promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
 form.variables = JSON.parse(form.variables);
 }

 const lengthTarget = newTargetIDs.length;
 for (let i = 0; i < lengthTarget; i++) {
 try {
 const friendRequest = await promiseFriends[i];
 if (JSON.parse(friendRequest).errors) {
 failed.push(newTargetIDs[i].node.name);
 }
 else {
 success.push(newTargetIDs[i].node.name);
 }
 }
 catch (e) {
 failed.push(newTargetIDs[i].node.name);
 }
 }

 if (success.length > 0) {
 api.sendMessage(
 `✅ 𝓢𝓾𝓬𝓬𝓮𝓼𝓼! 𝒴𝑜𝓊 𝒽𝒶𝓋𝑒 ${
 args[0] === 'add' ? '𝒶𝒸𝒸𝑒𝓅𝓉𝑒𝒹' : '𝒹𝑒𝓁𝑒𝓉𝑒𝒹'
 } ${success.length} 𝒻𝓇𝒾𝑒𝓃𝒹 𝓇𝑒𝓆𝓊𝑒𝓈𝓉(𝓈):\n\n🌸 ${success.join("\n🌸 ")}${
 failed.length > 0
 ? `\n\n❌ 𝒯𝒽𝑒 𝒻𝑜𝓁𝓁𝑜𝓌𝒾𝓃𝑔 ${failed.length} 𝓊𝓈𝑒𝓇(𝓈) 𝓌𝑒𝓇𝑒 𝓃𝑜𝓉 𝓅𝓇𝑜𝒸𝑒𝓈𝓈𝑒𝒹:\n🔻 ${failed.join("\n🔻 ")}`
 : ""
 }`,
 event.threadID,
 event.messageID
 );
 } else {
 api.unsendMessage(messageID);
 return api.sendMessage(
 "⚠️ 𝒾𝓃𝓋𝒶𝓁𝒾𝒹 𝓇𝑒𝓈𝓅𝑜𝓃𝓈𝑒! 𝒫𝓁𝑒𝒶𝓈𝑒 𝓊𝓈𝑒: add | del <number | all>",
 event.threadID
 );
 }

 api.unsendMessage(messageID);
 },

 onStart: async function ({ event, api, commandName }) {
 const form = {
 av: api.getCurrentUserID(),
 fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
 fb_api_caller_class: "RelayModern",
 doc_id: "4499164963466303",
 variables: JSON.stringify({ input: { scale: 3 } })
 };
 const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;

 let msg = "";
 let i = 0;
 for (const user of listRequest) {
 i++;
 msg += (
 `\n🌸 𝒩𝑜. ${i}`
 + `\n👤 𝒩𝒶𝓂𝑒: 𓆩 ${user.node.name} 𓆪`
 + `\n🆔 𝒰𝐼𝒟: ${user.node.id}`
 + `\n🔗 𝒫𝓇𝑜𝒻𝒾𝓁𝑒: ${user.node.url.replace("www.facebook", "fb")}`
 + `\n⏰ 𝒯𝒾𝓂𝑒: ${moment(user.time * 1009).tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")}\n`
 );
 }

 api.sendMessage(
 `🌟 𝒴𝑜𝓊 𝒽𝒶𝓋𝑒 ${listRequest.length} 𝓅𝑒𝓃𝒹𝒾𝓃𝑔 𝒻𝓇𝒾𝑒𝓃𝒹 𝓇𝑒𝓆𝓊𝑒𝓈𝓉(𝓈):\n${msg}\n📝 𝑅𝑒𝓅𝓁𝓎 𝓌𝒾𝓉𝒽: add | del <𝓃𝓊𝓂𝒷𝑒𝓇 / "𝒶𝓁𝓁">`,
 event.threadID, (e, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName,
 messageID: info.messageID,
 listRequest,
 author: event.senderID,
 unsendTimeout: setTimeout(() => {
 api.unsendMessage(info.messageID);
 }, this.config.countDown * 1000)
 });
 }, event.messageID
 );
 }
};