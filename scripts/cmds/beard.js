const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "beard",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Random beard avatar" },
    longDescription: { en: "Sends a random beard avatar" },
    category: "fun",
    guide: { en: "+beard" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://placebeard.it/400x400";
    const filePath = path.join(__dirname, "cache/beard.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "🧔 𝗥𝗮𝗻𝗱𝗼𝗺 𝗕𝗲𝗮𝗿𝗱 𝗔𝘃𝗮𝘁𝗮𝗿",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝘁 𝗯𝗲𝗮𝗿𝗱 𝗮𝘃𝗮𝘁𝗮𝗿.");
    });
  }
};
