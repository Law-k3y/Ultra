const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "placeimg",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Random placeholder image" },
    longDescription: { en: "Sends a placeholder image (nature/tech/arch)" },
    category: "fun",
    guide: { en: "+placeimg" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://placeimg.com/600/400/nature";
    const filePath = path.join(__dirname, "cache/placeimg.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "🖼️ 𝗡𝗮𝘁𝘂𝗿𝗲 𝗣𝗹𝗮𝗰𝗲𝗵𝗼𝗹𝗱𝗲𝗿 𝗜𝗺𝗮𝗴𝗲",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝘁 𝗽𝗹𝗮𝗰𝗲𝗶𝗺𝗴 𝗶𝗺𝗮𝗴𝗲.");
    });
  }
};
