const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { getStreamFromURL } = global.utils;

module.exports = {
 config: {
 name: "adult"
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 10,
 role: 1,
 shortDescription: {
 en: "🔥 NSFW multi-tool"
 },
 description: {
 en: "NSFW images/videos via boobs, ass, hentai, xnxx, gf, redgifs"
 },
 category: "nsfw",
 guide: {
 en: `
⚠️ Admin Only NSFW Command

+--------------------+
🔞 Usage:
+--------------------+
💦 kshitiz boobs
🍑 kshitiz ass
🎌 kshitiz hentai
📹 kshitiz xnxx [query]
👙 kshitiz gf
🔥 kshitiz redgifs
💧 kshitiz random
`
 }
 },

 onStart: async function ({ api, event, args, message }) {
 const subcmd = args[0]?.toLowerCase();
 const query = args.slice(1).join(" ");

 const sendImg = async (url, title = "") => {
 const imgPath = path.join(__dirname, `cache/kshitiz_${Date.now()}.jpg`);
 const file = fs.createWriteStream(imgPath);
 https.get(url, response => {
 response.pipe(file);
 file.on("finish", () => {
 message.reply({
 body: title,
 attachment: fs.createReadStream(imgPath)
 }, () => fs.unlinkSync(imgPath));
 });
 });
 };

 const redgifs = async () => {
 const res = await axios.get("https://api.redgifs.io/v2/gifs/search?search=nsfw&count=50");
 const gifs = res.data.gifs;
 const random = gifs[Math.floor(Math.random() * gifs.length)];
 const video = await getStreamFromURL(random.urls.hd);
 return message.reply({
 body: `🎥 ${random.title || "RedGifs NSFW"}`,
 attachment: video
 });
 };

 switch (subcmd) {
 case "boobs": {
 const res = await axios.get("https://nekobot.xyz/api/image?type=boobs");
 return sendImg(res.data.message, "💦 Here’s some *boobs* for you!");
 }
 case "ass": {
 const res = await axios.get("https://nekobot.xyz/api/image?type=ass");
 return sendImg(res.data.message, "🍑 Hot *ass* just for you!");
 }
 case "hentai": {
 const res = await axios.get("https://nekos.life/api/v2/img/hentai");
 return sendImg(res.data.url, "🎌 Spicy *Hentai* content!");
 }
 case "xnxx": {
 if (!query) return message.reply("🔎 Please provide a search term like: `+kshitiz xnxx schoolgirl`");
 const res = await axios.get(`https://moc.lol/xnxxsearch?query=${encodeURIComponent(query)}`);
 const vids = res.data.videos;
 if (!vids || vids.length === 0) return message.reply("❌ No results found.");
 const rand = vids[Math.floor(Math.random() * vids.length)];
 return message.reply(`📹 Title: ${rand.title}\n⏱ Duration: ${rand.duration}\n🔗 Link: ${rand.url}`);
 }
 case "gf": {
 const girlImgs = [
 "https://i.imgur.com/qyPQ0Bi.jpg",
 "https://i.imgur.com/YayhGLa.jpg",
 "https://i.imgur.com/XYGqXMB.jpg"
 ];
 const rand = girlImgs[Math.floor(Math.random() * girlImgs.length)];
 return sendImg(rand, "👙 Here’s your virtual *GF*! ❤️");
 }
 case "redgifs": {
 return redgifs();
 }
 case "random": {
 const types = ["boobs", "ass", "hentai", "gf", "redgifs"];
 return this.onStart({ api, event, args: [types[Math.floor(Math.random() * types.length)]], message });
 }
 default:
 return message.reply(`⚠️ Invalid or missing NSFW type.
Type \`+kshitiz\` to see usage guide.`);
 }
 }
};