module.exports = {
 config: {
 name: "toprank",
 aliases: ["ranktop", "ranking", "leaderboard", "ranks", "leveltop", "toplevel"],
 version: "1.1",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "🎖️ Show top 30 users by level"
 },
 longDescription: {
 en: "Displays a leaderboard of the top 30 highest level users (EXP based)"
 },
 category: "ranking",
 guide: {
 en: "{pn} — Show top 30 ranked users"
 }
 },

 onStart: async function ({ message, usersData }) {
 const deltaNext = 5; // Should match your rank system
 const allUsers = await usersData.getAll();
 const withExp = allUsers.filter(u => u.exp > 0);

 if (withExp.length === 0)
 return message.reply("⚠️ No users have EXP yet!");

 // Sort & Slice Top 30
 const sorted = withExp.sort((a, b) => (b.exp || 0) - (a.exp || 0)).slice(0, 30);

 // Emojis per rank
 const rankEmoji = [
 "👑", "🥈", "🥉", "🎖️", "🎖️", "🎖️", "🏅", "🏅", "🏅", "🏅",
 "🎯", "🎯", "🎯", "💠", "💠", "💠", "✨", "✨", "✨", "✨",
 "🔰", "🔰", "🔰", "🏵️", "🏵️", "🏵️", "🧿", "🧿", "🧿", "🎗️"
 ];

 // Create leaderboard text
 const leaderboard = sorted.map((user, i) => {
 const exp = user.exp || 0;
 const level = Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
 const emoji = rankEmoji[i] || "🎗️";
 return `${emoji} ${i + 1}. ${user.name} — 🧬 Lv.${level} (${exp.toLocaleString()} XP)`;
 });

 const msg = 
`🌟✨ 𝑻𝒐𝒑 30 𝑹𝒂𝒏𝒌𝒆𝒓𝒔 ✨🌟
━━━━━━━━━━━━━━━━━━
${leaderboard.join("\n")}
━━━━━━━━━━━━━━━━━━
🏆 𝑲𝒆𝒆𝒑 𝑪𝒉𝒂𝒕𝒕𝒊𝒏𝒈 𝒕𝒐 𝑳𝒆𝒗𝒆𝒍 𝑼𝒑! 💬`;

 return message.reply(msg);
 }
};