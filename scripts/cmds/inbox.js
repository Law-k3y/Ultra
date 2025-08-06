module.exports = {
 config: {
 name: "inbox",
 aliases: ["in"],
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 10,
 role: 0,
 shortDescription: {
 en: "✨ Sends you a message in your inbox!"
 },
 longDescription: {
 en: "A fun command that sends a direct message to your inbox using ShiPu Ai 🤖💨"
 },
 category: "fun",
 guide: {
 en: "{p}inbox"
 }
 },
 langs: {
 en: {
 gg: ""
 },
 id: {
 gg: ""
 }
 },
 onStart: async function({ api, event, args, message }) {
 try {
 const query = encodeURIComponent(args.join(' '));
 message.reply("✅ 𝓢𝓾𝓬𝓬𝓮𝓼𝓼!\n\n📥 𝓒𝓱𝓮𝓬𝓴 𝔂𝓸𝓾𝓻 𝓲𝓷𝓫𝓸𝔁 𝓸𝓻 𝓶𝓮𝓼𝓼𝓪𝓰𝓮 𝓻𝓮𝓺𝓾𝓮𝓼𝓽 𝓫𝓸𝔁!", event.threadID);
 api.sendMessage("💌 𝓗𝓮𝔂! 𝓨𝓸𝓾’𝓿𝓮 𝓷𝓸𝔀 𝓮𝓷𝓪𝓫𝓵𝓮𝓭 𝓪𝓬𝓬𝓮𝓼𝓼 𝓽𝓸 𝓢𝓱𝓲𝓟𝓾 𝓐𝓲 🤖💨\n✨ 𝓕𝓮𝓮𝓵 𝓯𝓻𝓮𝓮 𝓽𝓸 𝓮𝔁𝓹𝓵𝓸𝓻𝓮 𝓪𝓷𝓭 𝓬𝓱𝓪𝓽!", event.senderID);
 } catch (error) {
 console.error("Error bro: " + error);
 }
 }
};