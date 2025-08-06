const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "gun",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Generate a gun meme with custom text"
    },
    description: {
      en: "Apply the gun meme effect with your or mentioned user's avatar and custom text"
    },
    category: "image",
    guide: {
      en: "{p}gun <text> [@mention or reply]\nExample: {p}gun pet me or die\n\nIf no mention or reply, uses your profile picture."
    }
  },

  onStart: async function ({ api, event, message, args }) {
    const { senderID, mentions, type, messageReply } = event;

    if (!args.length) return message.reply("❌ | Please provide the text for the gun meme.");

    // Get user ID: mentioned, replied or self
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
      const res = await axios.get(`https://api.popcat.xyz/v2/gun?image=${encodeURIComponent(avatarURL)}&text=${text}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `gun_${uid}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: `🔫 | Here's your gun meme!`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (err) {
      console.error(err);
      message.reply("❌ | Failed to generate gun meme.");
    }
  }
};
