const axios = require("axios");
const fs = require("fs");
const yts = require("yt-search");
const path = require("path");
const cacheDir = path.join(__dirname, "cache");

module.exports = {
 config: {
 name: "sing",
 version: "3.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 longDescription: { en: "Search and download audio from YouTube" },
 category: "media",
 guide: { en: "{pn} <song name>" },
 },

 onStart: async ({ api, args, event }) => {
 if (!args[0]) return api.sendMessage("Please provide song name.", event.threadID, event.messageID);
 api.setMessageReaction("⏳", event.messageID, () => {}, true);
 try {
 const { videos } = await yts(args.join(" "));
 if (!videos[0]) return api.sendMessage("No results found.", event.threadID, event.messageID);
 const video = videos[0], url = `https://musicapiz.vercel.app/music?url=${encodeURIComponent(video.url)}`;
 const { data } = await axios.get(url);
 if (!data?.download_url) return api.sendMessage("Failed to get download link.", event.threadID, event.messageID);
 const file = path.join(cacheDir, `${video.videoId}.mp3`);
 const res = await axios.get(data.download_url, { responseType: 'stream' });
 res.data.pipe(fs.createWriteStream(file)).on("finish", () => {
 api.sendMessage({
 body: `🎵 Title: ${data.title}\n⏳ Duration: ${data.duration}\n📥 Quality: ${data.quality}`,
 attachment: fs.createReadStream(file)
 }, event.threadID, () => fs.unlinkSync(file), event.messageID);
 api.setMessageReaction("✅", event.messageID, () => {}, true);
 });
 } catch (e) {
 console.error(e);
 api.sendMessage("Error occurred.", event.threadID, event.messageID);
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 }
 }
};