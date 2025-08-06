const Canvas = require("canvas");
const fs = require("fs-extra");
const path = require("path");

const deltaNext = 5; // Same as your rank file

function expToLevel(exp) {
 return Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
}

function levelToExp(level) {
 return Math.floor(((level ** 2 - level) * deltaNext) / 2);
}

function getRandomColor() {
 const colors = ["#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1", "#955251"];
 return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = {
 config: {
 name: "rankchat",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: { en: "Show rank with canvas (chat trigger)" },
 longDescription: { en: "Shows user's level, exp, and rank with transparent canvas card" },
 category: "ranking",
 guide: { en: "Just type 'my rank' or 'rank please'" }
 },

 onChat: async function ({ message, event, usersData }) {
 const lower = event.body?.toLowerCase() || "";
 if (!["rank", "my rank", "rank please", "level", "show my rank"].includes(lower)) return;

 const userID = event.senderID;
 const { exp = 0, name = "User" } = await usersData.get(userID);
 const all = await usersData.getAll();

 // Sort users for ranking
 const sorted = all.sort((a, b) => (b.exp || 0) - (a.exp || 0));
 const rank = sorted.findIndex(u => u.userID === userID) + 1;

 const level = expToLevel(exp);
 const minExp = levelToExp(level);
 const nextExp = levelToExp(level + 1);
 const currentExp = exp - minExp;
 const neededExp = nextExp - minExp;

 const avatarUrl = await usersData.getAvatarUrl(userID);
 const avatar = await Canvas.loadImage(avatarUrl);
 const strokeColor = getRandomColor();

 // Canvas setup
 const canvas = Canvas.createCanvas(600, 180);
 const ctx = canvas.getContext("2d");

 // Transparent BG
 ctx.clearRect(0, 0, canvas.width, canvas.height);

 // Avatar circle with stroke
 const radius = 60;
 const cx = 90;
 const cy = canvas.height / 2;
 ctx.save();
 ctx.beginPath();
 ctx.arc(cx, cy, radius + 5, 0, 2 * Math.PI);
 ctx.strokeStyle = strokeColor;
 ctx.lineWidth = 6;
 ctx.stroke();
 ctx.clip();

 ctx.beginPath();
 ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
 ctx.closePath();
 ctx.clip();
 ctx.drawImage(avatar, cx - radius, cy - radius, radius * 2, radius * 2);
 ctx.restore();

 // Text
 ctx.fillStyle = "#ffffff";
 ctx.font = "bold 22px Arial";
 ctx.fillText(name, 180, 50);
 ctx.font = "18px Arial";
 ctx.fillText(`Level: ${level}`, 180, 80);
 ctx.fillText(`Rank: #${rank}/${all.length}`, 180, 110);

 // EXP Bar
 const barWidth = 300;
 const barHeight = 18;
 const barX = 180;
 const barY = 130;

 // Background bar
 ctx.fillStyle = "#444";
 ctx.fillRect(barX, barY, barWidth, barHeight);

 // Filled bar
 const filled = (currentExp / neededExp) * barWidth;
 ctx.fillStyle = "#00FFFF";
 ctx.fillRect(barX, barY, filled, barHeight);

 // EXP Text
 ctx.fillStyle = "#ffffff";
 ctx.font = "16px Arial";
 ctx.fillText(`EXP: ${currentExp}/${neededExp}`, barX, barY + 40);

 // Save & Send
 const imgPath = path.join(__dirname, "cache", `rank_${userID}.png`);
 await fs.ensureDir(path.dirname(imgPath));
 const buffer = canvas.toBuffer("image/png");
 fs.writeFileSync(imgPath, buffer);

 return message.reply({
 body: `📊 Here's your Rank Card!`,
 attachment: fs.createReadStream(imgPath)
 });
 },

 onStart: async () => {} // dummy for install
};