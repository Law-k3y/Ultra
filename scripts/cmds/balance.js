const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
 config: {
 name: "balance",
 aliases: ["bal", "money", "tk", "coin"],
 version: "1.7",
 author: "Chitron Bhattacharjee",
 countDown: 3,
 role: 0,
 shortDescription: {
 en: "💖 Check your kawaii balance with avatar image!"
 },
 longDescription: {
 en: "Show your or others' balance in cute anime style + image"
 },
 category: "💼 Economy",
 guide: {
 en: "➤ +bal\n➤ +bal @user or +bal <uid>"
 },
 usePrefix: true,
 useChat: true,
 },

 onStart: async function ({ event, args, message, usersData, api, role }) {
 let targetID = event.senderID;

 if (args.length > 0) {
 if (event.mentions && Object.keys(event.mentions).length > 0) {
 targetID = Object.keys(event.mentions)[0];
 } else if (/^\d{5,20}$/.test(args[0])) {
 if (role === 2) targetID = args[0];
 else return message.reply("🔒 𝙊𝙣𝙡𝙮 𝙗𝙤𝙩 𝙤𝙬𝙣𝙚𝙧 𝙘𝙖𝙣 𝙨𝙚𝙚 𝙤𝙩𝙝𝙚𝙧𝙨' 𝙗𝙖𝙡𝙖𝙣𝙘𝙚!");
 }
 }

 const name = await usersData.getName(targetID);
 const balance = (await usersData.get(targetID, "money")) || 0;

 // Text reply
 const replyText = 
`✨🌸 𝓗𝒆𝓎 𝓀𝒶𝓌𝒶𝒾𝒾 𝒻𝓇𝒾𝑒𝓃𝒹! 🌸✨
💖 𝑼𝘀𝘦𝘳: 𝑰𝑫: ${targetID}
🍥 𝓝𝓪𝓶𝓮: ${name}
💰 𝓑𝓪𝓵𝓪𝓷𝓬𝓮: ＄${balance.toLocaleString()}
🌸 𝓢𝓽𝓪𝔂 𝓢𝓹𝓪𝓻𝓴𝓵𝓲𝓷𝓰! ✨`;

 await message.reply(replyText);

 try {
 let avatarURL = await usersData.getAvatarUrl(targetID);
 if (!avatarURL) avatarURL = "https://i.imgur.com/4NZ6uLY.jpg";

 const width = 400;
 const height = 180;
 const canvas = createCanvas(width, height);
 const ctx = canvas.getContext("2d");

 // Background gradient
 const gradient = ctx.createLinearGradient(0, 0, width, height);
 gradient.addColorStop(0, "#FFC0CB");
 gradient.addColorStop(1, "#FF69B4");
 ctx.fillStyle = gradient;
 ctx.fillRect(0, 0, width, height);

 const avatarResp = await axios.get(avatarURL, { responseType: "arraybuffer" });
 const avatarImg = await loadImage(Buffer.from(avatarResp.data, "binary"));

 const avatarSize = 120;
 const avatarX = 20;
 const avatarY = (height - avatarSize) / 2;

 // Draw avatar circle clipping
 ctx.save();
 ctx.beginPath();
 ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
 ctx.closePath();
 ctx.clip();

 ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
 ctx.restore();

 // Draw dark stroke circle around avatar
 ctx.beginPath();
 ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
 ctx.lineWidth = 3; // stroke width 3px
 ctx.strokeStyle = "#1a1a1a"; // dark color stroke (almost black)
 ctx.stroke();

 // Helper: random dark color generator (no light)
 function randomDarkColor() {
 const letters = '01234567'; // restrict to 0-7 for dark colors only
 let color = '#';
 for (let i = 0; i < 6; i++) {
 color += letters[Math.floor(Math.random() * letters.length)];
 }
 return color;
 }

 const balanceColors = [
 "#32CD32",
 "#228B22",
 "#FF4500",
 "#8B0000",
 "#0B3D91",
 "#1A1A1A",
 ];

 // Text vertical positioning for approx center - 5px
 const baseY = avatarY + avatarSize / 2 - 30;

 // User name with random dark color
 ctx.font = "bold 23px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
 ctx.fillStyle = randomDarkColor();
 ctx.textAlign = "left";
 ctx.fillText(name, avatarX + avatarSize + 20, baseY);

 // User ID (white)
 ctx.font = "16px 'Segoe UI'";
 ctx.fillStyle = "#FFFFFF";
 ctx.fillText(`ID: ${targetID}`, avatarX + avatarSize + 20, baseY + 30);

 // Balance label in extra light color
 ctx.font = "bold 20px 'Segoe UI'";
 ctx.fillStyle = "#f0f0f0";
 ctx.fillText("Balance:", avatarX + avatarSize + 20, baseY + 60);

 // Balance amount with wrap and random color
 const balanceText = `＄${balance.toLocaleString()}`;
 const maxWidth = width - (avatarX + avatarSize + 40);
 const lineHeight = 24;

 function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
 const words = text.split(' ');
 let line = '';
 for(let n = 0; n < words.length; n++) {
 const testLine = line + words[n] + ' ';
 const metrics = ctx.measureText(testLine);
 const testWidth = metrics.width;
 if(testWidth > maxWidth && n > 0) {
 ctx.fillText(line, x, y);
 line = words[n] + ' ';
 y += lineHeight;
 }
 else {
 line = testLine;
 }
 }
 ctx.fillText(line, x, y);
 }

 ctx.fillStyle = balanceColors[Math.floor(Math.random() * balanceColors.length)];
 wrapText(ctx, balanceText, avatarX + avatarSize + 20, baseY + 90, maxWidth, lineHeight);

 // Sparkle emojis
 ctx.font = "40px Arial";
 ctx.fillStyle = "#fff";
 ctx.fillText("✨", width - 50, 40);
 ctx.fillText("🌸", width - 70, 90);
 ctx.fillText("🍥", width - 50, 140);

 // Save image
 const imgBuffer = canvas.toBuffer("image/png");
 const imgPath = path.join(__dirname, "cache", `balance_${targetID}.png`);

 await fs.ensureDir(path.dirname(imgPath));
 await fs.writeFile(imgPath, imgBuffer);

 api.sendMessage(
 {
 body: `🌸 𝓗𝓮𝓻𝓮'𝓼 𝔂𝓸𝓾𝓻 𝓴𝓪𝔀𝓪𝓲𝓲 𝓫𝓪𝓵𝓪𝓷𝓬𝓮 𝓬𝓪𝓻𝓭! 💖`,
 attachment: fs.createReadStream(imgPath),
 },
 event.threadID
 );
 } catch (err) {
 console.error("Balance image generation error:", err);
 }
 },

 onChat: async function ({ event, message }) {
 const body = event.body?.toLowerCase();
 if (!body) return;

 if (["bal", "balance", "money", "tk", "coin"].includes(body.trim())) {
 message.body = "+balance";
 return this.onStart({ ...arguments[0], args: [], message });
 } else if (body.startsWith("bal ")) {
 const args = body.trim().split(/\s+/).slice(1);
 message.body = "+balance " + args.join(" ");
 return this.onStart({ ...arguments[0], args, message });
 }
 },
};