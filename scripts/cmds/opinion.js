const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "opinion",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Generate opinion meme with custom text"
    },
    description: {
      en: "Creates an opinion meme with your custom text and image"
    },
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{p}opinion <text> [@mention or reply]\nExample: {p}opinion popcatdev api sucks\nIf no mention or reply, uses your profile picture."
    }
  },

  onStart: async function ({ api, event, message, args }) {
    const { senderID, mentions, type, messageReply } = event;

    if (!args.length) return message.reply("❌ | Please provide text for the opinion meme.");

    // Determine user ID
    let uid;
    if (Object.keys(mentions).length > 0) {
      uid = Object.keys(mentions)[0];
    } else if (type === "message_reply") {
      uid = messageReply.senderID;
    } else {
      uid = senderID;
    }

    const text = encodeURIComponent(args.join(" "));
    const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/opinion?image=${encodeURIComponent(avatarURL)}&text=${text}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `opinion_${uid}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: `🗣️ | Here's your opinion meme!`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (err) {
      console.error(err);
      message.reply("❌ | Failed to generate opinion meme.");
    }
  }
};
