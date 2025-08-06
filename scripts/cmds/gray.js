const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "gray",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Convert profile picture to greyscale"
    },
    description: {
      en: "Turns your or mentioned user's profile picture into a greyscale image"
    },
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{p}greyscale [@mention or reply]\nIf no mention or reply, uses your profile picture."
    }
  },

  onStart: async function ({ api, event, message }) {
    const { senderID, mentions, type, messageReply } = event;

    // Determine user ID for avatar
    let uid;
    if (Object.keys(mentions).length > 0) {
      uid = Object.keys(mentions)[0];
    } else if (type === "message_reply") {
      uid = messageReply.senderID;
    } else {
      uid = senderID;
    }

    const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/greyscale?image=${encodeURIComponent(avatarURL)}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `greyscale_${uid}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: "⚫ Here's your greyscale image!",
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));

    } catch (err) {
      console.error(err);
      message.reply("❌ | Failed to generate greyscale image.");
    }
  }
};
