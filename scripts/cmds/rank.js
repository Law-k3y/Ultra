const Canvas = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const { uploadZippyshare, randomString } = global.utils;

const FONT_PATH_BOLD = path.join(__dirname, "assets", "font", "BeVietnamPro-Bold.ttf");
const FONT_PATH_SEMI = path.join(__dirname, "assets", "font", "BeVietnamPro-SemiBold.ttf");

Canvas.registerFont(FONT_PATH_BOLD, { family: "BeVietnamPro-Bold" });
Canvas.registerFont(FONT_PATH_SEMI, { family: "BeVietnamPro-SemiBold" });

const deltaNext = 5; // Level up XP scaling

function expToLevel(exp) {
	return Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
}

function levelToExp(level) {
	return Math.floor(((level ** 2 - level) * deltaNext) / 2);
}

function getRandomColor() {
	const colors = ["#5eead4", "#38bdf8", "#c084fc", "#f472b6", "#facc15", "#4ade80"];
	return colors[Math.floor(Math.random() * colors.length)];
}

async function makeRankCard(userData, level, exp, requiredExp, rank, total, usersData) {
	const canvas = Canvas.createCanvas(800, 250);
	const ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Load Avatar
	const avatarUrl = await usersData.getAvatarUrl(userData.userID);
	const avatar = await Canvas.loadImage(avatarUrl);

	// Draw Avatar
	ctx.save();
	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(avatar, 25, 25, 200, 200);
	ctx.restore();

	// Avatar stroke
	ctx.beginPath();
	ctx.arc(125, 125, 102, 0, Math.PI * 2);
	ctx.lineWidth = 6;
	ctx.strokeStyle = getRandomColor();
	ctx.stroke();

	// User Info
	ctx.font = "30px BeVietnamPro-Bold";
	ctx.fillStyle = "#ffffff";
	ctx.shadowColor = "rgba(0,0,0,0.4)";
	ctx.shadowBlur = 3;
	ctx.fillText(userData.name, 250, 70);

	ctx.font = "24px BeVietnamPro-SemiBold";
	ctx.fillText(`Level: ${level}`, 250, 115);
	ctx.fillText(`EXP: ${exp} / ${requiredExp} (${Math.floor((exp / requiredExp) * 100)}%)`, 250, 155);
	ctx.fillText(`Rank: #${rank} / ${total}`, 250, 195);

	// Progress Bar
	const percent = Math.min(exp / requiredExp, 1);
	const barX = 250, barY = 210, barWidth = 400, barHeight = 25;

	ctx.fillStyle = "#3a3a3a";
	ctx.fillRect(barX, barY, barWidth, barHeight);
	ctx.fillStyle = "#5eead4";
	ctx.fillRect(barX, barY, barWidth * percent, barHeight);

	return canvas.toBuffer("image/png");
}

module.exports = {
	config: {
		name: "rank",
		version: "1.8",
		author: "Chitron Bhattacharjee",
		countDown: 5,
		role: 0,
		shortDescription: { en: "View rank and level card" },
		description: {
			en: "View your or another user's rank, level, exp, and global position on a styled canvas."
		},
		category: "ranking",
		guide: {
			en: `{pn} → Your rank\n{pn} @user\n{pn} uid\n(Reply) {pn}`
		}
	},

	onStart: async function ({ api, event, args, message, usersData }) {
		let targetID;
		if (event.type === "message_reply") {
			targetID = event.messageReply.senderID;
		} else if (Object.keys(event.mentions || {}).length > 0) {
			targetID = Object.keys(event.mentions)[0];
		} else if (!isNaN(args[0])) {
			targetID = args[0];
		} else {
			targetID = event.senderID;
		}

		const allUsers = await usersData.getAll();
		const sortedUsers = allUsers
			.map(u => ({ id: u.userID, exp: u.exp || 0 }))
			.sort((a, b) => b.exp - a.exp);

		const rankPosition = sortedUsers.findIndex(u => u.id === targetID) + 1;
		const totalUsers = sortedUsers.length;

		const userData = await usersData.get(targetID);
		if (!userData) return message.reply("❌ User data not found.");

		const exp = userData.exp || 0;
		const level = expToLevel(exp);
		const nextExp = levelToExp(level + 1);
		const currentExp = levelToExp(level);
		const requiredExp = nextExp - currentExp;
		const progressExp = exp - currentExp;

		const imageBuffer = await makeRankCard(
			{ name: userData.name, userID: targetID },
			level,
			progressExp,
			requiredExp,
			rankPosition,
			totalUsers,
			usersData
		);

		const imgName = `rank_${randomString(6)}.png`;
		const filePath = path.join(__dirname, "cache", imgName);
		await fs.ensureDir(path.dirname(filePath));
		await fs.writeFile(filePath, imageBuffer);

		return message.reply({
			body: `🏆 Rank card for ${userData.name}`,
			attachment: fs.createReadStream(filePath)
		});
	}
};