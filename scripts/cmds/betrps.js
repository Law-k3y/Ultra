module.exports = {
 config: {
 name: "bet",
 version: "1.3",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
 shortDescription: {
 en: "💰 Rock/Paper/Scissors Betting Game"
 },
 longDescription: {
 en: "Play against bot or friends with coin bets using ✊/✋/✌️"
 },
 guide: {
 en: "1. Type 'bet [amount]'\n2. Reply 1 (vs Bot) or 2 (vs Player)\n3. Choose ✊, ✋, or ✌️"
 }
 },

 onStart: async function ({ api, event, args, usersData, message }) {
 const minBet = 100;
 const betAmount = parseInt(args[0]);

 if (!betAmount || isNaN(betAmount)) {
 return message.reply(`⚠️ Please specify a valid bet amount (minimum ${minBet} coins)`);
 }

 if (betAmount < minBet) {
 return message.reply(`❌ Minimum bet is ${minBet} coins!`);
 }

 const userData = await usersData.get(event.senderID);
 if (userData.money < betAmount) {
 return message.reply(`💸 You only have ${userData.money} coins! Need ${betAmount} to play.`);
 }

 const sentMsg = await message.reply(
 `🎰 BETTING GAME - ${betAmount} COINS\n\n` +
 "Choose mode:\n" +
 "1️⃣ - Play vs 🤖 Bot\n" +
 "2️⃣ - Challenge 👥 Friend\n\n" +
 "Reply with 1 or 2"
 );

 global.GoatBot.onReply.set(sentMsg.messageID, {
 commandName: "bet",
 author: event.senderID,
 betAmount: betAmount,
 type: "modeSelection"
 });
 },

 onReply: async function ({ api, event, Reply, usersData, message }) {
 const { author, betAmount, type } = Reply;

 // Mode selection (1 or 2)
 if (type === "modeSelection") {
 if (event.senderID !== author) return;
 
 const choice = event.body.trim();
 if (!["1","2"].includes(choice)) {
 return message.reply("❌ Please reply with either 1 (vs Bot) or 2 (vs Friend)");
 }

 await usersData.set(author, {
 money: (await usersData.get(author)).money - betAmount
 });

 if (choice === "1") {
 // PvE Mode
 const botChoice = ["✊","✋","✌️"][Math.floor(Math.random() * 3)];
 const sentMsg = await message.reply(
 `🤖 BOT CHALLENGE - ${betAmount} COINS\n\n` +
 "Choose your move:\n" +
 "✊ Rock\n✋ Paper\n✌️ Scissors\n\n" +
 "Reply with your choice"
 );

 global.GoatBot.onReply.set(sentMsg.messageID, {
 commandName: "bet",
 author: author,
 betAmount: betAmount,
 botChoice: botChoice,
 type: "pveMove"
 });
 } 
 else if (choice === "2") {
 // PvP Mode
 const sentMsg = await message.reply(
 `👥 PLAYER MATCH - ${betAmount} COINS\n\n` +
 "Waiting for opponent...\n" +
 "Reply 'accept' to join"
 );

 global.GoatBot.onReply.set(sentMsg.messageID, {
 commandName: "bet",
 author: author,
 betAmount: betAmount,
 players: [author],
 type: "pvpWait"
 });
 }
 }
 // PvE Move Selection (✊/✋/✌️)
 else if (type === "pveMove") {
 if (event.senderID !== author) return;

 const validMoves = ["✊","✋","✌️","rock","paper","scissors"];
 const playerMove = event.body.trim().toLowerCase();
 
 if (!validMoves.includes(playerMove)) {
 return message.reply("❌ Invalid move! Please choose:\n✊ Rock\n✋ Paper\n✌️ Scissors");
 }

 const moveMap = {
 "✊": 0, "rock": 0,
 "✋": 1, "paper": 1,
 "✌️": 2, "scissors": 2
 };
 const playerChoice = moveMap[playerMove];
 const botChoice = Reply.botChoice;
 const choices = ["✊ Rock", "✋ Paper", "✌️ Scissors"];

 // Determine winner
 let result;
 if (playerChoice === moveMap[botChoice]) {
 const refund = Math.floor(betAmount * 0.5);
 await usersData.set(author, {
 money: (await usersData.get(author)).money + refund
 });
 result = `🤝 DRAW! You got ${refund} coins back`;
 }
 else if (
 (playerChoice === 0 && moveMap[botChoice] === 2) || // Rock beats scissors
 (playerChoice === 1 && moveMap[botChoice] === 0) || // Paper beats rock
 (playerChoice === 2 && moveMap[botChoice] === 1) // Scissors beat paper
 ) {
 const winnings = betAmount * 2;
 await usersData.set(author, {
 money: (await usersData.get(author)).money + winnings
 });
 result = `🎉 YOU WIN! +${winnings} coins`;
 }
 else {
 result = "😢 Bot wins! Better luck next time";
 }

 message.reply(
 `⚔️ RESULT - ${betAmount} COINS\n\n` +
 `You chose: ${choices[playerChoice]}\n` +
 `Bot chose: ${choices[moveMap[botChoice]]}\n\n` +
 result
 );
 global.GoatBot.onReply.delete(Reply.messageID);
 }
 // PvP Mode Handling
 else if (type === "pvpWait" && event.body.toLowerCase() === "accept") {
 // ... [keep existing PvP logic] ...
 }
 else if (type === "pvpMove") {
 // ... [keep existing PvP move logic] ...
 }
 }
};