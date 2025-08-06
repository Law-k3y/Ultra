const axios = require('axios');

module.exports = {
 config: {
 name: "botsearch",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 description: "🔍 Search using Google Custom Search",
 category: "utility",
 guide: {
 en: "{pn} [query] - Example: {pn} how to make a bot"
 }
 },

 onStart: async function ({ api, event, args, message }) {
 try {
 const query = args.join(" ");
 if (!query) return message.reply("Please enter a search query");

 // Your credentials (replace these)
 const API_KEY = "AIzaSyApKVVy6L44Qz21LR2BJWRhf7yP4qmczvg";
 const CX = "b4c33dfdc37784f23"; // Your Search Engine ID

 const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${CX}&key=${API_KEY}`;

 message.reply("🔍 Searching...", async (err, info) => {
 try {
 const response = await axios.get(url);
 const results = response.data.items;

 if (!results || results.length === 0) {
 return message.reply("No results found for your query");
 }

 let messageText = `📚 Search Results for: "${query}"\n\n`;
 results.slice(0, 5).forEach((item, index) => {
 messageText += `${index + 1}. ${item.title}\n${item.link}\n\n`;
 });

 api.sendMessage(messageText, event.threadID);
 api.unsendMessage(info.messageID);

 } catch (error) {
 console.error("Search Error:", error);
 message.reply("⚠️ Error performing search. API limit may be reached.");
 }
 });

 } catch (error) {
 console.error(error);
 message.reply("❌ An error occurred while searching");
 }
 }
};