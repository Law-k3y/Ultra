const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

const aspectRatioMap = {
 '1:1': { width: 1024, height: 1024 },
 '9:7': { width: 1152, height: 896 },
 '7:9': { width: 896, height: 1152 },
 '19:13': { width: 1216, height: 832 },
 '13:19': { width: 832, height: 1216 },
 '7:4': { width: 1344, height: 768 },
 '4:7': { width: 768, height: 1344 },
 '12:5': { width: 1500, height: 625 },
 '5:12': { width: 640, height: 1530 },
 '16:9': { width: 1344, height: 756 },
 '9:16': { width: 756, height: 1344 },
 '2:3': { width: 768, height: 1152 },
 '3:2': { width: 1152, height: 768 }
};

module.exports = {
 config: {
 name: "fastx",
 author: "Chitron Bhattacharjee",
 version: "1.2",
 cooldowns: 5,
 role: 0,
 shortDescription: "Generate AI images",
 longDescription: "Generates 4 images from a prompt and combines them in a grid.",
 category: "𝗔𝗜 & 𝗚𝗣𝗧",
 guide: "{p}fastx <prompt> [--ar <ratio>]"
 },

 onStart: async function ({ message, args, api, event }) {
 const startTime = Date.now();
 const userID = event.senderID;
 const waitingMessage = await message.reply(`Fastx is generating your images...`);

 try {
 let prompt = "";
 let ratio = "1:1";

 // Parse arguments
 for (let i = 0; i < args.length; i++) {
 if (args[i] === "--ar" && args[i + 1]) {
 ratio = args[i + 1];
 i++;
 } else {
 prompt += args[i] + " ";
 }
 }

 prompt = prompt.trim();
 const urls = new Array(4).fill(`https://www.ai4chat.co/api/image/generate?prompt=${encodeURIComponent(prompt)}&aspect_ratio=${encodeURIComponent(ratio)}`);

 const cacheFolderPath = path.join(__dirname, "/tmp");
 if (!fs.existsSync(cacheFolderPath)) fs.mkdirSync(cacheFolderPath);

 // Download all 4 images
 const images = await Promise.all(
 urls.map(async (url, index) => {
 const { data } = await axios.get(url);
 const imageUrl = data.image_link;

 const imagePath = path.join(cacheFolderPath, `fastx_${index + 1}.jpg`);
 const writer = fs.createWriteStream(imagePath);

 const imageStream = await axios({
 url: imageUrl,
 method: "GET",
 responseType: "stream"
 });

 imageStream.data.pipe(writer);
 await new Promise((resolve, reject) => {
 writer.on("finish", resolve);
 writer.on("error", reject);
 });

 return imagePath;
 })
 );

 // Load and merge images
 const loadedImages = await Promise.all(images.map(img => loadImage(img)));
 const width = loadedImages[0].width;
 const height = loadedImages[0].height;
 const canvas = createCanvas(width * 2, height * 2);
 const ctx = canvas.getContext("2d");

 ctx.drawImage(loadedImages[0], 0, 0, width, height);
 ctx.drawImage(loadedImages[1], width, 0, width, height);
 ctx.drawImage(loadedImages[2], 0, height, width, height);
 ctx.drawImage(loadedImages[3], width, height, width, height);

 const combinedImagePath = path.join(cacheFolderPath, `fastx_combined.jpg`);
 fs.writeFileSync(combinedImagePath, canvas.toBuffer("image/jpeg"));

 api.unsendMessage(waitingMessage.messageID);

 const endTime = Date.now();
 const duration = ((endTime - startTime) / 1000).toFixed(2);

 const reply = await message.reply({
 body: `❏ U1, U2, U3, U4\nTime: ${duration}s`,
 attachment: fs.createReadStream(combinedImagePath)
 });

 global.GoatBot.onReply.set(reply.messageID, {
 commandName: this.config.name,
 messageID: reply.messageID,
 images,
 author: event.senderID
 });

 } catch (error) {
 console.error("Error generating image:", error.message);
 api.unsendMessage(waitingMessage.messageID);
 message.reply("❌ | Failed to generate image.");
 }
 },

 onReply: async function ({ api, event, Reply, args, message }) {
 const reply = args[0].toLowerCase();
 const { author, messageID, images } = Reply;

 if (event.senderID !== author) return;

 try {
 const validIndexes = ["u1", "u2", "u3", "u4"];
 if (validIndexes.includes(reply)) {
 const selectedIndex = parseInt(reply.slice(1)) - 1;
 await message.reply({
 attachment: fs.createReadStream(images[selectedIndex])
 });
 } else {
 message.reply("❌ | Invalid action. Please use U1, U2, U3, or U4.");
 }
 } catch (err) {
 console.error("Reply error:", err.message);
 message.reply("❌ | Failed to send selected image.");
 }
 }
};