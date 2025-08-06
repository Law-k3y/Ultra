const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "kiss",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Send kiss image" },
    longDescription: { en: "Sends a romantic kiss image" },
    category: "fun",
    guide: { en: "+kiss" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://loremflickr.com/600/400/kiss";
    const filePath = path.join(__dirname, "cache/kiss.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "💏 𝗥𝗼𝗺𝗮𝗻𝘁𝗶𝗰 𝗞𝗶𝘀𝘀 𝗠𝗼𝗺𝗲𝗻𝘁",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗹𝗼𝗮𝗱 𝗸𝗶𝘀𝘀.");
    });
  }
};
