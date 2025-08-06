const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "flower",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Send flower image" },
    longDescription: { en: "Sends a lovely flower image" },
    category: "fun",
    guide: { en: "+flower" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://loremflickr.com/600/400/flower";
    const filePath = path.join(__dirname, "cache/flower.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "🌸 𝗟𝗼𝘃𝗲𝗹𝘆 𝗙𝗹𝗼𝘄𝗲𝗿 𝗙𝗿𝗮𝗺𝗲",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗖𝗼𝘂𝗹𝗱𝗻'𝘁 𝗴𝗲𝘁 𝗳𝗹𝗼𝘄𝗲𝗿.");
    });
  }
};
