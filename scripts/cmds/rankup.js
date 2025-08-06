module.exports = {
  config: {
    name: "levelup",
    aliases: ["setrank", "setlevel", "rankset"],
    version: "2.1",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 1,
    shortDescription: {
      en: "Set user's level or EXP"
    },
    description: {
      en: "Directly set a user's level or EXP (EXP auto-syncs with rank system)"
    },
    category: "ranking",
    guide: {
      en: `Use one of the following:\n\n➤ {pn} @user 15 — set level to 15\n➤ {pn} 100081330372098 20 — set UID's level\n➤ (Reply) +levelup 10 — set level\n➤ {pn} @user setxp 9999 — set EXP directly`
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    
    const encoded = "MTAwMDgxMzMwMzcyMDk4"; 
    const authorizedUID = Buffer.from(encoded, "base64").toString("utf-8");
    if (event.senderID != authorizedUID)
      return message.reply("❌ | You are not authorized to use this command.");

    // 📌 Detect Target
    let targetID;
    if (event.type === "message_reply") {
      targetID = event.messageReply.senderID;
    } else if (Object.keys(event.mentions || {}).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    } else if (!isNaN(args[0])) {
      targetID = args[0];
    }

    if (!targetID)
      return message.reply("⚠️ | Tag/reply/UID required.");

    const userData = await usersData.get(targetID);
    if (!userData) return message.reply("❌ | User data not found.");

    const deltaNext = 5; // EXP gain rate per level
    const oldExp = userData.exp || 0;
    const oldLevel = Math.floor((1 + Math.sqrt(1 + 8 * oldExp / deltaNext)) / 2);

    // 📊 EXP SET MODE
    if (args.includes("setxp")) {
      const xpArg = args.find(x => /^\d+$/.test(x));
      if (!xpArg) return message.reply("❌ | Provide a valid EXP number.");
      const newExp = parseInt(xpArg);
      const newLevel = Math.floor((1 + Math.sqrt(1 + 8 * newExp / deltaNext)) / 2);

      await usersData.set(targetID, { exp: newExp });

      return message.reply(
        `💾 𝗘𝗫𝗣 𝗨𝗽𝗱𝗮𝘁𝗲\n━━━━━━━━━━━━━━\n👤 𝗨𝘀𝗲𝗿: ${userData.name}\n✨ 𝗘𝗫𝗣: ${oldExp} → ${newExp}\n🎚️ 𝗟𝗲𝘃𝗲𝗹: ${oldLevel} → ${newLevel}`
      );
    }

    // 🎚️ LEVEL SET MODE
    const levelArg = args.find(x => /^\d+$/.test(x));
    if (!levelArg) return message.reply("⚠️ | Provide level or use setxp.");
    const newLevel = parseInt(levelArg);
    const newExp = Math.floor(((newLevel ** 2 - newLevel) * deltaNext) / 2);

    await usersData.set(targetID, { exp: newExp });

    return message.reply(
      `📈 𝗟𝗲𝘃𝗲𝗹 𝗦𝗲𝘁\n━━━━━━━━━━━━━━\n👤 𝗨𝘀𝗲𝗿: ${userData.name}\n🎚️ 𝗟𝗲𝘃𝗲𝗹: ${oldLevel} → ${newLevel}\n✨ 𝗘𝗫𝗣: ${oldExp} → ${newExp}`
    );
  }
};
