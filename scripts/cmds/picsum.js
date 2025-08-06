const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "picsum",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Random HQ image" },
    longDescription: { en: "Sends a high-quality random image from Picsum" },
    category: "fun",
    guide: { en: "+picsum" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://picsum.photos/600";
    const filePath = path.join(__dirname, "cache/picsum.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, (res) => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "🖼️ 𝗥𝗮𝗻𝗱𝗼𝗺 𝗣𝗶𝗰𝘀𝘂𝗺 𝗜𝗺𝗮𝗴𝗲 🎨",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝘁 𝗶𝗺𝗮𝗴𝗲.");
    });
  }
};
