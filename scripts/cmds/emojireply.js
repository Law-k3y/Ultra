module.exports = {
  config: {
    name: "emojireply",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 0,
    role: 0,
    shortDescription: "Auto-reply to emoji with random emoji pairs",
    longDescription: "Automatically replies to any emoji message with random emoji combinations",
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "Use 'emojireply on' to enable or 'emojireply off' to disable. Default is off."
    }
  },

  // Store the enabled state per thread
  threadStates: {},

  onStart: async function({ api, event }) {
    // Initialize as off by default
    this.threadStates[event.threadID] = false;
  },

  onChat: async function({ api, event, message, getLang, args }) {
    const threadID = event.threadID;
    
    // Handle the command to toggle on/off
    if (event.body && event.body.toLowerCase().startsWith("emojireply")) {
      const command = event.body.split(" ")[1]?.toLowerCase();
      
      if (command === "on") {
        this.threadStates[threadID] = true;
        api.sendMessage("Emoji reply mode is now ON ✅", threadID);
        return;
      } else if (command === "off") {
        this.threadStates[threadID] = false;
        api.sendMessage("Emoji reply mode is now OFF ❌", threadID);
        return;
      }
    }

    // Check if emoji reply is enabled for this thread
    if (!this.threadStates[threadID]) {
      return;
    }

    // Check if the message consists only of emojis
    const emojiRegex = /^(\p{Emoji}|\p{Emoji_Presentation}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\p{Emoji_Component})+$/u;
    
    if (emojiRegex.test(event.body)) {
      // Generate random emoji pairs
      const emojiPairs = [
        ["😊", "😎"],
        ["❤️", "✨"],
        ["😂", "🤣"],
        ["👍", "👌"],
        ["🐐", "🤖"],
        ["🌞", "🌝"],
        ["🍎", "🍏"],
        ["⚡", "🔥"],
        ["🙈", "🙉"],
        ["🎉", "🎊"],
        ["🤔", "🤨"],
        ["🥳", "🎂"],
        ["🍕", "🍔"],
        ["🚀", "👽"],
        ["💯", "🔥"],
        ["🧠", "💡"],
        ["👀", "👉"],
        ["🤝", "👏"],
        ["💔", "❤️‍🩹"],
        ["🤯", "😵"]
      ];

      // Select a random pair
      const randomPair = emojiPairs[Math.floor(Math.random() * emojiPairs.length)];
      
      // Reply with the emoji pair
      api.sendMessage(randomPair.join(' '), threadID, event.messageID);
    }
  }
};
