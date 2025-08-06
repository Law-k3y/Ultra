const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

const styleMap = {
 "1": "flux.1-schnell",
 "2": "flux.1-dev",
 "3": "flux.1-pro"
};

async function getApiUrl() {
 return "http://87.106.100.187:6401";
}

module.exports = {
 config: {
 name: "flux",
 aliases: [],
 author: "Chitron Bhattacharjee",
 version: "1.0",
 cooldowns: 5,
 role: 0,
 shortDescription: "Generate images with FLUX API (-m 1/2/3)",
 longDescription: "Generates 4 images from a prompt & model, lets you choose one.",
 category: "𝗔𝗜 & 𝗚𝗣𝗧",
 guide: {
 en: "{pn} <prompt> [-m 1/2/3]"
 }
 },

 onStart: async function ({ message, globalData, args, api, event, usersData }) {
 const cost = 20;

 api.setMessageReaction("⏳", event.messageID, () => {}, true);

 try {
 let prompt = "";
 let model = "1";

 for (let i = 0; i < args.length; i++) {
 if ((args[i] === "-m" || args[i] === "--model") && args[i + 1]) {
 model = args[i + 1];
 i++;
 } else {
 prompt += args[i] + " ";
 }
 }

 prompt = prompt.trim();
 if (!prompt) return message.reply("❌ | Missing prompt.");
 if (!styleMap[model]) return message.reply("❌ | Invalid model (1/2/3 only).");

 // 💸 Deduct coins
 const userData = await usersData.get(event.senderID);
 const balance = userData.money || 0;
 if (balance < cost)
 return message.reply(`❌ | You need at least ${cost} coins. Your balance: ${balance}`);
 await usersData.set(event.senderID, { money: balance - cost });

 message.reply("💸 𝓣𝓱𝓲𝓼 𝓬𝓸𝓼𝓽 ❷⓿ 𝓬𝓸𝓲𝓷𝓼. 𝓖𝓮𝓷𝓮𝓻𝓪𝓽𝓲𝓷𝓰 𝓲𝓶𝓪𝓰𝓮𝓼...");

 const apiUrl = await getApiUrl();
 const modelParam = Array(4).fill(styleMap[model]).join("/");
 const { data } = await axios.get(`${apiUrl}/api/flux`, { params: { prompt, model: modelParam } });

 if (!data?.results || data.results.length < 4)
 return message.reply("❌ | Not enough images returned from API.");

 const cachePath = path.join(__dirname, "tmp");
 if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

 const images = await Promise.all(data.results.slice(0, 4).map(async (res, index) => {
 const url = res.data[0].url;
 const filePath = path.join(cachePath, `img_${Date.now()}_${index}.jpg`);
 const response = await axios({ url, method: "GET", responseType: "stream" });
 const writer = fs.createWriteStream(filePath);
 response.data.pipe(writer);
 await new Promise((res, rej) => {
 writer.on("finish", res);
 writer.on("error", rej);
 });
 return filePath;
 }));

 const loaded = await Promise.all(images.map(img => loadImage(img)));
 const width = loaded[0].width;
 const height = loaded[0].height;
 const canvas = createCanvas(width * 2, height * 2);
 const ctx = canvas.getContext("2d");

 ctx.drawImage(loaded[0], 0, 0, width, height);
 ctx.drawImage(loaded[1], width, 0, width, height);
 ctx.drawImage(loaded[2], 0, height, width, height);
 ctx.drawImage(loaded[3], width, height, width, height);

 const combined = path.join(cachePath, `combined_${Date.now()}.jpg`);
 fs.writeFileSync(combined, canvas.toBuffer("image/jpeg"));

 api.setMessageReaction("✅", event.messageID, () => {}, true);

 const reply = await message.reply({
 body: `Select an image by replying with 1, 2, 3, or 4.`,
 attachment: fs.createReadStream(combined)
 });

 global.GoatBot.onReply.set(reply.messageID, {
 commandName: this.config.name,
 messageID: reply.messageID,
 images,
 combinedImage: combined,
 author: event.senderID
 });

 } catch (err) {
 console.error("Flux error:", err);
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 message.reply("❌ | Image generation failed.");
 }
 },

 onReply: async function ({ message, event }) {
 const data = global.GoatBot.onReply.get(event.messageReply.messageID);
 if (!data || data.author !== event.senderID) return;

 const num = parseInt(event.body.trim());
 if (isNaN(num) || num < 1 || num > 4)
 return message.reply("❌ | Reply with 1, 2, 3, or 4 only.");

 try {
 const imgPath = data.images[num - 1];
 message.reply({ attachment: fs.createReadStream(imgPath) });
 } catch (err) {
 console.error("flux onReply error:", err);
 message.reply("❌ | Failed to send selected image.");
 }
 }
};