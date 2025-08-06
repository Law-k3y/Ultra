const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
 config: {
 name: "anime",
 aliases: ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold", "nom", "bite", "glomp", "slap", "kill", "kick", "happy", "wink", "poke", "dance", "cringe"],
 version: "1.4.0",
 author: "Chitron Bhattacharjee",
 countDown: 10,
 role: 0,
 shortDescription: {
 en: "Get random anime-style images with live feedback"
 },
 longDescription: {
 en: "Fetch and send random anime-style images of various categories from the waifu.pics API, with real-time feedback through message reactions."
 },
 category: "anime",
 guide: {
 en: "{prefix}anime [category]\n\nAvailable categories: waifu, neko, shinobu, megumin, bully, cuddle, cry, hug, awoo, kiss, lick, pat, smug, bonk, yeet, blush, smile, wave, highfive, handhold, nom, bite, glomp, slap, kill, kick, happy, wink, poke, dance, cringe"
 }
 },

 onStart: async function ({ api, event, args }) {
 const validCategories = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold", "nom", "bite", "glomp", "slap", "kill", "kick", "happy", "wink", "poke", "dance", "cringe"];
 
 let category = args[0]?.toLowerCase() || "waifu";
 
 if (!validCategories.includes(category)) {
 api.setMessageReaction("❓", event.messageID, (err) => {}, true);
 return api.sendMessage(`Invalid category. Available categories are: ${validCategories.join(", ")}`, event.threadID, event.messageID);
 }

 api.setMessageReaction("⏳", event.messageID, (err) => {}, true);

 try {
 const response = await axios.get(`https://api.waifu.pics/sfw/${category}`);
 const imageUrl = response.data.url;

 const imageName = `${category}.jpg`;
 const imagePath = path.join(__dirname, 'cache', imageName);

 const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
 await fs.outputFile(imagePath, imageResponse.data);

 api.setMessageReaction("🖼️", event.messageID, (err) => {}, true);

 await api.sendMessage(
 {
 attachment: fs.createReadStream(imagePath),
 body: `🌸 Here's your random ${category} image:`
 },
 event.threadID,
 (err, info) => {
 if (err) {
 console.error(`Error sending image for ${category}:`, err);
 api.setMessageReaction("❌", event.messageID, (err) => {}, true);
 } else {
 api.setMessageReaction("✅", event.messageID, (err) => {}, true);
 }
 }
 );

 await fs.remove(imagePath);
 } catch (error) {
 console.error(`Error in anime command (${category}):`, error);
 api.sendMessage(`Sorry, I couldn't fetch a ${category} image right now. Please try again later.`, event.threadID, event.messageID);
 api.setMessageReaction("❌", event.messageID, (err) => {}, true);
 }
 }
};