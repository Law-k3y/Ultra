const axios = require('axios');

const baseApiUrl = async () => {
 const base = await axios.get(
 `https://raw.githubusercontent.com/ARYAN-AROHI-STORE/A4YA9-A40H1/refs/heads/main/APIRUL.json`
 );
 return base.data.api;
};

module.exports = {
 config: {
 name: "art",
 version: "1.6.9",
 author: "Chitron Bhattacharjee",
 role: 0,
 description: "{pn} - Enhance your photos with artful transformations!",
 category: "art",
 countDown: 5,
 guide: { 
 en: "{pn} reply to an image or provide a URL\nExample:\n+art zombie"
 }
 },

 onStart: async function ({ message, event, args, api }) {
 try {
 const styles = ["bal", "zombie", "anime", "ghost", "watercolor", "sketch", "abstract", "cartoon", "monster"];
 const prompt = args[0] || styles[Math.floor(Math.random() * styles.length)];

 const msg = await api.sendMessage("🎨 𝒫𝓇𝑜𝒸𝑒𝓈𝓈𝒾𝓃𝑔 𝓎𝑜𝓊𝓇 𝒾𝓂𝒶𝑔𝑒... 𝓅𝓁𝑒𝒶𝓈𝑒 𝓌𝒶𝒾𝓉 ✨", event.threadID);

 let photoUrl = "";

 if (event.type === "message_reply" && event.messageReply?.attachments?.length > 0) {
 photoUrl = event.messageReply.attachments[0].url;
 } else if (args.length > 0) {
 photoUrl = args.join(' ');
 }

 if (!photoUrl) {
 return api.sendMessage("⚠️ 𝒫𝓁𝑒𝒶𝓈𝑒 𝓇𝑒𝓅𝓁𝓎 𝓉𝑜 𝒶𝓃 𝒾𝓂𝒶𝑔𝑒 𝑜𝓇 𝓈𝑒𝓃𝒹 𝒶 𝓋𝒶𝓁𝒾𝒹 𝒰𝑅𝐿 ✨", event.threadID, event.messageID);
 }

 const apiBase = await baseApiUrl();
 const apiURL = `${apiBase}/art2?url=${encodeURIComponent(photoUrl)}&prompt=${encodeURIComponent(prompt)}`;
 const response = await axios.get(apiURL);

 if (!response.data || !response.data.imageUrl) {
 await api.sendMessage("❌ 𝒮𝑜𝓇𝓇𝓎, 𝓃𝑜 𝒾𝓂𝒶𝑔𝑒 𝓌𝒶𝓈 𝓇𝑒𝓉𝓊𝓇𝓃𝑒𝒹. 𝒯𝓇𝓎 𝒶𝑔𝒶𝒾𝓃!", event.threadID, event.messageID);
 return;
 }

 const imageStream = await axios.get(response.data.imageUrl, { responseType: 'stream' });
 await api.unsendMessage(msg.messageID);

 await api.sendMessage({ 
 body: `✨ 𝒴𝑜𝓊𝓇 𝒶𝓇𝓉𝒻𝓊𝓁 𝓉𝓇𝒶𝓃𝓈𝒻𝑜𝓇𝓂 𝒾𝓈 𝓇𝑒𝒶𝒹𝓎!\n🎭 𝒮𝓉𝓎𝓁𝑒: ${prompt}`,
 attachment: imageStream.data 
 }, event.threadID, event.messageID);

 } catch (error) {
 await api.sendMessage(`❌ 𝓔𝓻𝓻𝓸𝓻: ${error.message}\nPlease try again later.`, event.threadID, event.messageID);
 }
 }
};