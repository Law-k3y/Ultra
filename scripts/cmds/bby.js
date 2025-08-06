const axios = require('axios');
const baseApiUrl = async () => {
 return "https://www.noobs-api.rf.gd/dipto";
};

module.exports.config = {
 name: "bby",
 aliases: ["baby", "bbe", "bot", "chitron", "babe"],
 version: "7.0.0",
 author: "Chitron Bhattacharjee",
 countDown: 0,
 role: 0,
 description: "Cute chatbot for flirty/fun talks",
 category: "𝗔𝗜 & 𝗚𝗣𝗧",
 guide: {
 en: "{pn} [your message] (or just say: baby...)"
 }
};

module.exports.onStart = async ({ api, event, args }) => {
 const link = `${await baseApiUrl()}/baby`;
 const text = args.join(" ").toLowerCase();
 const uid = event.senderID;

 if (!text) {
 const ran = ["💬 Bolo baby...", "💖 Hmm?", "😗 Type something, cutie!", "😋 Ami kichu bolbo?"];
 return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
 }

 try {
 const d = (await axios.get(`${link}?text=${encodeURIComponent(text)}&senderID=${uid}&font=1`)).data.reply;
 api.sendMessage(d, event.threadID, (error, info) => {
 if (!info) return api.sendMessage("⚠️ Couldn't send reply", event.threadID);
 global.GoatBot.onReply.set(info.messageID, {
 commandName: module.exports.config.name,
 type: "reply",
 messageID: info.messageID,
 author: uid
 });
 }, event.messageID);
 } catch (e) {
 console.log(e);
 api.sendMessage("🚫 Error occurred while chatting.", event.threadID, event.messageID);
 }
};

module.exports.onReply = async ({ api, event }) => {
 try {
 const replyText = event.body?.toLowerCase() || "";
 const d = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(replyText)}&senderID=${event.senderID}&font=1`)).data.reply;
 api.sendMessage(d, event.threadID, (error, info) => {
 if (!info) return;
 global.GoatBot.onReply.set(info.messageID, {
 commandName: module.exports.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID
 });
 }, event.messageID);
 } catch (err) {
 api.sendMessage("⚠️ Couldn't reply to your message.", event.threadID, event.messageID);
 }
};

module.exports.onChat = async ({ api, event, message }) => {
 try {
 const body = event.body?.toLowerCase() || "";
 if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("বেবি") || body.startsWith("bot") || body.startsWith("chitron") || body.startsWith("babu") || body.startsWith("বট")) {
 const arr = body.replace(/^\S+\s*/, "");
 const uid = event.senderID;
 const link = `${await baseApiUrl()}/baby`;

 const randomReplies = [
 "😏 Tui bollei mon gulo fuler moto fute uthe",
 "😉 Ei raat e tumi aar ami... kichu ekta spicy hobe naki?",
 "💋 Tor voice ta amar heart-er ringtone hote pare!",
 "😼 Dekhlei tor chokh e chemistry lage... physics nai?",
 "😇 Bujhlam, tui flirt kora sikhli amar theke!",
 "🥀 Tui jodi chash hoye jash, ami tor ghum bhenge debo...",
 "👀 Toke dekhe mon chay... daily dekhi!",
 ];

 if (!arr) {
 return api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
 if (!info) return;
 global.GoatBot.onReply.set(info.messageID, {
 commandName: module.exports.config.name,
 type: "reply",
 messageID: info.messageID,
 author: uid
 });
 }, event.messageID);
 }

 const d = (await axios.get(`${link}?text=${encodeURIComponent(arr)}&senderID=${uid}&font=1`)).data.reply;
 api.sendMessage(d, event.threadID, (error, info) => {
 if (!info) return;
 global.GoatBot.onReply.set(info.messageID, {
 commandName: module.exports.config.name,
 type: "reply",
 messageID: info.messageID,
 author: uid
 });
 }, event.messageID);
 }
 } catch (err) {
 return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
 }
};