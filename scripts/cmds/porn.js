const axios = require("axios");

// Helper function to convert text to mathematical bold characters
function toBold(text) {
 const normalChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
 const boldChars = '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵';
 
 let result = '';
 for (const char of text) {
 const index = normalChars.indexOf(char);
 result += index !== -1 ? boldChars[index] : char;
 }
 return result;
}

module.exports = {
 config: {
 name: "porn",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Search porn videos"
 },
 longDescription: {
 en: "Search and display videos from porn.com using a search keyword"
 },
 category: "media",
 guide: {
 en: "+porn [search term]\nExample: +porn teen"
 }
 },

 onStart: async function ({ message, args, event, commandName }) {
 const query = args.join(" ");
 if (!query) return message.reply("❌ | Please provide a search term.\nExample: +porn teen");

 const apiUrl = `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(query)}&format=json`;

 try {
 const res = await axios.get(apiUrl);
 const data = res.data;

 if (!data?.videos?.length) {
 return message.reply(`❌ | No videos found for: ${toBold(query)}`);
 }

 const topVideos = data.videos.slice(0, 10);
 
 // Prepare message with thumbnails
 let output = `🔍 Results for: ${query}\n\n`;
 const attachments = [];
 
 for (let i = 0; i < Math.min(5, topVideos.length); i++) {
 const video = topVideos[i];
 output += `📼 ${i + 1}. ${video.title}\n⏱️ ${video.length_min} min | 👍 ${video.rating}/5\n🌐 Url: https://www.eporner.com/video-${video.id}/${video.slug}/\n\n`;
 
 
 // Get thumbnail
 try {
 const thumbResponse = await axios.get(video.default_thumb.src, { responseType: 'stream' });
 attachments.push(thumbResponse.data);
 } catch (e) {
 console.error(`Failed to get thumbnail for video ${i + 1}`);
 }
 }

 output += `\nReply with the number (1-${Math.min(5, topVideos.length)}) to get the video URL.`;
 
 await message.reply({
 body: output,
 attachment: attachments
 });

 // Store video data for reply handling
 global.GoatBot.onReply.set(event.messageID, {
 commandName,
 author: event.senderID,
 messageID: event.messageID,
 videos: topVideos
 });

 } catch (e) {
 console.error(e);
 return message.reply("❌ | Failed to fetch video data. Please try again later.");
 }
 },

 onReply: async function ({ message, Reply, event }) {
 const { author, commandName, videos } = Reply;
 if (event.senderID !== author) return;
 
 const selectedNum = parseInt(event.body);
 if (isNaN(selectedNum)) {
 return message.reply("❌ | Please reply with a number from the list.");
 }
 
 const videoIndex = selectedNum - 1;
 if (videoIndex < 0 || videoIndex >= Math.min(5, videos.length)) {
 return message.reply("❌ | Invalid selection. Please choose a number from the list.");
 }
 
 const selectedVideo = videos[videoIndex];
 
 try {
 // Get video embed page to extract direct video URL
 const embedUrl = `https://www.eporner.com/embed/${selectedVideo.id}`;
 const embedResponse = await axios.get(embedUrl);
 const embedHtml = embedResponse.data;
 
 // Extract the video source URL from the embed page
 const videoUrlMatch = embedHtml.match(/src="(https:\/\/[^"]+\.mp4)"/i);
 const videoUrl = videoUrlMatch ? videoUrlMatch[1] : null;
 
 if (!videoUrl) {
 throw new Error("Could not extract video URL");
 }
 
 await message.reply({
 body: `🎥 ${selectedVideo.title}\n⏱️ ${selectedVideo.length_min} min | 👍 ${selectedVideo.rating}/5\n\n🔗 Direct video URL:\n${videoUrl}`,
 attachment: await global.utils.getStreamFromURL(selectedVideo.default_thumb.src)
 });
 
 } catch (e) {
 console.error(e);
 // Fallback to page URL if direct video URL can't be obtained
 const fallbackUrl = `https://www.eporner.com/video-${selectedVideo.id}/${selectedVideo.slug}/`;
 await message.reply({
 body: `🎥 ${selectedVideo.title}\n⏱️ ${selectedVideo.length_min} min | 👍 ${selectedVideo.rating}/5\n\n❌ Couldn't get direct video URL. Here's the page link:\n${fallbackUrl}`,
 attachment: await global.utils.getStreamFromURL(selectedVideo.default_thumb.src)
 });
 }
 
 global.GoatBot.onReply.delete(event.messageID);
 }
};