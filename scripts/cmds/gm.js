const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
 fs.mkdirSync(cacheDir);
}

const shipImageUrl = 'https://i.ibb.co/pX8rTWZ/download-27-removebg-preview.png'; 

function animeText(text) {
 // Simple cute font mapping for lowercase letters + some emoji decorations
 const fontMap = {
 a: "𝓪", b: "𝓫", c: "𝓬", d: "𝓭", e: "𝓮", f: "𝓯", g: "𝓰", h: "𝓱",
 i: "𝓲", j: "𝓳", k: "𝓴", l: "𝓵", m: "𝓶", n: "𝓷", o: "𝓸", p: "𝓹",
 q: "𝓺", r: "𝓻", s: "𝓼", t: "𝓽", u: "𝓾", v: "𝓿", w: "𝔀", x: "𝔁",
 y: "𝔂", z: "𝔃",
 A: "𝓐", B: "𝓑", C: "𝓒", D: "𝓓", E: "𝓔", F: "𝓕", G: "𝓖", H: "𝓗",
 I: "𝓘", J: "𝓙", K: "𝓚", L: "𝓛", M: "𝓜", N: "𝓝", O: "𝓞", P: "𝓟",
 Q: "𝓠", R: "𝓡", S: "𝓢", T: "𝓣", U: "𝓤", V: "𝓥", W: "𝓦", X: "𝓧",
 Y: "𝓨", Z: "𝓩",
 };
 return text.split('').map(c => fontMap[c] || c).join('');
}

module.exports = {
 config: {
 name: "goingmerry",
 aliases: ["gm"],
 version: "1.0",
 author: "Chitron Bhattacharjee",
 role: 0,
 shortDescription: animeText("Play the classic going merry game! 🎮"),
 longDescription: animeText("Try to find all three going merry ships hidden in the 9-grid board with 6 guesses! 🚢✨"),
 category: "game",
 guide: {
 en: "{p}gm - Start the game and find all the ships! 🛳️"
 }
 },

 onStart: async function ({ api, message, event, usersData, args }) {
 try {
 const senderID = event.senderID;
 const userData = await usersData.get(senderID);

 const betAmount = 500;
 if (userData.money < betAmount) {
 return message.reply(animeText("❌ 𝙔𝙤𝙪 𝙣𝙚𝙚𝙙 500 𝙘𝙤𝙞𝙣𝙨 𝙩𝙤 𝙥𝙡𝙖𝙮! 𝙋𝙡𝙚𝙖𝙨𝙚 𝙩𝙤𝙥 𝙪𝙥~ 💸"));
 }

 const board = Array(9).fill(false);
 const shipPositions = generateShipPositions(3);
 shipPositions.forEach(pos => board[pos] = true);

 const initialImage = await createBoardImage(board, []);
 const imagePath = await saveImageToCache(initialImage);
 const sentMessage = await message.reply({ 
 body: animeText("🎉 𝓛𝓮𝓽'𝓼 𝓼𝓽𝓪𝓻𝓽! 𝓕𝓲𝓷𝓭 𝓪𝓵𝓵 3 𝓰𝓸𝓲𝓷𝓰 𝓶𝓮𝓻𝓻𝔂 𝓼𝓱𝓲𝓹𝓼 𝓲𝓷 9 𝓫𝓸𝓱𝓼! 𝓨𝓸𝓾'𝓿𝓮 6 𝓰𝓾𝓮𝓼𝓼𝓮𝓼! 🚢✨"),
 attachment: fs.createReadStream(imagePath)
 });

 global.GoatBot.onReply.set(sentMessage.messageID, {
 commandName: "goingmerry",
 uid: senderID,
 board,
 guesses: [],
 remainingGuesses: 6,
 shipCount: 3,
 imagePath,
 betAmount
 });

 } catch (error) {
 console.error("Error in command:", error);
 message.reply(animeText("💔 𝓢𝓸𝓶𝓮𝓽𝓱𝓲𝓷𝓰 𝔀𝓮𝓷𝓽 𝔀𝓻𝓸𝓷𝓰... 𝓟𝓵𝓮𝓪𝓼𝓮 𝓽𝓻𝔂 𝓪𝓰𝓪𝓲𝓷~ ❌"));
 }
 },

 onReply: async function ({ api, message, event, usersData, args }) {
 const replyData = global.GoatBot.onReply.get(event.messageReply.messageID);
 if (!replyData || replyData.uid !== event.senderID) return;

 const { commandName, uid, board, guesses, remainingGuesses, shipCount, imagePath, betAmount } = replyData;
 if (commandName !== "goingmerry") return;

 const userData = await usersData.get(uid);

 const guess = parseInt(args[0]);
 if (isNaN(guess) || guess < 1 || guess > 9 || guesses.includes(guess)) {
 return message.reply(animeText("❌ 𝓟𝓵𝓮𝓪𝓼𝓮 𝓹𝓻𝓸𝓿𝓲𝓭𝓮 𝓪 𝓿𝓪𝓵𝓲𝓭 𝓪𝓷𝓭 𝓾𝓷𝓾𝓼𝓮𝓭 𝓰𝓾𝓮𝓼𝓼 𝓫𝓮𝓽𝔀𝓮𝓮𝓷 1 𝓪𝓷𝓭 9~"));
 }

 const newGuesses = [...guesses, guess];
 const newRemainingGuesses = remainingGuesses - 1;
 const hit = board[guess - 1];
 const newShipCount = hit ? shipCount - 1 : shipCount;

 if (hit) {
 await message.reply(animeText("💥 𝙔𝙤𝙪'𝙫𝙚 𝙝𝙞𝙩 𝙖 𝙜𝙤𝙞𝙣𝙜 𝙢𝙚𝙧𝙧𝙮! 𝙆𝙖𝙯𝙤𝙠𝙪 𝙥𝙤𝙬𝙚𝙧! ⚡"));
 } else {
 await message.reply(animeText("🌊 𝙈𝙞𝙨𝙨𝙚𝙙! 𝙆𝙖𝙯𝙤𝙠𝙪 𝙜𝙤𝙩 𝙖𝙬𝙖𝙮~ 💨"));
 }

 if (newShipCount === 0) {
 await usersData.set(uid, { money: userData.money + 10000 });
 global.GoatBot.onReply.delete(event.messageReply.messageID);
 return message.reply(animeText("🎊 𝓒𝓸𝓷𝓰𝓻𝓪𝓽𝓾𝓵𝓪𝓽𝓲𝓸𝓷𝓼! 𝓨𝓸𝓾 𝓯𝓸𝓾𝓷𝓭 𝓪𝓵𝓵 𝓶𝓮𝓻𝓻𝔂 𝓼𝓱𝓲𝓹𝓼 𝓪𝓷𝓭 𝔀𝓸𝓷 𝟣𝟢,𝟢𝟢𝟢 𝓬𝓸𝓲𝓷𝓼! ✨💰"));
 }

 if (newRemainingGuesses === 0 && newShipCount > 0) {
 await usersData.set(uid, { money: userData.money - betAmount });
 global.GoatBot.onReply.delete(event.messageReply.messageID);
 return message.reply(animeText("💔 𝓖𝓪𝓶𝓮 𝓸𝓿𝓮𝓻! 𝓨𝓸𝓾 𝓻𝓾𝓷 𝓸𝓾𝓽 𝓸𝓯 𝓰𝓾𝓮𝓼𝓼𝓮𝓼. 𝓟𝓪𝔂 𝓾𝓹 𝓽𝓸 500 𝓬𝓸𝓲𝓷𝓼... 𝓑𝓮𝓽𝓽𝓮𝓻 𝓵𝓾𝓬𝓴 𝓷𝓮𝔁𝓽 𝓽𝓲𝓶𝓮! ❌"));
 }

 const updatedImage = await createBoardImage(board, newGuesses);
 const updatedImagePath = await saveImageToCache(updatedImage);
 const sentMessage = await message.reply({ attachment: fs.createReadStream(updatedImagePath) });

 global.GoatBot.onReply.set(sentMessage.messageID, {
 commandName: "goingmerry",
 uid,
 board,
 guesses: newGuesses,
 remainingGuesses: newRemainingGuesses,
 shipCount: newShipCount,
 imagePath: updatedImagePath,
 betAmount
 });
 }
};

