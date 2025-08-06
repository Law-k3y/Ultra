module.exports = {
 config: {
 name: "setinfinity",
 version: "1.1",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 2,
 shortDescription: {
 en: "Set your level, rank, exp to Infinity"
 },
 longDescription: {
 en: "Set level, rank, exp, expFull all to Infinity for your UID only"
 },
 category: "rank",
 guide: {
 en: "{pn}"
 }
 },

 onStart: async function ({ message, event, usersData }) {
 const allowedUID = "100081330372098";
 const targetUID = event.senderID;

 if (targetUID !== allowedUID)
 return message.reply("⛔ You are not authorized to use this command.");

 try {
 await usersData.set(targetUID, {
 exp: Infinity,
 level: Infinity,
 rank: "∞",
 expFull: Infinity // So that progress bar always shows full
 });

 return message.reply("🌟 Your stats are now ♾️ Infinity!\n✅ Level\n✅ Rank\n✅ EXP\n✅ Full EXP Progress");
 } catch (err) {
 console.error(err);
 return message.reply("❌ MongoDB error! Couldn't apply Infinity values.");
 }
 }
};