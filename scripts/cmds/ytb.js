const axios = require("axios");
const fs = require("fs");
const yts = require("yt-search");
const path = require("path");

const cacheDir = path.join(__dirname, "/cache");
const tmp = path.join(__dirname, "/tmp");

if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);

module.exports = {
  config: {
    name: "ytb",
    version: "4.0.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    description: {
      en: "Search & download YouTube audio or video",
    },
    category: "media",
    guide: {
      en: "{pn} -v <search term>: Download video\n{pn} -a <search term>: Download audio",
    },
  },

  onStart: async ({ api, args, event }) => {
    if (args.length < 2) {
      return api.sendMessage(
        "╭───────────────╮\n" +
        "│   ❌ 𝗘𝗥𝗥𝗢𝗥  │\n" +
        "├───────────────┤\n" +
        "│ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘂𝘀𝗲:\n" +
        "│ • /ytb -v <search> for video\n" +
        "│ • /ytb -a <search> for audio\n" +
        "╰───────────────╯",
        event.threadID,
        event.messageID
      );
    }

    const flag = args[0].toLowerCase();
    const searchTerm = args.slice(1).join(" ");
    const isAudio = flag === "-a" || flag === "audio";
    const isVideo = flag === "-v" || flag === "video";

    if (!isAudio && !isVideo) {
      return api.sendMessage(
        "╭───────────────╮\n" +
        "│   ❌ 𝗘𝗥𝗥𝗢𝗥  │\n" +
        "├───────────────┤\n" +
        "│ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗳𝗹𝗮𝗴!\n" +
        "│ 𝗨𝘀𝗲 -v 𝗳𝗼𝗿 𝘃𝗶𝗱𝗲𝗼\n" +
        "│ 𝗼𝗿 -a 𝗳𝗼𝗿 𝗮𝘂𝗱𝗶𝗼\n" +
        "╰───────────────╯",
        event.threadID,
        event.messageID
      );
    }

    try {
      const results = await yts(searchTerm);
      const videos = results.videos.slice(0, 6);

      if (videos.length === 0) {
        return api.sendMessage(
          `╭───────────────╮\n│   ⭕ 𝗡𝗢 𝗥𝗘𝗦𝗨𝗟𝗧  │\n├───────────────┤\n│ 𝗡𝗼 𝗿𝗲𝘀𝘂𝗹𝘁𝘀 𝗳𝗼𝗿:\n│ "${searchTerm}"\n╰───────────────╯`,
          event.threadID,
          event.messageID
        );
      }

      let msg = "╭─────────────────────────╮\n│   🎬 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗦𝗘𝗔𝗥𝗖𝗛  │\n├─────────────────────────┤\n";
      
      videos.forEach((v, i) => {
        msg += `│ 🔘 ${i + 1}. ${v.title}\n│ ⏱️ ${v.timestamp} | 📺 ${v.author.name}\n├─────────────────────────┤\n`;
      });

      msg += "│ 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗮 𝗻𝘂𝗺𝗯𝗲𝗿\n╰─────────────────────────╯";

      api.sendMessage(
        {
          body: msg,
          attachment: await Promise.all(
            videos.map((v) => downloadThumbnail(v.thumbnail, path.join(tmp, `thumb_${v.videoId}.jpg`))
          ),
        },
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "ytb",
            messageID: info.messageID,
            author: event.senderID,
            videos,
            isAudio,
          });
        },
        event.messageID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage(
        "╭───────────────╮\n│   ❌ 𝗘𝗥𝗥𝗢𝗥  │\n├───────────────┤\n│ 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝘀𝗲𝗮𝗿𝗰𝗵\n│ 𝗳𝗮𝗶𝗹𝗲𝗱\n╰───────────────╯",
        event.threadID,
        event.messageID
      );
    }
  },

  onReply: async ({ event, api, Reply }) => {
    await api.unsendMessage(Reply.messageID);
    api.setMessageReaction("🔄", event.messageID, () => {}, true);

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > Reply.videos.length) {
      return api.sendMessage(
        "╭───────────────╮\n│   ❌ 𝗘𝗥𝗥𝗢𝗥  │\n├───────────────┤\n│ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗻𝘂𝗺𝗯𝗲𝗿!\n│ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻\n╰───────────────╯",
        event.threadID,
        event.messageID
      );
    }

    const selected = Reply.videos[choice - 1];
    const videoUrl = selected.url;

    try {
      const apiUrl = `https://musicapiz.vercel.app/music`;
      const format = Reply.isAudio ? "mp3" : "mp4";
      const { data } = await axios.get(apiUrl, {
        params: { url: videoUrl, type: format },
      });

      if (!data.success || !data.download_url) {
        throw new Error("Download URL not received from API.");
      }

      const filePath = path.join(
        cacheDir,
        Reply.isAudio
          ? `ytb_audio_${selected.videoId}.mp3`
          : `ytb_video_${selected.videoId}.mp4`
      );

      await downloadFile(data.download_url, filePath);
      await new Promise((res) => setTimeout(res, 500));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const successMsg = Reply.isAudio
        ? `╭───────────────────────╮\n│   🎵 𝗔𝗨𝗗𝗜𝗢 𝗙𝗜𝗨𝗡𝗗  │\n├───────────────────────┤\n│ 𝗧𝗶𝘁𝗲: ${data.title}\n╰───────────────────────╯`
        : `╭───────────────────────╮\n│   🎬 𝗩𝗜𝗗𝗘𝗢 𝗙𝗜𝗡𝗗  │\n├───────────────────────┤\n│ 𝗧𝗶𝘁𝗹𝗲: ${data.title}\n╰───────────────────────╯`;

      await api.sendMessage(
        {
          body: successMsg,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => fs.unlink(filePath, () => {}),
        event.messageID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage(
        `╭───────────────╮\n│   ❌ 𝗘𝗥𝗥𝗢𝗥  │\n├───────────────┤\n│ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗳𝗮𝗶𝗹𝗲𝗱:\n│ ${err.message}\n╰───────────────╯`,
        event.threadID,
        event.messageID
      );
    }
  },
};

async function downloadThumbnail(url, savePath) {
  try {
    const res = await axios.get(url, { responseType: "stream" });
    const writer = fs.createWriteStream(savePath);
    res.data.pipe(writer);
    return new Promise((resolve) => {
      writer.on("finish", () => resolve(fs.createReadStream(savePath)));
      writer.on("error", () => resolve(null));
    });
  } catch (err) {
    console.error("Thumbnail error:", err);
    return null;
  }
}

async function downloadFile(url, savePath) {
  const writer = fs.createWriteStream(savePath);
  const response = await axios.get(url, { responseType: "stream" });

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
