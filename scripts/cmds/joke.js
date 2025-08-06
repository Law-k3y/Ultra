const axios = require("axios");
module.exports = {
  config: {
    name: "joke",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Tell a joke" },
    longDescription: { en: "Joke from JokeAPI" },
    category: "fun",
    guide: { en: "+joke" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://v2.jokeapi.dev/joke/Any");
      const data = res.data;
      const joke = data.type === "twopart" ? `${data.setup} ${data.delivery}` : data.joke;
      message.reply(`🤣 𝗝𝗼𝗸𝗲:\n${joke}`);
    } catch {
      message.reply("❌ 𝗝𝗼𝗸𝗲 𝗳𝗮𝗶𝗹𝗲𝗱.");
    }
  }
};
