const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "bacon",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Random bacon image" },
    longDescription: { en: "Sends a random bacon placeholder image" },
    category: "fun",
    guide: { en: "+bacon" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://baconmockup.com/600/400";
    const filePath = path.join(__dirname, "cache/bacon.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "🥓 𝗕𝗮𝗰𝗼𝗻 𝗣𝗹𝗮𝗰𝗲𝗵𝗼𝗹𝗱𝗲𝗿 𝗜𝗺𝗮𝗴𝗲",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝘁 𝗯𝗮𝗰𝗼𝗻 𝗶𝗺𝗮𝗴𝗲.");
    });
  }
};
