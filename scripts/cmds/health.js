const axios = require('axios');

module.exports = {
 config: {
 name: "health",
 version: "2.0",
 author: "Chitron Bhattacharjee",
 role: 0,
 description: "System health check with beautiful output",
 category: "utility",
 guide: { en: "{prefix}health" }
 },

 onStart: async function({ api, event }) {
 const healthUrl = "https://shipuaigoatbot-utuc.onrender.com/health";

 try {
 // Send initial checking message
 await api.sendMessage("🌀 Checking system health...", event.threadID);

 const startTime = Date.now();
 const response = await axios.get(healthUrl, { timeout: 10000 });
 const latency = Date.now() - startTime;

 // Format the response beautifully
 let statusMessage = "";
 let detailsMessage = "";

 if (response.status === 200) {
 const responseData = response.data;
 
 // Status line
 statusMessage = this.createStatusLine(responseData);
 
 // Details box
 detailsMessage = `📊 𝗗𝗘𝗧𝗔𝗜𝗟𝗦:\n`
 + `├─ 𝗣𝗶𝗻𝗴: ${latency}ms\n`
 + this.createUptimeLine(responseData)
 + `└─ 𝗛𝗼𝘀𝘁: ${this.extractDomain(healthUrl)}\n\n`
 + `💡 ${this.getRandomTip()}`;
 }

 // Final output
 await api.sendMessage(
 `🖥️ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗛𝗘𝗔𝗟𝗧𝗛 𝗥𝗘𝗣𝗢𝗥𝗧\n\n`
 + `${statusMessage}\n`
 + `${detailsMessage}`,
 event.threadID
 );

 } catch (error) {
 // Error formatting
 const errorDesign = `⚠️ 𝗘𝗥𝗥𝗢𝗥 𝗥𝗘𝗣𝗢𝗥𝗧\n\n`
 + `🔴 𝗦𝘁𝗮𝘁𝘂𝘀: ${this.getErrorStatus(error)}\n\n`
 + `📌 𝗗𝗲𝘁𝗮𝗶𝗹𝘀:\n`
 + `└─ ${this.getErrorDetails(error)}\n\n`
 + `🚑 𝗥𝗲𝗰𝗼𝗺𝗺𝗲𝗻𝗱𝗮𝘁𝗶𝗼𝗻: ${this.getErrorRecommendation(error)}`;

 await api.sendMessage(errorDesign, event.threadID);
 }
 },

 // Helper methods for beautiful formatting
 createStatusLine: function(responseData) {
 const statusText = String(responseData.status || responseData).toLowerCase();
 if (statusText.includes("ok") || statusText === "healthy") {
 return "🟢 𝗦𝘁𝗮𝘁𝘂𝘀: System is fully operational";
 } else {
 return "🟡 𝗦𝘁𝗮𝘁𝘂𝘀: System responding but check details";
 }
 },

 createUptimeLine: function(responseData) {
 if (!responseData.uptime) return "";
 
 const uptime = Math.floor(responseData.uptime);
 const days = Math.floor(uptime / (3600 * 24));
 const hours = Math.floor((uptime % (3600 * 24)) / 3600);
 const mins = Math.floor((uptime % 3600) / 60);
 
 return `├─ 𝗨𝗽𝘁𝗶𝗺𝗲: ${days > 0 ? days + 'd ' : ''}${hours}h ${mins}m\n`;
 },

 extractDomain: function(url) {
 return url.replace(/^https?:\/\/([^\/]+).*$/, '$1');
 },

 getRandomTip: function() {
 const tips = [
 "System restarts automatically after updates",
 "Cold starts typically take <30 seconds",
 "Higher traffic reduces response times",
 "This server scales with demand"
 ];
 return tips[Math.floor(Math.random() * tips.length)];
 },

 getErrorStatus: function(error) {
 if (error.code === 'ECONNABORTED') return "Timeout (Server may be cold starting)";
 if (error.code === 'ENOTFOUND') return "DNS Lookup Failed";
 if (error.response) return `HTTP ${error.response.status} Error`;
 return "Connection Failed";
 },

 getErrorDetails: function(error) {
 if (error.code === 'ECONNABORTED') return "Request took too long to respond";
 if (error.response) return JSON.stringify(error.response.data).slice(0, 100);
 return error.message || "Unknown error occurred";
 },

 getErrorRecommendation: function(error) {
 if (error.code === 'ECONNABORTED') return "Try again in 30 seconds";
 if (error.code === 'ENOTFOUND') return "Check your internet connection";
 return "Please report this to the admin";
 }
};