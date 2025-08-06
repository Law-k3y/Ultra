const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "colorify",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Apply color overlay to image"
    },
    description: {
      en: "Applies a color filter to your or mentioned user's profile picture or any image URL"
    },
    category: "image",
    guide: {
      en: "{p}colorify <hex color> [@mention or reply]\nExample: {p}colorify 7289da\nIf no mention or reply, uses your profile picture."
    }
  },

  onStart: async function ({ api, event, message, args }) {
    const { senderID, mentions, type, messageReply } = event;

    if (!args[0]) return message.reply("❌ | Please provide a hex color code without #. Example: 7289da");

    // Validate hex color (basic)
    const color = args[0].toLowerCase();
    if (!/^([0-9a-f]{6})$/.test(color)) return message.reply("❌ | Invalid hex color code. Use format like 7289da.");

    // Get user ID for avatar
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
      const res = await axios.get(`https://api.popcat.xyz/v2/colorify?image=${encodeURIComponent(avatarURL)}&color=${color}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `colorify_${uid}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: `🎨 | Here's your colorified image with #${color}!`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));

    } catch (err) {
      console.error(err);
      message.reply("❌ | Failed to generate colorified image.");
    }
  }
};
