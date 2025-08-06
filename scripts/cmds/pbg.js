const fs = require("fs-extra");
const path = require("path");
const Canvas = require("canvas");

const gameImageURL = "https://i.imgur.com/TQCpxrZ.jpeg";
const chakraMoves = [
 "𝘊𝘩𝘢𝘬𝘳𝘢 𝘗𝘶𝘭𝘴𝘦 🌀",
 "𝘓𝘪𝘨𝘩𝘵𝘯𝘪𝘯𝘨 𝘉𝘭𝘪𝘵𝘻 ⚡",
 "𝘍𝘪𝘳𝘦 𝘛𝘰𝘳𝘯𝘢𝘥𝘰 🔥🔥",
 "𝘚𝘩𝘢𝘥𝘰𝘸 𝘍𝘢𝘯𝘨 💨",
 "𝘔𝘺𝘴𝘵𝘪𝘤 𝘉𝘭𝘢𝘥𝘦 ✨",
 "𝘙𝘢𝘴𝘦𝘯𝘨𝘢𝘯 𝘚𝘵𝘰𝘳𝘮 💫"
];

const attackWords = ["kick", "slap", "punch", "atk"];

module.exports = {
 config: {
 name: "pbg",
 version: "4.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: { en: "Power Boxing vs bot" },
 longDescription: { en: "Fight game with Chakra combo system" },
 category: "games",
 guide: { en: "+pbg [bet amount]" }
 },

 onStart: async function ({ api, args, event, usersData, message }) {
 const bet = parseInt(args[0]);
 if (isNaN(bet) || bet <= 0) return message.reply("❌ Enter a valid bet amount");
 const user = await usersData.get(event.senderID);
 if (user.money < bet) return message.reply("💸 Not enough balance!");

 const imgPath = path.join(__dirname, "cache", "pbg.jpg");
 if (!fs.existsSync(imgPath)) {
 const https = require("https");
 const file = fs.createWriteStream(imgPath);
 await new Promise((resolve) => https.get(gameImageURL, (res) => { res.pipe(file); file.on("finish", resolve); }));
 }

 const game = {
 stage: "waitingStart",
 bet,
 player: { name: "Kakashi (DMS)", hp: 100, chakra: 100 },
 bot: { name: "Nagato", hp: 100, chakra: 100 },
 playerId: event.senderID
 };

 const msg = await message.reply({
 body: "🥊 𝗣𝗼𝘄𝗲𝗿 𝗕𝗼𝘅𝗶𝗻𝗴 𝗚𝗮𝗺𝗲 🥊\n💥 Opponent: Nagato\n\n👉 Reply with \"start\" to begin.",
 attachment: fs.createReadStream(imgPath)
 });

 game.messageID = msg.messageID;
 global.pbgGames = global.pbgGames || {};
 global.pbgGames[msg.messageID] = game;
 },

 onChat: async function ({ event, message, usersData }) {
 if (!global.pbgGames) return;
 const gameEntry = Object.entries(global.pbgGames).find(([msgID, game]) => {
 return (event.messageReply?.messageID === msgID || event.threadID === game.threadID) && event.senderID === game.playerId;
 });

 if (!gameEntry) return;
 const [msgID, game] = gameEntry;

 const user = await usersData.get(event.senderID);

 if (game.stage === "waitingStart" && event.body.toLowerCase() === "start") {
 game.stage = "fighting";
 game.threadID = event.threadID;
 return message.reply(renderStatus(game) + "\n\n🔋 𝗡𝗮𝗴𝗮𝘁𝗼 is charging chakra...\n✏️ Type: kick, slap, punch, or atk!");
 }

 if (game.stage === "fighting" && attackWords.includes(event.body.toLowerCase())) {
 const combo = getCombo();
 const botHit = getRand(15, 30);

 let totalDmg = 0;
 combo.forEach(m => totalDmg += m.dmg);

 game.bot.hp = Math.max(0, game.bot.hp - totalDmg);
 game.player.hp = Math.max(0, game.player.hp - botHit);
 game.player.chakra -= getRand(10, 20);
 game.bot.chakra -= getRand(10, 20);

 const comboText = combo.map(m => `✨ ${m.name}\n💥 𝗗𝗮𝗺𝗮𝗴𝗲: ${m.dmg}%`).join("\n");
 const botMove = chakraMoves[Math.floor(Math.random() * chakraMoves.length)];
 const fightLog = `⚔️ 𝗖𝗼𝗺𝗯𝗼 𝗔𝘁𝘁𝗮𝗰𝗸:\n${comboText}\n\n😈 𝗡𝗮𝗴𝗮𝘁𝗼 uses ${botMove}\n💢 𝗗𝗲𝗮𝗹𝘁 ${botHit}% to 𝗞𝗮𝗸𝗮𝘀𝗵𝗶\n\n${renderStatus(game)}`;

 if (game.bot.hp <= 0 || game.player.hp <= 0) {
 delete global.pbgGames[msgID];
 if (game.player.hp <= 0) {
 await usersData.set(event.senderID, { money: user.money - game.bet });
 return message.reply(fightLog + `\n\n❌ 𝗬𝗼𝘂 𝗟𝗼𝘀𝘁! -${game.bet} coins`);
 }

 const reward = game.bet * 4;
 await usersData.set(event.senderID, { money: user.money + reward });
 const winImg = await createWinnerCanvas(game.player.name, game.bot.name, reward);
 return message.reply({
 body: fightLog + `\n\n🏆 𝗬𝗼𝘂 𝗪𝗜𝗡! +${reward} coins 💰`,
 attachment: fs.createReadStream(winImg)
 });
 }

 return message.reply(fightLog + "\n\n✏️ 𝗡𝗲𝘅𝘁: type kick/slap/punch/atk!");
 }
 }
};

