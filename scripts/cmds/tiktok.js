const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "tiktok",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Download HD TikTok video/photo/audio"
    },
    description: {
      en: "Download TikTok video without watermark, audio, or photo slideshow in HD quality"
    },
    category: "media",
    guide: {
      en: "{pn} <tiktok_url>"
    }
  },

  onStart: async function ({ message, args }) {
    const url = args[0];
    if (!url || !url.includes("tiktok")) return message.reply("❌ | Please provide a valid TikTok URL.");

    const apiUrl = `https://tikdownpro.vercel.app/api/download?url=${encodeURIComponent(url)}`;
    try {
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (data.status !== "success") return message.reply("❌ | Failed to download. Try again with a valid link.");

      if (data.type === "video") {
        const videoPath = path.join(__dirname, "tmp", `${Date.now()}.mp4`);
        const videoRes = await axios.get(data.video_hd || data.video, { responseType: "arraybuffer" });
        fs.writeFileSync(videoPath, videoRes.data);
        return message.reply({ body: "✅ | Here is your TikTok video (HD, No Watermark):", attachment: fs.createReadStream(videoPath) });
      }

      if (data.type === "slideshow") {
        const images = data.slideshow;
        const attachments = await Promise.all(images.map(async (imgUrl, i) => {
          const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
          const imgPath = path.join(__dirname, "tmp", `${Date.now()}_${i}.jpg`);
          fs.writeFileSync(imgPath, res.data);
          return fs.createReadStream(imgPath);
        }));
        return message.reply({ body: "🖼️ | Slideshow Photos (HD):", attachment: attachments });
      }

      if (data.type === "audio") {
        const audioPath = path.join(__dirname, "tmp", `${Date.now()}.mp3`);
        const audioRes = await axios.get(data.audio, { responseType: "arraybuffer" });
        fs.writeFileSync(audioPath, audioRes.data);
        return message.reply({ body: "🎵 | Audio extracted from TikTok:", attachment: fs.createReadStream(audioPath) });
      }

      return message.reply("❌ | Unsupported TikTok content type.");

    } catch (err) {
      console.error(err);
      return message.reply("❌ | An error occurred while downloading.");
    }
  }
};
