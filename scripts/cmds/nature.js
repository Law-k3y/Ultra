const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "nature",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Send nature image" },
    longDescription: { en: "Sends a beautiful nature photo" },
    category: "fun",
    guide: { en: "+nature" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://placeimg.com/800/500/nature";
    const filePath = path.join(__dirname, "cache/nature.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "🌲 𝗕𝗲𝗮𝘂𝘁𝗶𝗳𝘂𝗹 𝗡𝗮𝘁𝘂𝗿𝗲 𝗦𝗰𝗲𝗻𝗲",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝘁 𝗻𝗮𝘁𝘂𝗿𝗲.");
    });
  }
};
