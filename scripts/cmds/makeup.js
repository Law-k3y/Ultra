const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "makeup",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Send makeup image" },
    longDescription: { en: "Sends a random makeup / beauty aesthetic" },
    category: "fun",
    guide: { en: "+makeup" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://loremflickr.com/600/400/beauty,makeup";
    const filePath = path.join(__dirname, "cache/makeup.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "💄 𝗠𝗮𝗸𝗲𝘂𝗽 & 𝗕𝗲𝗮𝘂𝘁𝘆 𝗩𝗶𝗯𝗲𝘀",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗠𝗮𝗸𝗲𝘂𝗽 𝗶𝗺𝗮𝗴𝗲 𝗳𝗮𝗶𝗹𝗲𝗱.");
    });
  }
};
