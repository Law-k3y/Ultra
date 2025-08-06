const axios = require("axios");

module.exports = {
 config: {
 name: "numfact",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: { en: "fun number fact" },
 longDescription: { en: "Get a random fact about a number" },
 category: "fun",
 guide: { en: "+numfact [number] (optional)" }
 },

 onStart: async function ({ args, message }) {
 const num = args[0] || "random";
 try {
 const res = await axios.get(`http://numbersapi.com/${num}`);
 message.reply(`🔢 Fact about ${num}:\n${res.data}`);
 } catch (e) {
 message.reply("❌ Couldn't fetch a fact at the moment.");
 }
 }
};