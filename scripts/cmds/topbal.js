module.exports = {
 config: {
 name: "topbal",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 role: 0,
 shortDescription: {
 en: "Top 10 Richest users"
 },
 longDescription: {
 en: "This module displays the top 10 richest users based on their money points."
 },
 category: "𝗪𝗔𝗟𝗟𝗘𝗧",
 guide: {
 en: "Use `{pn}topbalance` to see the top 10 richest users."
 }
 },

 onStart: async function ({ api, args, message, event, usersData }) {
 const allUsers = await usersData.getAll();
 
 // Filter out users with no money points
 const usersWithMoney = allUsers.filter(user => user.money > 0);

 if (usersWithMoney.length < 10) {
 message.reply("There are not enough users with money points to display a top 10 list.");
 return;
 }
 
 // Sort users based on money points (descending) and get the top 10
 const topBalance = usersWithMoney.sort((a, b) => b.money - a.money).slice(0, 10);
 
 // Create a list of the top 10 richest users
 const topUsersList = topBalance.map((user, index) => `${index + 1}. ${user.name}: ${user.money}$`);
 
 const messageText = `Top 10 Richest Users:\n${topUsersList.join('\n')}`;
 
 // Reply with the list of the top 10 richest users
 message.reply(messageText);
 }
};