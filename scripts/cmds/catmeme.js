const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
 config: {
 name: "catmeme",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: { en: "Generate a cat image with your text" },
 longDescription: { en: "Get a cute cat image with custom text on it." },
 category: "fun",
 guide: { en: "+catmeme Your funny text here" }
 },

 onStart: async function ({ message, args }) {
 if (args.length === 0)
 return message.reply("❗ Please provide text. Example: `+catmeme I love cats`");

 const text = encodeURIComponent(args.join(" "));
 const imageUrl = `https://cataas.com/cat/says/${text}`;
 const fileName = `catmeme_${Date.now()}.jpg`;
 const filePath = path.join(__dirname, "cache", fileName);

 try {
 const writer = fs.createWriteStream(filePath);
 https.get(imageUrl, (res) => {
 res.pipe(writer);
 writer.on("finish", () => {
 message.reply({
 body: `🐱 Cat meme generated:\n📝 *${decodeURIComponent(text)}*`,
 attachment: fs.createReadStream(filePath)
 });
 });
 });
 } catch (e) {
 console.error(e);
 message.reply("⚠️ Failed to fetch cat meme image.");
 }
 }
};