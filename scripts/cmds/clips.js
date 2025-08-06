const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

const API_KEY = "ix8FP76ppacB7pQSAp12Fp6UJSprS23TQOVYhUBT9pxu7rjAvmleUZaY";

module.exports = {
 config: {
 name: "clips",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: { en: "Search Pexels videos" },
 longDescription: { en: "Search Pexels videos, view thumbnails, and download by replying video number" },
 category: "media",
 guide: { en: "{pn} <search keyword>\nThen reply 1-20 to download video." }
 },

 onStart: async function ({ args, message, event }) {
 const query = args.join(" ");
 if (!query) return message.reply("❌ Type a keyword.\nExample: +vid nature");

 const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=20`;

 try {
 const res = await axios.get(url, {
 headers: { Authorization: API_KEY }
 });

 const videos = res.data.videos;
 if (!videos.length) return message.reply("😥 No videos found.");

 const attachments = [];
 let text = "🎬 𝙋𝙀𝙓𝙀𝙇𝙎 𝙑𝙄𝘿𝙀𝙊 𝙎𝙀𝘼𝙍𝘾𝙃\n━━━━━━━━━━━━━━━\n";

 videos.forEach((video, i) => {
 text += `✨ 𝗩𝗶𝗱𝗲𝗼 ${i + 1}:\n`;
 text += `🎞 𝗧𝗶𝘁𝗹𝗲: ${video.user?.name || "Unknown"}\n`;
 text += `⏱ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${video.duration}s\n`;
 text += `───────────────\n`;

 const thumbUrl = video.image;
 const thumbPath = path.join(__dirname, "cache", `thumb_${i}.jpg`);

 attachments.push(new Promise(resolve => {
 if (fs.existsSync(thumbPath)) return resolve(fs.createReadStream(thumbPath));

 https.get(thumbUrl, (res) => {
 const stream = fs.createWriteStream(thumbPath);
 res.pipe(stream);
 stream.on("finish", () => resolve(fs.createReadStream(thumbPath)));
 });
 }));
 });

 const allImages = await Promise.all(attachments);
 return message.reply({
 body: text + "\n📩 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝘁𝗵𝗲 𝗩𝗶𝗱𝗲𝗼 𝗡𝗼. (1-20) 𝘁𝗼 𝗴𝗲𝘁 𝗳𝘂𝗹𝗹 𝘃𝗶𝗱𝗲𝗼.\n👑 𝗔𝗣𝗜 𝗢𝘄𝗻𝗲𝗿: Chitron Bhattacharjee",
 attachment: allImages
 }, (err, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName: "vid",
 messageID: info.messageID,
 results: videos
 });
 });

 } catch (err) {
 console.error(err);
 return message.reply("❌ Failed to fetch videos.");
 }
 },

 onReply: async function ({ event, message, Reply }) {
 const index = parseInt(event.body);
 if (isNaN(index) || index < 1 || index > 20) return message.reply("❌ Invalid number. Reply with 1 to 20.");

 const video = Reply.results[index - 1];
 const videoUrl = video.video_files.find(v => v.quality === "hd" && v.file_type === "video/mp4")?.link || video.video_files[0].link;
 const filePath = path.join(__dirname, "cache", `video_${video.id}.mp4`);

 try {
 await new Promise((resolve) => {
 const file = fs.createWriteStream(filePath);
 https.get(videoUrl, (res) => {
 res.pipe(file);
 file.on("finish", () => resolve());
 });
 });

 const caption = `🎬 *${video.user?.name || "Untitled"}*\n⏱ *Duration:* ${video.duration}s\n📎 *Size:* ${Math.round(video.video_files[0].file_size / 1024)} KB\n🔗 *URL:* ${video.url}\n\n👑 *Powered by Chitron Bhattacharjee*`;

 return message.reply({
 body: caption,
 attachment: fs.createReadStream(filePath)
 });

 } catch (err) {
 console.error(err);
 return message.reply("⚠️ Couldn't download the video.");
 }
 }
};