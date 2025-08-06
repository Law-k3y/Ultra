module.exports = {
 config: {
 name: "usage",
 version: "2.1",
 author: "Chitron Bhattacharjee",
 description: "📊 Command usage statistics",
 category: "admin",
 role: 1,
 guide: {
 en: "{pn} [all] - Show command usage stats"
 }
 },

 onStart: async function ({ api, event, args, threadsData }) {
 try {
 // Initialize thread data
 const threadData = await threadsData.get(event.threadID) || {};
 threadData.commandUsage = threadData.commandUsage || {};
 
 const mode = args[0]?.toLowerCase() || "top";
 const usageData = threadData.commandUsage;
 const commandsTracked = Object.keys(usageData).length;

 if (commandsTracked === 0) {
 return api.sendMessage(
 "📭 No command usage data yet\n" +
 "Execute some commands first to see statistics",
 event.threadID
 );
 }

 // Calculate stats
 const totalExecutions = Object.values(usageData).reduce((a, b) => a + b, 0);
 const sortedCommands = Object.entries(usageData)
 .sort((a, b) => b[1] - a[1])
 .slice(0, mode === "all" ? commandsTracked : 5);

 // Build message
 let message = `📈 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗨𝗦𝗔𝗚𝗘\n━━━━━━━━━━━━━━━━\n` +
 `▸ Total executions: ${totalExecutions}\n` +
 `▸ Commands tracked: ${commandsTracked}\n` +
 `▸ Most used: ${sortedCommands[0][0]} (${sortedCommands[0][1]}×)\n\n` +
 `🏆 𝗧𝗢𝗣 ${mode === "all" ? commandsTracked : 5}:\n`;

 sortedCommands.forEach(([cmd, count], index) => {
 message += `${index + 1}. ${cmd.padEnd(12)} ${"▰".repeat(Math.min(10, Math.floor(count/2)))} ${count}\n`;
 });

 if (mode !== "all" && commandsTracked > 5) {
 message += `\nℹ️ Use "${this.config.name} all" to see complete list`;
 }

 await api.sendMessage(message, event.threadID);

 } catch (error) {
 console.error("Usage Command Error:", error);
 api.sendMessage("⚠️ Failed to generate analytics. Please try again later.", event.threadID);
 }
 },

 onChat: async function ({ event, threadsData, prefix }) {
 try {
 if (event.body?.startsWith(prefix)) {
 const cmdName = event.body.slice(prefix.length).split(/\s+/)[0].toLowerCase();
 if (cmdName === this.config.name) return;

 const threadID = event.threadID;
 const threadData = await threadsData.get(threadID) || {};
 
 threadData.commandUsage = threadData.commandUsage || {};
 threadData.commandUsage[cmdName] = (threadData.commandUsage[cmdName] || 0) + 1;
 
 await threadsData.set(threadID, threadData);
 }
 } catch (err) {
 console.error("Usage Tracker Error:", err);
 }
 }
};