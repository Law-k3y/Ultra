const axios = require("axios");

module.exports = {
 config: {
 name: "meme",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 role: 0,
 category: "fun",
 shortDescription: {
 en: "Get a random meme from Reddit"
 },
 description: {
 en: "Fetches a random meme from the memes subreddit"
 },
 guide: {
 en: "{pn} — fetch a fresh meme from Reddit"
 }
 },

 onStart: async function ({ message }) {
 try {
 const res = await axios.get("https://meme-api.com/gimme/memes");
 const data = res.data;

 if (!data || !data.url) {
 return message.reply("❌ Couldn't fetch a meme. Try again.");
 }

 const caption = `😂 ${data.title}\n👤 u/${data.author} | 🔺 ${data.ups} ups\n📎 ${data.postLink}`;

 return message.reply({
 body: caption,
 attachment: await global.utils.getStreamFromURL(data.url)
 });

 } catch (error) {
 return message.reply("⚠️ Failed to fetch meme:\n" + error.message);
 }
 }
};