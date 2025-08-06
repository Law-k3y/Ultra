const axios = require("axios");
const baseApiUrl = async () => {
 const base = await axios.get(
 `https://raw.githubusercontent.com/ARYAN-AROHI-STORE/A4YA9-A40H1/refs/heads/main/APIRUL.json`,
 );
 return base.data.api;
};

function transformText(input) {
 const fontMap = {
 " ": " ",
 a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒",
 j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖", n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛",
 s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
 A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸",
 J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼", N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁",
 S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉"
 };
 return input.split("").map(c => fontMap[c] || c).join("");
}

module.exports = {
 config: {
 name: "flag",
 aliases: ["flagGame"],
 version: "3.0",
 author: "Chitron Bhattacharjee",
 countDown: 0,
 role: 0,
 description: {
 en: "🎌 𝙂𝘂𝘦𝘴𝘴 𝘁𝘩𝘦 𝘧𝘭𝘢𝘨 𝘢𝘯𝘥 𝘸𝘪𝘯 𝘳𝘦𝘸𝘢𝘳𝘥𝘴!",
 },
 category: "game",
 guide: {
 en: "{pn} - 𝙧𝙚𝙥𝙡𝙮 𝙩𝙤 𝙩𝙝𝙚 𝙛𝙡𝙖𝙜 𝙞𝙢𝙖𝙜𝙚 𝙬𝙞𝙩𝙝 𝙩𝙝𝙚 𝙘𝙤𝙪𝙣𝙩𝙧𝙮 𝙣𝙖𝙢𝙚",
 },
 },

 onReply: async function ({ api, event, Reply, usersData }) {
 const { country, attempts, messageID } = Reply;
 const maxAttempts = 5;
 if (event.type !== "message_reply") return;

 const reply = event.body.toLowerCase();
 const coinReward = 241; // 2 * 120.5
 const expReward = 121; // 1 * 121

 const userData = await usersData.get(event.senderID);

 if (attempts >= maxAttempts) {
 return api.sendMessage(
 transformText("🚫 | 𝙊𝙤𝙥𝙨! 𝙔𝙤𝙪'𝙫𝙚 𝙧𝙚𝙖𝙘𝙝𝙚𝙙 𝙩𝙝𝙚 𝙢𝙖𝙭 𝙖𝙩𝙩𝙚𝙢𝙥𝙩𝙨 (5). 𝙏𝙧𝙮 𝙖𝙜𝙖𝙞𝙣 𝙡𝙖𝙩𝙚𝙧!"),
 event.threadID,
 event.messageID
 );
 }

 if (reply === country.toLowerCase()) {
 try {
 await api.unsendMessage(messageID);

 await usersData.set(event.senderID, {
 money: userData.money + coinReward,
 exp: userData.exp + expReward,
 data: userData.data,
 });

 await api.sendMessage(
 transformText(`✅ | 𝘆𝘢𝘺! 𝘆𝘰𝘶 𝙜𝙤𝙩 𝙞𝙩 𝙧𝙞𝙜𝙝𝙩!\n💰 𝙀𝙖𝙧𝙣𝙚𝙙: ${coinReward} 𝙘𝙤𝙞𝙣𝙨 💎\n✨ 𝙇𝙚𝙫𝙚𝙡 𝙪𝙥: +${expReward} 𝙀𝙓𝙋`),
 event.threadID,
 event.messageID
 );
 } catch (err) {
 console.log("Error:", err.message);
 }
 } else {
 Reply.attempts += 1;
 global.GoatBot.onReply.set(messageID, Reply);
 await api.sendMessage(
 transformText(`❌ | 𝙉𝙤𝙥𝙚! 𝙏𝙝𝙖𝙩'𝙨 𝙣𝙤𝙩 𝙞𝙩! 𝙔𝙤𝙪 𝙝𝙖𝙫𝙚 ${maxAttempts - Reply.attempts} 𝙩𝙧𝙮𝙨 𝙡𝙚𝙛𝙩.\n💖 𝙏𝙧𝙮 𝙖𝙜𝙖𝙞𝙣 𝙗𝙖𝙗𝙮~`),
 event.threadID,
 event.messageID
 );
 }
 },

 onStart: async function ({ api, args, event }) {
 try {
 if (!args[0]) {
 const response = await axios.get(
 `${await baseApiUrl()}/flagGame?randomFlag=random`,
 );
 const { link, country } = response.data;

 await api.sendMessage(
 {
 body: transformText("🎌 | 𝙂𝙪𝙚𝙨𝙨 𝙩𝙝𝙞𝙨 𝙛𝙡𝙖𝙜! 𝙍𝙚𝙥𝙡𝙮 𝙬𝙞𝙩𝙝 𝙩𝙝𝙚 𝙘𝙤𝙪𝙣𝙩𝙧𝙮 𝙣𝙖𝙢𝙚 𝙩𝙤 𝙬𝙞𝙣! 💖"),
 attachment: await global.utils.getStreamFromURL(link),
 },
 event.threadID,
 (error, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 link,
 country,
 attempts: 0,
 });
 },
 event.messageID,
 );
 }
 } catch (error) {
 console.error(`Error: ${error.message}`);
 api.sendMessage(
 transformText(`⚠️ | 𝙎𝙤𝙧𝙧𝙮, 𝙨𝙤𝙢𝙚𝙩𝙝𝙞𝙣𝙜 𝙬𝙚𝙣𝙩 𝙬𝙧𝙤𝙣𝙜... 💔`),
 event.threadID,
 event.messageID,
 );
 }
 },
};