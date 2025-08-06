const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
 config: {
 name: "imgsrch",
 version: "3.0",
 author: "Chitron Bhattacharjee",
 description: {
 en: "🔍 Search and send images with Google Lens links"
 },
 category: "media",
 guide: {
 en: "{pn} [query] - Example: {pn} sunset beach"
 },
 role: 0,
 countDown: 15
 },

 langs: {
 en: {
 missingQuery: "🌄 Please enter search terms (e.g. 'cute dogs')",
 noResults: "❌ No images found for your search",
 errorDownload: "⚠️ Error downloading images. Try different keywords.",
 apiError: "❌ API limit reached or connection failed",
 resultsHeader: "📸 Results for: \"%1\""
 }
 },

 onStart: async function ({ api, event, args, message, getLang }) {
 // Create temp directory if it doesn't exist
 const tempDir = path.join(__dirname, 'temp');
 if (!fs.existsSync(tempDir)) {
 fs.mkdirSync(tempDir);
 }

 try {
 api.setMessageReaction("⏳", event.messageID, () => {}, true);

 const query = args.join(" ");
 if (!query) {
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 return message.reply(getLang("missingQuery"));
 }

 // Google Custom Search API
 const API_KEY = "AIzaSyApKVVy6L44Qz21LR2BJWRhf7yP4qmczvg";
 const CX = "b4c33dfdc37784f23";
 const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${CX}&key=${API_KEY}&searchType=image&num=5&safe=high`;

 try {
 api.setMessageReaction("⏱️", event.messageID, () => {}, true);

 const response = await axios.get(searchUrl, { timeout: 10000 });
 const items = response.data.items;
 
 if (!items || items.length === 0) {
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 return message.reply(getLang("noResults"));
 }

 // Download images (max 3)
 const imgAttachments = [];
 const downloadPromises = [];
 
 for (let i = 0; i < Math.min(3, items.length); i++) {
 const imgUrl = items[i].link;
 const imgPath = path.join(tempDir, `img_${event.senderID}_${Date.now()}_${i}.jpg`);
 
 downloadPromises.push(
 axios.get(imgUrl, {
 responseType: 'arraybuffer',
 timeout: 10000
 })
 .then(response => {
 fs.writeFileSync(imgPath, response.data);
 imgAttachments.push(fs.createReadStream(imgPath));
 })
 .catch(err => {
 console.error(`Error downloading image ${i}:`, err);
 })
 );
 }

 await Promise.all(downloadPromises);

 if (imgAttachments.length === 0) {
 throw new Error("All image downloads failed");
 }

 // Generate Google Lens links
 const lensLinks = items.slice(0, imgAttachments.length).map(item => 
 `🔗 Lens: https://lens.google.com/uploadbyurl?url=${encodeURIComponent(item.link)}`
 );

 await message.reply({
 body: `${getLang("resultsHeader", query)}\n\n${lensLinks.join('\n')}`,
 attachment: imgAttachments
 });

 // Cleanup
 imgAttachments.forEach(attachment => {
 try {
 fs.unlinkSync(attachment.path);
 } catch (e) {
 console.error("Error deleting file:", e);
 }
 });

 api.setMessageReaction("✅", event.messageID, () => {}, true);

 } catch (error) {
 console.error("Processing Error:", error);
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 message.reply(getLang("errorDownload"));
 }
 } catch (error) {
 console.error("Global Error:", error);
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 message.reply(getLang("apiError"));
 }
 }
};