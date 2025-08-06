const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "love",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Create a love ship image of two users"
    },
    description: {
      en: "Generates a cute ship image between two user avatars"
    },
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{p}ship @user1 @user2\nExample: {p}ship @alice @bob"
    }
  },

  onStart: async function ({ api, event, message }) {
    const { mentions, senderID, type, messageReply } = event;

    // Require exactly two mentions
    const mentionIDs = Object.keys(mentions);
    if (mentionIDs.length < 2) {
      return message.reply("❌ | Please mention two users to ship. Example:\n+ship @user1 @user2");
    }

    const uid1 = mentionIDs[0];
    const uid2 = mentionIDs[1];

    // Get profile picture URLs
    const avatar1 = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;
    const avatar2 = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/ship?user1=${encodeURIComponent(avatar1)}&user2=${encodeURIComponent(avatar2)}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `ship_${uid1}_${uid2}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: "❤️ Here's your ship image! ❤️",
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (err) {
      console.error(err);
      message.reply("❌ | Failed to generate ship image. Try again later.");
    }
  }
};
