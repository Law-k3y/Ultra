const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
 config: {
 name: "giftall",
 aliases: [],
 version: "2.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 1,
 shortDescription: { en: "🎁 Gift coins to all group members" },
 longDescription: { en: "Send balance to all group members with anime style 💖" },
 category: "💰 Economy",
 guide: { en: "giftall 999 or giftall 2m" },
 usePrefix: true,
 useChat: true,
 },

 onStart: async function ({ api, event, args, usersData, message }) {
 const amountInput = args[0];
 if (!amountInput || isNaN(amountInput.replace(/[^\d.eE+-]/g, "")))
 return message.reply("🧧 𝒫𝓁𝑒𝒶𝓈𝑒 𝓈𝓅𝑒𝒸𝒾𝒻𝓎 𝒶 𝓋𝒶𝓁𝒾𝒹 𝒶𝓂𝑜𝓊𝓃𝓉.\nExample: `giftall 2m`");

 let amount = 0;
 try {
 const match = amountInput.toLowerCase().match(/^([\d.eE+-]+)([kmbtq])?$/);
 if (match) {
 const num = parseFloat(match[1]);
 const suffix = match[2];
 const multipliers = {
 k: 1e3,
 m: 1e6,
 b: 1e9,
 t: 1e12,
 q: 1e15
 };
 amount = suffix ? num * multipliers[suffix] : num;
 } else {
 amount = eval(amountInput);
 }
 } catch {
 return message.reply("⚠️ 𝓘𝓷𝓿𝓪𝓵𝓲𝓭 𝓪𝓶𝓸𝓾𝓷𝓽 𝓼𝔂𝓷𝓽𝓪𝔁.");
 }

 if (amount <= 0) return message.reply("🌀 𝓐𝓶𝓸𝓾𝓷𝓽 𝓶𝓾𝓼𝓽 𝓫𝓮 𝓰𝓻𝓮𝓪𝓽𝓮𝓻 𝓽𝓱𝓪𝓷 𝟎.");

 const threadInfo = await api.getThreadInfo(event.threadID);
 const userIDs = threadInfo.participantIDs;

 for (const uid of userIDs) {
 await usersData.addMoney(uid, amount);
 }

 const groupName = threadInfo.threadName || "Unknown Group";
 const groupImage = threadInfo.imageSrc;

 // Cute styled message
 const cuteReply = `🌸✨ 𝓚𝓪𝔀𝓪𝓲𝓲~!! ✨🌸\n🎁 𝓔𝓿𝓮𝓻𝔂𝓸𝓷𝓮 𝓳𝓾𝓼𝓽 𝓰𝓸𝓽 ＄${amount.toLocaleString()} 💸\n👑 𝓖𝓲𝓯𝓽𝓮𝓭 𝓫𝔂 𝓑𝓸𝓽 𝓞𝔀𝓷𝓮𝓻 💖`;

 await message.reply(cuteReply);

 // IMAGE creation
 try {
 const width = 400;
 const height = 200;
 const canvas = createCanvas(width, height);
 const ctx = canvas.getContext("2d");

 // Pink gradient background
 const gradient = ctx.createLinearGradient(0, 0, width, height);
 gradient.addColorStop(0, "#FFDEE9");
 gradient.addColorStop(1, "#B5FFFC");
 ctx.fillStyle = gradient;
 ctx.fillRect(0, 0, width, height);

 // Load group image
 if (groupImage) {
 try {
 const res = await axios.get(groupImage, { responseType: "arraybuffer" });
 const img = await loadImage(res.data);
 const size = 120;
 const x = 20;
 const y = (height - size) / 2;

 // Clip circle
 ctx.save();
 ctx.beginPath();
 ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
 ctx.closePath();
 ctx.clip();
 ctx.drawImage(img, x, y, size, size);
 ctx.restore();

 // Dark stroke
 ctx.beginPath();
 ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
 ctx.lineWidth = 3;
 ctx.strokeStyle = "#1a1a1a";
 ctx.stroke();
 } catch (err) {
 console.log("⚠️ Failed to load group avatar:", err.message);
 }
 }

 // Text Drawing
 const baseX = 160;
 const baseY = 80;

 ctx.font = "bold 20px 'Segoe UI'";
 ctx.fillStyle = "#3c3c3c";
 ctx.fillText(groupName, baseX, baseY - 30);

 ctx.font = "16px 'Segoe UI'";
 ctx.fillStyle = "#1a1a1a";
 ctx.fillText(`🎁 Gifted: ＄${amount.toLocaleString()}`, baseX, baseY + 5);

 ctx.fillStyle = "#FF1493";
 ctx.fillText("👑 Bot Owner's Gift", baseX, baseY + 35);

 // Emoji sparkles
 ctx.font = "30px Arial";
 ctx.fillText("🌸", width - 50, 40);
 ctx.fillText("✨", width - 65, 90);
 ctx.fillText("🍥", width - 50, 140);

 // Save image
 const outPath = path.join(__dirname, "cache", `gift_${event.threadID}.png`);
 await fs.ensureDir(path.dirname(outPath));
 fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

 api.sendMessage({
 body: "",
 attachment: fs.createReadStream(outPath)
 }, event.threadID);
 } catch (err) {
 console.error("❌ Error making gift image:", err);
 }
 },

 onChat: async function ({ event, message }) {
 const body = event.body?.toLowerCase();
 if (!body) return;

 const match = body.match(/^giftall\s+(.+)$/);
 if (match) {
 const args = [match[1]];
 message.body = "+giftall " + match[1];
 return this.onStart({ ...arguments[0], args, message });
 }
 }
};