const https = require("https");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
 config: {
 name: "cat",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: { en: "random cat image" },
 longDescription: { en: "Sends a random cat image" },
 category: "fun",
 guide: { en: "+cat" }
 },

 onStart: async function ({ message }) {
 const url = "https://cataas.com/cat";
 const cachePath = path.join(__dirname, "cache/cat.jpg");

 const file = fs.createWriteStream(cachePath);
 https.get(url, (res) => {
 res.pipe(file);
 file.on("finish", () => {
 message.reply({
 body: "🐱 Here's a random cat for you!",
 attachment: fs.createReadStream(cachePath)
 });
 });
 });
 }
};