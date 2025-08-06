const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "flickr",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Random flickr-like image" },
    longDescription: { en: "Sends a random image via LoremFlickr" },
    category: "fun",
    guide: { en: "+flickr" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://loremflickr.com/600/400";
    const filePath = path.join(__dirname, "cache/flickr.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "📷 𝗥𝗮𝗻𝗱𝗼𝗺 𝗙𝗹𝗶𝗰𝗸𝗿-𝗦𝘁𝘆𝗹𝗲 𝗜𝗺𝗮𝗴𝗲",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝘁 𝗳𝗹𝗶𝗰𝗸𝗿 𝗶𝗺𝗮𝗴𝗲.");
    });
  }
};
