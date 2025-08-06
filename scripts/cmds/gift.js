module.exports = {
 config: {
 name: "gift",
 aliases: ["pay"],
 version: "1.0",
 author: "Chitron Bhattacharjee",
 role: 0,
 shortDescription: {
 en: "Send money to another user"
 },
 description: {
 en: "Transfer money to another user by tagging them"
 },
 category: "𝗪𝗔𝗟𝗟𝗘𝗧",
 guide: {
 en: "{pn} @user <amount>"
 }
 },

 langs: {
 en: {
 missingInput: "❌ Tag a user and specify a valid amount.\nExample: {pn} @user 100",
 invalidAmount: "❌ Amount must be a positive number.",
 notEnough: "❌ You don't have enough money.",
 success: "✅ Sent %1$ coins to %2"
 }
 },

 onStart: async function ({ message, event, args, usersData, getLang }) {
 const targetUID = Object.keys(event.mentions)[0];
 const amount = parseInt(args[args.length - 1]);

 if (!targetUID || isNaN(amount) || amount <= 0) {
 return message.reply(getLang("missingInput"));
 }

 const senderData = await usersData.get(event.senderID);
 if (!senderData || senderData.money < amount) {
 return message.reply(getLang("notEnough"));
 }

 const receiverData = await usersData.get(targetUID);

 // Update sender
 await usersData.set(event.senderID, {
 money: senderData.money - amount
 });

 // Update receiver
 await usersData.set(targetUID, {
 money: (receiverData?.money || 0) + amount
 });

 const receiverName = event.mentions[targetUID].replace("@", "");
 return message.reply(getLang("success", amount, receiverName));
 }
};