const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
 config: {
 name: "pic",
 aliases: ["randomimg"],
 version: "2.3",
 author: "Chitron Bhattacharjee",
 countDown: 15,
 role: 0,
 shortDescription: "Anime-style image search — no API key!",
 longDescription: "Fetch images via Unsplash (featured) with fallback to Lorem Picsum",
 category: "download",
 guide: { en: "{pn} <query> -<count>\nExample: `pin manga girl -3`" }
 },

 onStart: async function ({ api, event, args }) {
 const input = args.join(" ");
 const [queryPart, countPart] = input.split("-");
 const query = queryPart?.trim();
 const count = Math.min(Math.max(parseInt(countPart?.trim() || "4"), 1), 6);

 if (!query || isNaN(count)) {
 return api.sendMessage(
 "❌ Usage: `pin <query> -<count>`\nExample: `pic -3`",
 event.threadID,
 event.messageID
 );
 }

 const wait = await api.sendMessage("🔍 Fetching cute images…", event.threadID);
 const attachments = [];
 const today = new Date().toISOString().split("T")[0];

 for (let i = 0; i < count; i++) {
 let url = `https://source.unsplash.com/featured/800x600?${encodeURIComponent(query)}`;

 try {
 const imgRes = await axios.get(url, { responseType: "arraybuffer" });
 url = imgRes.request.res.responseUrl || url;
 const filePath = path.join(__dirname, "cache", `pin_${Date.now()}_${i}.jpg`);
 await fs.outputFile(filePath, imgRes.data);
 attachments.push({ stream: fs.createReadStream(filePath), url });
 } catch {
 // Fallback to Picsum
 url = `https://picsum.photos/800/600?random=${Date.now()}-${i}`;
 const imgRes2 = await axios.get(url, { responseType: "arraybuffer" });
 const filePath = path.join(__dirname, "cache", `pin_fallback_${Date.now()}_${i}.jpg`);
 await fs.outputFile(filePath, imgRes2.data);
 attachments.push({ stream: fs.createReadStream(filePath), url });
 }
 }

 await api.unsendMessage(wait.messageID);
 for (const a of attachments) {
 const caption =
 `💖 𝓔𝓷𝓭𝓵𝒾𝓼𝓼𝓱 Image 🖼️\n` +
 `📅 Date: ${today}\n` +
 `🔍 Query: “${query}”\n` +
 `🔗 Source: ${a.url}`;
 await api.sendMessage({ body: caption, attachment: a.stream }, event.threadID);
 }
 }
};