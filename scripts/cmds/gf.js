const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
 config: {
 name: "gf",
 version: "1.1",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: "random girl image",
 longDescription: "Sends a random girl image when someone types 'gf'",
 category: "no prefix"
 },

 onStart: async function () {},

 onChat: async function ({ event, message }) {
 if (!event.body) return;
 const text = event.body.toLowerCase();

 // Match various forms of "gf"
 if (/^\s*(g[\s._-]?f)\s*$/i.test(text)) {
 try {
 // Get random girl image from API
 const res = await axios.get("https://api.waifu.pics/sfw/waifu"); // you can change API
 const imageUrl = res.data.url;

 return message.reply({
 body: "❤️ Here's your GF:\n𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥: Chitron Bhattacharjee",
 attachment: await getStreamFromURL(imageUrl)
 });
 } catch (e) {
 return message.reply("⚠️ Failed to fetch image. Try again.");
 }
 }
 }
};