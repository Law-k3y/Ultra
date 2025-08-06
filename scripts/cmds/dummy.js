const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
 config: {
 name: "dummy",
 version: "1.1",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: { en: "Generate dummy text image with optional background color" },
 longDescription: { en: "Usage: +dummy text [backgroundColor]. Background color supports hex (#ff0000) or color names." },
 category: "fun",
 guide: { en: "+dummy Hello world red\n+dummy Welcome #00ff00" }
 },

 onStart: async function ({ message, args }) {
 if (args.length === 0)
 return message.reply("❗ Please provide text. Example: `+dummy Hello world red`");

 // Check if last arg is a color (hex or color name)
 let bgColor = "000000"; // default black
 let textArgs = args;

 const lastArg = args[args.length - 1].toLowerCase();

 // Validate hex color (with or without #)
 const hexMatch = lastArg.match(/^#?([0-9a-f]{6})$/i);

 // List of common color names supported by dummyimage.com (basic web colors)
 const colorNames = ["black","white","red","green","blue","yellow","gray","grey","orange","purple","pink","brown","cyan","magenta"];

 if (hexMatch) {
 bgColor = hexMatch[1];
 textArgs = args.slice(0, -1);
 } else if (colorNames.includes(lastArg)) {
 bgColor = lastArg;
 textArgs = args.slice(0, -1);
 }

 if (textArgs.length === 0)
 return message.reply("❗ Please provide text before the background color.");

 const text = encodeURIComponent(textArgs.join(" "));
 const imageUrl = `https://dummyimage.com/600x300/${bgColor}/fff&text=${text}`;
 const fileName = `dummy_${Date.now()}.png`;
 const filePath = path.join(__dirname, "cache", fileName);

 try {
 const writer = fs.createWriteStream(filePath);
 https.get(imageUrl, (res) => {
 res.pipe(writer);
 writer.on("finish", () => {
 message.reply({
 body: `🖼️ Dummy image generated with background color \`${bgColor}\`:\n📝 *${decodeURIComponent(text)}*`,
 attachment: fs.createReadStream(filePath)
 });
 });
 });
 } catch (e) {
 console.error(e);
 message.reply("⚠️ Failed to fetch dummy image.");
 }
 }
};