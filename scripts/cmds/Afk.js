const afkUsers = new Map();
const moment = require("moment");

module.exports = {
  config: {
    name: "afk",
    version: "1.6",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝑨𝑭𝑲 𝒘𝒊𝒕𝒉 𝒂𝒏𝒊𝒎𝒆 𝒔𝒕𝒚𝒍𝒆"
    },
    description: {
      en: "𝑺𝒆𝒕 𝒐𝒓 𝒓𝒆𝒎𝒐𝒗𝒆 𝑨𝑭𝑲 𝒔𝒕𝒂𝒕𝒖𝒔 𝒘𝒊𝒕𝒉 𝒌𝒂𝒘𝒂𝒊𝒊 𝒆𝒏𝒆𝒓𝒈𝒚"
    },
    category: "🌸 kawaii",
    guide: {
      en: "🎀 +afk [reason]\n💫 +back"
    }
  },

  onStart: async function ({ event, message, args, usersData }) {
    const uid = event.senderID;
    const isBack = args[0]?.toLowerCase() === "back";

    if (isBack) {
      if (afkUsers.has(uid)) {
        afkUsers.delete(uid);
        return message.reply(
          "🎀 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒃𝒂𝒄𝒌, 𝒔𝒆𝒏𝒑𝒂𝒊~\n𝒀𝒐𝒖'𝒓𝒆 𝒏𝒐 𝒍𝒐𝒏𝒈𝒆𝒓 𝑨𝑭𝑲 💫"
        );
      } else {
        return message.reply("🌸 𝒀𝒐𝒖'𝒓𝒆 𝒏𝒐𝒕 𝒆𝒗𝒆𝒏 𝑨𝑭𝑲, 𝒔𝒊𝒍𝒍𝒚~");
      }
    }

    const reason = args.join(" ") || "𝑱𝒖𝒔𝒕 𝒓𝒆𝒔𝒕𝒊𝒏𝒈~";
    afkUsers.set(uid, {
      reason,
      time: Date.now()
    });

    return message.reply(
      "🍥 𝒀𝒐𝒖'𝒓𝒆 𝒏𝒐𝒘 𝑨𝑭𝑲, 𝒄𝒖𝒕𝒊𝒆~\n📝 𝑹𝒆𝒂𝒔𝒐𝒏: “" + reason + "”\n💫 𝑰'𝒍𝒍 𝒏𝒐𝒕𝒊𝒇𝒚 𝒐𝒕𝒉𝒆𝒓𝒔 𝒊𝒇 𝒕𝒉𝒆𝒚 𝒕𝒂𝒈 𝒚𝒐𝒖!"
    );
  },

  onChat: async function ({ event, message, usersData }) {
    if (!event.mentions || Object.keys(event.mentions).length === 0) return;

    const mentions = Object.keys(event.mentions);
    const now = Date.now();

    for (const uid of mentions) {
      if (afkUsers.has(uid)) {
        const { reason, time } = afkUsers.get(uid);
        const name = await usersData.getName(uid);
        const duration = moment.duration(now - time).humanize();

        return message.reply(
          "💫 𝑶𝒉 𝒏𝒚𝒂~! " + name + " 𝒊𝒔 𝒄𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝑨𝑭𝑲...\n📝 𝑹𝒆𝒂𝒔𝒐𝒏: “" + reason + "”\n⏳ 𝑺𝒊𝒏𝒄𝒆: " + duration + " 𝒂𝒈𝒐 🌸"
        );
      }
    }
  }
};
