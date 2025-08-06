const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "winw",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Generate Who Would Win meme comparing two users' profile pictures"
    },
    description: {
      en: "Use two mentions or reply to two messages to create a Who Would Win meme"
    },
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{p}winw @user1 vs @user2\nExample: {p}winw @alice vs @bob"
    }
  },

  onStart: async function ({ api, event, message }) {
    const { mentions, senderID, body, type, messageReply } = event;

    // Parse mentions in format: +winw @user1 vs @user2
    // We expect exactly two mentions to compare

    // Extract mentioned IDs from the message
    const mentionIDs = Object.keys(mentions);

    if (mentionIDs.length < 2) {
      return message.reply("❌ | Please mention two users to compare. Example:\n+winw @user1 vs @user2");
    }

    // Get first two mentioned users
    const uid1 = mentionIDs[0];
    const uid2 = mentionIDs[1];

    // Get profile pictures URLs with fixed size
    const avatar1 = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;
    const avatar2 = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

    try {
      // Call PopCat API with the two images
      const res = await axios.get(`https://api.popcat.xyz/v2/whowouldwin?image1=${encodeURIComponent(avatar1)}&image2=${encodeURIComponent(avatar2)}`, {
        responseType: "arraybuffer"
      });

      // Save image locally
      const filePath = path.join(__dirname, "cache", `winw_${uid1}_${uid2}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: "🤼 Who Would Win? 🤼",
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));

    } catch (err) {
      console.error(err);
      message.reply("❌ | Failed to generate Who Would Win meme. Please try again later.");
    }
  }
};
