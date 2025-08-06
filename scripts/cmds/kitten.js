const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "kitten",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Send cute kitten image" },
    longDescription: { en: "Sends a cute random kitten photo" },
    category: "fun",
    guide: { en: "+kitten" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://placekitten.com/400/400";
    const filePath = path.join(__dirname, "cache/kitten.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, (res) => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "🐱 𝗖𝘂𝘁𝗲 𝗸𝗶𝘁𝘁𝗲𝗻 𝗶𝗺𝗮𝗴𝗲 🐾",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝘁 𝗸𝗶𝘁𝘁𝗲𝗻.");
    });
  }
};
