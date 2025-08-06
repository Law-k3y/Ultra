const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs")

module.exports = {
 config: {
 name: "us",
 aliases: ["us"],
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: "we together",
 longDescription: "",
 category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
 guide: {
			en: "{pn} [@tag or reply a message]"
			
		}
 },



 onStart: async function ({ message, event, args }) {
 const uid = event.senderID;
 const mention = Object.keys(event.mentions);
 const uid1 = Object.keys(event.mentions)[0]; 
 const uid2 = event.messageReply ? event.messageReply.senderID : null;
 const uids = uid1 || uid2;

 if (!uids) return message.reply("Please mention someone or reply to a user message");

 let one = uid, two = uids;
 if (mention.length == 2) {
 one = mention[1];
 two = mention[0];
}

 try {
 let imagePath = await bal(one, two);
 return message.reply({
 body: "Just You And Me<3",
 attachment: fs.createReadStream(imagePath)
 });
 } catch (error) {
 return message.reply("Error generating image.");
 }
 }
};

async function bal(one, two) {

 let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
 avone.circle()
 let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
 avtwo.circle()
 let pth = "abcd.png"
 let img = await jimp.read("https://i.imgur.com/ReWuiwU.jpg")

 img.resize(466, 659).composite(avone.resize(110, 110), 150, 76).composite(avtwo.resize(100, 100), 245, 305);

 await img.writeAsync(pth)
 return pth
}