const { evaluate } = require("mathjs");

function parseAmount(input) {
 const suffixes = { k: 1e3, m: 1e6, b: 1e9, t: 1e12, q: 1e15 };
 input = input.toLowerCase().replace(/,/g, "");

 const match = input.match(/^([\d.+\-*/^()]+)([kmbtq]?)$/);
 if (!match) throw new Error("Invalid input");

 const base = evaluate(match[1]);
 const suffix = match[2];

 return base * (suffixes[suffix] || 1);
}

module.exports = {
 config: {
 name: "setbal",
 aliases: ["setmoney", "setbalance"],
 version: "1.3",
 author: "Chitron Bhattacharjee",
 countDown: 3,
 role: 2,
 shortDescription: {
 en: "💰 Set or add balance"
 },
 longDescription: {
 en: "Set or add balance to user (supports math & short forms)"
 },
 category: "💼 Economy",
 guide: {
 en: "➤ +setbal <uid/@mention> <amount>\n➤ setbal <amount>\n\n✅ Supports math & short forms:\n5m = 5 million\n9999^2 = math\n\nExamples:\n+setbal 10008133 5b\n+setbal @John 1.2t\nsetbal 1000^4"
 },
 usePrefix: true,
 useChat: true
 },

 onStart: async function ({ api, event, args, usersData, message }) {
 if (args.length < 1)
 return message.reply("❌ Usage:\n+setbal <uid/@mention> <amount>\nOR\nsetbal <amount>");

 let targetID;
 let amountInput;

 // Check for mention
 if (event.mentions && Object.keys(event.mentions).length > 0) {
 targetID = Object.keys(event.mentions)[0];
 amountInput = args.slice(1).join("");
 }

 // Check for UID
 else if (/^\d{5,20}$/.test(args[0]) && args.length >= 2) {
 targetID = args[0];
 amountInput = args.slice(1).join("");
 }

 // Else treat as self-add
 else {
 targetID = event.senderID;
 amountInput = args.join("");
 }

 let amount;
 try {
 amount = parseAmount(amountInput);
 if (isNaN(amount) || !isFinite(amount)) throw new Error();
 } catch {
 return message.reply("❌ Invalid amount.\nExamples: `99999^2`, `5m`, `2.5t`, etc.");
 }

 if (amount < 0) return message.reply("🚫 Balance cannot be negative!");

 const oldBalance = (await usersData.get(targetID, "money")) || 0;
 const newBalance = targetID === event.senderID && args.length === 1
 ? oldBalance + amount
 : amount;

 await usersData.set(targetID, newBalance, "money");
 const name = await usersData.getName(targetID);
 const displayAmount = Number(newBalance).toLocaleString();

 const msg = targetID === event.senderID && args.length === 1
 ? `💸 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗔𝗱𝗱𝗲𝗱!\n👤 You (${name})\n➕ Added: ${amount.toLocaleString()}\n💰 Total: $${displayAmount}`
 : `💗 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗦𝗲𝘁!\n👤 ${name} (${targetID})\n💰 𝗡𝗲𝘄 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $${displayAmount}`;

 return message.reply(msg);
 },

 onChat: async function ({ event, message }) {
 const body = event.body?.toLowerCase();
 if (!body.startsWith("setbal")) return;

 const args = body.split(" ").slice(1);
 message.body = "+setbal " + args.join(" ");
 return this.onStart(...arguments);
 }
};