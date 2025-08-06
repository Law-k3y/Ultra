const axios = require("axios");
const { getStreamFromURL, shortenURL, randomString } = global.utils;

async function fetchTikTokVideos(query) {
 try {
 const response = await axios.get(`https://lyric-search-neon.vercel.app/kshitiz?keyword=${query}`);
 return response.data;
 } catch (error) {
 console.error(error);
 return null;
 }
}

module.exports = {
 config: {
 name: "lyricvideo",
 aliases: [],
 author: "Chitron Bhattacharjee",
 version: "1.0",
 shortDescription: {
 en: "Play a lyric video",
 },
 longDescription: {
 en: "Search for a lyrical video based on the provided query",
 },
 category: "fun",
 guide: {
 en: "{p}{n} [query]",
 },
 },
 onStart: async function ({ api, event, args, message }) {
 api.setMessageReaction("✨", event.messageID, (err) => {}, true);

 try {
 let query = '';

 if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
 const attachment = event.messageReply.attachments[0];
 if (attachment.type === "video" || attachment.type === "audio") {
 const shortUrl = attachment.url;
 
 query = await shortenURL(shortUrl);

 
 const musicRecognitionResponse = await axios.get(`https://audio-reco.onrender.com/kshitiz?url=${encodeURIComponent(shortUrl)}`);
 query = musicRecognitionResponse.data.title;
 } else {
 throw new Error("Invalid attachment type.");
 }
 } else if (args.length > 0) {
 
 query = args.join(" ");
 } else {
 api.sendMessage({ body: "Please provide a search query or reply to an audio or video." }, event.threadID, event.messageID);
 return;
 }

 
 query += "lyricsvideoedit";

 
 const videos = await fetchTikTokVideos(query);

 if (!videos || videos.length === 0) {
 api.sendMessage({ body: `${query} not found.` }, event.threadID, event.messageID);
 return;
 }

 
 const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
 const videoUrl = selectedVideo.videoUrl;

 if (!videoUrl) {
 api.sendMessage({ body: 'Error: Video not found.' }, event.threadID, event.messageID);
 return;
 }

 
 const videoStream = await getStreamFromURL(videoUrl);
 await api.sendMessage({
 body: ``,
 attachment: videoStream,
 }, event.threadID, event.messageID);

 } catch (error) {
 console.error(error);
 api.sendMessage({ body: 'An error occurred while processing the video.\nPlease try again later.' }, event.threadID, event.messageID);
 }
 },
};