function generateShipPositions(shipCount) {
 const positions = [];
 while (positions.length < shipCount) {
 const randomPos = Math.floor(Math.random() * 9);
 if (!positions.includes(randomPos)) positions.push(randomPos);
 }
 return positions;
}

async function createBoardImage(board, guesses) {
 const canvas = createCanvas(300, 300);
 const ctx = canvas.getContext('2d');

 ctx.fillStyle = '#87CEEB'; // cute sky blue background
 ctx.fillRect(0, 0, canvas.width, canvas.height);

 const gridSize = 100;
 const shipImage = await loadImage(shipImageUrl);

 board.forEach((isShip, index) => {
 const x = (index % 3) * gridSize;
 const y = Math.floor(index / 3) * gridSize;
 ctx.strokeStyle = '#fff0f5'; // pale pink lines
 ctx.lineWidth = 3;
 ctx.strokeRect(x, y, gridSize, gridSize);

 if (guesses.includes(index + 1)) {
 ctx.fillStyle = isShip ? '#ff6961' : '#c0c0c0'; // red or gray
 ctx.fillRect(x, y, gridSize, gridSize);
 if (isShip) ctx.drawImage(shipImage, x + 10, y + 10, gridSize - 20, gridSize - 20);
 }
 });

 return canvas.toBuffer();
}

async function saveImageToCache(imageBuffer) {
 const imagePath = path.join(cacheDir, `goingmerry_${Date.now()}.png`);
 await fs.promises.writeFile(imagePath, imageBuffer);
 return imagePath;
}