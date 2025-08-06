const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

const API_KEY = "ix8FP76ppacB7pQSAp12Fp6UJSprS23TQOVYhUBT9pxu7rjAvmleUZaY";

const keywords = [
 "anime", "vaporwave", "aesthetic", "cyberpunk", "rain", "neon", "sakura", "city", "night",
 "forest", "dreamy", "galaxy", "clouds", "fireflies", "sunrise", "sunset", "abstract",
 "motion", "particles", "chill", "skyline", "blur", "soft light", "snow", "thunderstorm",
 "storm", "waterfall", "space", "lights", "silhouette", "night sky", "mountain", "urban",
 "slowmotion", "cinematic", "rainy street", "cozy", "retro", "glitch", "deep sea", "sky",
 "moonlight", "glowing", "train", "window view", "lake", "fog", "bokeh", "minimalist",
 "aurora", "ocean waves", "aesthetic loop", "mirror"
];

const animeQuotes = [
 "“A lesson without pain is meaningless.” — Edward Elric",
 "“Power comes in response to a need.” — Goku",
 "“You should enjoy the little detours.” — Gintoki",
 "“Sometimes, we must hurt in order to grow.” — Jiraiya",
 "“The world isn’t perfect. But it’s there for us.” — Roy Mustang",
 "“Fear is not evil. It tells you what your weakness is.” — Gildarts"
];

function toItalic(text) {
 const italicMap = {
 A:'𝐴',B:'𝐵',C:'𝐶',D:'𝐷',E:'𝐸',F:'𝐹',G:'𝐺',H:'𝐻',I:'𝐼',J:'𝐽',K:'𝐾',L:'𝐿',M:'𝑀',
 N:'𝑁',O:'𝑂',P:'𝑃',Q:'𝑄',R:'𝑅',S:'𝑆',T:'𝑇',U:'𝑈',V:'𝑉',W:'𝑊',X:'𝑋',Y:'𝑌',Z:'𝑍',
 a:'𝑎',b:'𝑏',c:'𝑐',d:'𝑑',e:'𝑒',f:'𝑓',g:'𝑔',h:'ℎ',i:'𝑖',j:'𝑗',k:'𝑘',l:'𝑙',m:'𝑚',
 n:'𝑛',o:'𝑜',p:'𝑝',q:'𝑞',r:'𝑟',s:'𝑠',t:'𝑡',u:'𝑢',v:'𝑣',w:'𝑤',x:'𝑥',y:'𝑦',z:'𝑧',
 0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',
 ' ':' ', ':':':', '.':'.', ',':',', '"':'"', "'":"'", '—':'—', '“':'“', '”':'”',
 '✨':'✨', '🕊️':'🕊️', '🌸':'🌸', '🎬':'🎬', '🎨':'🎨', '⏱':'⏱', '📦':'📦', '🔗':'🔗', '👑':'👑'
 };
 return [...text].map(c => italicMap[c] || c).join('');
}

function toBold(text) {
 const boldMap = {
 A:'𝐀',B:'𝐁',C:'𝐂',D:'𝐃',E:'𝐄',F:'𝐅',G:'𝐆',H:'𝐇',I:'𝐈',J:'𝐉',K:'𝐊',L:'𝐋',M:'𝐌',
 N:'𝐍',O:'𝐎',P:'𝐏',Q:'𝐐',R:'𝐑',S:'𝐒',T:'𝐓',U:'𝐔',V:'𝐕',W:'𝐖',X:'𝐗',Y:'𝐘',Z:'𝐙',
 a:'𝐚',b:'𝐛',c:'𝐜',d:'𝐝',e:'𝐞',f:'𝐟',g:'𝐠',h:'𝐡',i:'𝐢',j:'𝐣',k:'𝐤',l:'𝐥',m:'𝐦',
 n:'𝐧',o:'𝐨',p:'𝐩',q:'𝐪',r:'𝐫',s:'𝐬',t:'𝐭',u:'𝐮',v:'𝐯',w:'𝐰',x:'𝐱',y:'𝐲',z:'𝐳',
 0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',
 ' ':' ', ':':':', '.':'.', ',':',', '"':'"', "'":"'", '—':'—', '“':'“', '”':'”',
 '✨':'✨', '🕊️':'🕊️', '🌸':'🌸', '🎬':'🎬', '🎨':'🎨', '⏱':'⏱', '📦':'📦', '🔗':'🔗', '👑':'👑'
 };
 return [...text].map(c => boldMap[c] || c).join('');
}

function wrapText(text, maxLen = 11) {
 if (!text) return [];
 const lines = [];
 let start = 0;
 while (start < text.length) {
 lines.push(text.slice(start, start + maxLen));
 start += maxLen;
 }
 return lines;
}

const borderTop = "┌═══════════┐";
const borderMid = "├───────────┤";
const borderBot = "└═══════════┘";

function makeLine(text) {
 return `│ ${text}`;
}

module.exports = {
 config: {
 name: "randomclip",
 aliases: ["rclip", "randvid", "animeclip"],
 version: "1.5",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: { en: "Get a random anime aesthetic clip" },
 longDescription: { en: "Sends a random HD clip from Pexels with retro caption and quote" },
 category: "media",
 guide: { en: "{pn} → Sends random aesthetic clip" }
 },

 onStart: async function ({ message }) {
 const query = keywords[Math.floor(Math.random() * keywords.length)];
 const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=15`;

 try {
 const res = await axios.get(url, {
 headers: { Authorization: API_KEY }
 });

 const videos = res.data.videos;
 if (!videos.length) return message.reply("😢 No clips found. Try again.");

 const video = videos[Math.floor(Math.random() * videos.length)];
 const file = video.video_files.find(v => v.quality === "hd" && v.file_type === "video/mp4") || video.video_files[0];
 const videoUrl = file.link;
 const filePath = path.join(__dirname, "cache", `randomclip_${video.id}.mp4`);

 if (!fs.existsSync(filePath)) {
 await new Promise((resolve) => {
 const fileStream = fs.createWriteStream(filePath);
 https.get(videoUrl, (res) => {
 res.pipe(fileStream);
 fileStream.on("finish", () => resolve());
 });
 });
 }

 const quote = animeQuotes[Math.floor(Math.random() * animeQuotes.length)];
 const quoteLines = wrapText(quote);
 const userName = video.user?.name || "Untitled";
 const sizeKB = file.file_size ? Math.round(file.file_size / 1024) : "NaN";

 const urlLines = video.url ? [video.url] : [];

 const captionLines = [
 borderTop,
 makeLine(toItalic(`🌸 ${query.toUpperCase()} CLIP`)),
 makeLine(toItalic("DROP")),
 borderMid,
 makeLine(toItalic(`🎬 Title: ${userName}`)),
 makeLine(toItalic(`🎨 Theme: ${query}`)),
 makeLine(toItalic(`⏱ Time: ${video.duration}s`)),
 makeLine(toItalic(`📦 Size: ${sizeKB} KB`)),
 makeLine(toItalic("🔗 Link:")),
 ...urlLines.map(line => makeLine(toItalic(line))),
 makeLine(toItalic("👑 By: Chitron Bhattacharjee")),
 borderMid,
 makeLine(toItalic("🕊️ Moment captured...")),
 ...quoteLines.map(line => makeLine(toBold(line))),
 borderBot
 ];

 const caption = captionLines.join("\n");

 return message.reply({
 body: caption,
 attachment: fs.createReadStream(filePath)
 });

 } catch (err) {
 console.error(err);
 return message.reply("⚠️ Failed to load your vibe. Try again later.");
 }
 }
};