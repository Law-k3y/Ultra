const fs = require("fs-extra");
const https = require("https");
const path = require("path");

const imgUrl = "https://i.imgur.com/5euxmJE.jpeg";
const imgPath = path.join(__dirname, "cache", "intro.jpg");

const introCaptions = [
 "তুই কেডা?",
 "পরিচয় দে!",
 "তোর নাম কী রে?",
 "এতদিন কোথায় ছিলি?",
 "চিনতে পারছি না, কে তুই?",
 "বন্ধু হবি?",
 "তুই কি আগেও আসছিলি?",
 "বস তোর নামটা বল!",
 "কে রে তুই?",
 "নতুন মুখ দেখতেছি!"
];

async function downloadImage(url, dest) {
 const file = fs.createWriteStream(dest);
 return new Promise((resolve, reject) => {
 https.get(url, (res) => {
 res.pipe(file);
 file.on("finish", () => file.close(resolve));
 }).on("error", reject);
 });
}

module.exports = {
 config: {
 name: "intro",
 aliases: [],
 version: "1.2",
 author: "Chitron Bhattacharjee",
 countDown: 2,
 role: 0,
 shortDescription: { en: "Send intro image (no prefix)" },
 longDescription: { en: "Send a styled intro image with Bangla caption. Mention works via tag or reply." },
 category: "fun",
 guide: { en: "Say: intro | intro @tag | reply intro" },
 usePrefix: true,
 useChat: true
 },

 onStart: async function () {},

 onChat: async function ({ event, message, api }) {
 const body = event.body?.toLowerCase();
 if (!body || !/^intro(\s|$)/.test(body)) return;

 if (!fs.existsSync(imgPath)) await downloadImage(imgUrl, imgPath);

 const caption = introCaptions[Math.floor(Math.random() * introCaptions.length)];
 let finalCaption = `🧸 ${caption}`;
 const mentions = [];

 // Mention via @tag
 if (event.mentions && Object.keys(event.mentions).length > 0) {
 for (const [uid, name] of Object.entries(event.mentions)) {
 finalCaption += ` ${name}`;
 mentions.push({ tag: name, id: uid });
 }
 }

 // Mention via reply
 else if (event.type === "message_reply" && event.messageReply?.senderID) {
 const uid = event.messageReply.senderID;
 const name = (await api.getUserInfo(uid))[uid]?.name || "Unknown";
 finalCaption += ` ${name}`;
 mentions.push({ tag: name, id: uid });
 }

 return message.reply({
 body: finalCaption,
 attachment: fs.createReadStream(imgPath),
 mentions
 });
 }
};