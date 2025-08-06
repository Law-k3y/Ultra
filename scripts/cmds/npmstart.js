const { exec } = require('child_process');
const axios = require('axios');

module.exports = {
 config: {
 name: "npmstart",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 role: 2, // ADMIN ONLY
 description: "Execute npm start command",
 category: "admin",
 guide: {
 en: "npm start - Trigger bot restart"
 }
 },

 onStart: async function ({ api, event, args }) {
 // Verify command trigger
 const command = event.body.toLowerCase();
 if (!command.includes('npm start')) return;

 try {
 // Send initial message
 await api.sendMessage("🔄 Attempting to restart bot with 'npm start'...", event.threadID);
 
 // Execute npm start
 exec('npm start', { windowsHide: true }, async (error, stdout, stderr) => {
 if (error) {
 console.error("Execution error:", error);
 await api.sendMessage(`❌ Failed to execute:\n${error.message}`, event.threadID);
 return;
 }

 // Send success message with output
 await api.sendMessage(
 `✅ Successfully executed 'npm start'\n\n` +
 `Output:\n${stdout}\n\n` +
 `Errors:\n${stderr || 'None'}`,
 event.threadID
 );
 });

 } catch (error) {
 console.error("Command error:", error);
 await api.sendMessage(`❌ Unexpected error:\n${error.message}`, event.threadID);
 }
 },

 // Handle both prefixed and non-prefixed messages
 onChat: async function ({ api, event }) {
 const command = event.body.toLowerCase();
 if ((command === 'npm start' || command === '!npm start') && 
 this.config.role === 2 /* admin check */) {
 this.onStart({ api, event, args: [] });
 }
 }
};