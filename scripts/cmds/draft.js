const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
 config: {
 name: "draft",
 version: "2.0.2",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 2, // Admin-only
 shortDescription: {
 en: "Upload command files to pastebin"
 },
 longDescription: {
 en: "Upload local command files to pastebin service and get shareable links"
 },
 category: "developer",
 guide: {
 en: "{pn} [filename]"
 }
 },

 onStart: async function ({ api, event, args, message }) {
 try {
 // Check if filename was provided
 if (!args[0]) {
 return message.reply("📁 Please provide a filename.\nUsage: draft <filename>");
 }

 const fileName = args[0];
 // Get the absolute path to the commands directory
 const commandsPath = path.resolve(__dirname, '../../scripts/cmds');
 
 console.log(`Looking for file in: ${commandsPath}`); // Debug log

 // Check both with and without .js extension
 let filePath;
 if (fileName.endsWith('.js')) {
 filePath = path.join(commandsPath, fileName);
 } else {
 filePath = path.join(commandsPath, fileName + '.js');
 }

 if (!fs.existsSync(filePath)) {
 // Try to find similar files
 const files = fs.readdirSync(commandsPath);
 const similar = files.filter(f => 
 f.toLowerCase().includes(fileName.toLowerCase())
 );
 
 if (similar.length > 0) {
 return message.reply(`❌ File not found. Did you mean:\n${similar.join('\n')}`);
 }
 return message.reply(`❌ File "${fileName}.js" not found in commands folder.`);
 }

 // Read the file
 const fileContent = fs.readFileSync(filePath, 'utf8');
 
 // Upload to pastebin
 const uploadMsg = await message.reply("📤 Uploading file to PasteBin, please wait...");
 
 try {
 const response = await axios.post('https://pastebin-api.vercel.app/paste', {
 text: fileContent,
 language: "javascript"
 });

 if (response.data?.id) {
 const rawUrl = `https://pastebin-api.vercel.app/raw/${response.data.id}`;
 await api.unsendMessage(uploadMsg.messageID);
 return message.reply(`✅ File uploaded successfully:\n🔗 ${rawUrl}`);
 }
 throw new Error('Invalid API response');
 } catch (uploadError) {
 await api.unsendMessage(uploadMsg.messageID);
 console.error("Upload error:", uploadError);
 return message.reply("❌ Failed to upload file. Please try again later.");
 }

 } catch (error) {
 console.error("Error:", error);
 return message.reply("❌ An error occurred while processing your request.");
 }
 }
};