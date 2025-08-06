const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "milf",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Send elegant milf style images" },
    longDescription: { en: "Sends 2 random SFW milf-style mature woman photos" },
    category: "fun",
    guide: { en: "+milf" }
  },

  onStart: async function({ message }) {
    const urls = [
      "https://loremflickr.com/600/400/mature,woman",
      "https://loremflickr.com/600/400/mom,woman"
    ];

    const attachments = [];

    for (let i = 0; i < urls.length; i++) {
      const imgUrl = urls[i];
      const filePath = path.join(__dirname, `cache/milf_${i}.jpg`);
      const file = fs.createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        https.get(imgUrl, res => {
          res.pipe(file);
          file.on("finish", () => {
            attachments.push(fs.createReadStream(filePath));
            resolve();
          });
        }).on("error", reject);
      });
    }

    message.reply({
      body: "👩‍🦳 𝗘𝗹𝗲𝗴𝗮𝗻𝘁 𝗠𝗶𝗹𝗳 𝗦𝘁𝘆𝗹𝗲\n𝗧𝘄𝗶𝗰𝗲 𝘁𝗵𝗲 𝗴𝗹𝗼𝘄 ✨",
      attachment: attachments
    });
  }
};