function renderStatus(game) {
 return (
 "━━━━━━━━━━━━━━\n" +
 `💛| ${game.player.name}: 𝗛𝗣 ${game.player.hp}%\n` +
 `💙| 𝗖𝗵𝗮𝗸𝗿𝗮 ${game.player.chakra}%\n` +
 "━━━━━━━━━━━━━━\n" +
 `💛| ${game.bot.name}: 𝗛𝗣 ${game.bot.hp}%\n` +
 `💙| 𝗖𝗵𝗮𝗸𝗿𝗮 ${game.bot.chakra}%\n` +
 "━━━━━━━━━━━━━━"
 );
}

function getCombo() {
 const moves = [];
 const used = new Set();
 const count = getRand(2, 3);
 while (moves.length < count) {
 const move = chakraMoves[Math.floor(Math.random() * chakraMoves.length)];
 if (!used.has(move)) {
 used.add(move);
 moves.push({ name: move, dmg: getRand(12, 25) });
 }
 }
 return moves;
}

function getRand(min, max) {
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createWinnerCanvas(playerName, botName, reward) {
 const width = 700, height = 500;
 const canvas = Canvas.createCanvas(width, height);
 const ctx = canvas.getContext("2d");
 ctx.fillStyle = "#0d0d0d";
 ctx.fillRect(0, 0, width, height);

 ctx.fillStyle = "#00ff99";
 ctx.font = "40px sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("🏆 𝗣𝗼𝘄𝗲𝗿 𝗕𝗼𝘅𝗶𝗻𝗴 𝗖𝗵𝗮𝗺𝗽𝗶𝗼𝗻!", width / 2, 60);

 ctx.fillStyle = "#ffffff";
 ctx.font = "26px sans-serif";
 ctx.fillText(`${playerName} defeated ${botName}!`, width / 2, 160);

 ctx.fillStyle = "#ffd700";
 ctx.fillText(`+${reward} Coins Earned 💰`, width / 2, 220);

 ctx.fillStyle = "#aaaaaa";
 ctx.font = "20px sans-serif";
 ctx.fillText("“Your Chakra Control is Unmatched.”", width / 2, 400);

 const outPath = path.join(__dirname, "cache", `pbg_win_${Date.now()}.jpg`);
 await fs.ensureDir(path.dirname(outPath));
 const buffer = canvas.toBuffer("image/jpeg");
 fs.writeFileSync(outPath, buffer);
 return outPath;
}