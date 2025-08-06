const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

module.exports = {
 config: {
 name: "lyrics",
 version: "2.0",
 author: "Chitron Bhattacharjee",
 countDown: 15,
 role: 0,
 shortDescription: {
 vi: "Tìm lời bài hát",
 en: "Find song lyrics"
 },
 longDescription: {
 vi: "Tìm lời bài hát bằng tên bài hát và nghệ sĩ với nhiều nguồn khác nhau",
 en: "Find song lyrics by song name and artist from multiple sources"
 },
 category: "music",
 guide: {
 vi: "{pn} <tên bài hát> - <nghệ sĩ>",
 en: "{pn} <song name> - <artist>"
 }
 },

 langs: {
 vi: {
 missingInput: "Vui lòng nhập tên bài hát",
 searching: "🔍 Đang tìm lời bài hát cho: %1",
 notFound: "Không tìm thấy lời bài hát",
 error: "Đã xảy ra lỗi khi tìm kiếm",
 tooLong: "Lời bài hát quá dài, đã gửi dưới dạng file đính kèm"
 },
 en: {
 missingInput: "Please enter a song name",
 searching: "🔍 Searching lyrics for: %1",
 notFound: "No lyrics found",
 error: "An error occurred while searching",
 tooLong: "Lyrics too long, sent as attachment"
 }
 },

 onStart: async function ({ api, args, message, event, getLang }) {
 try {
 const query = args.join(" ");
 if (!query) return message.reply(getLang("missingInput"));

 message.reply(getLang("searching", query));

 // Try multiple sources
 let lyrics = await getLyricsFromGenius(query);
 if (!lyrics) lyrics = await getLyricsFromLyricsOvh(query);
 if (!lyrics) lyrics = await getLyricsFromAZLyrics(query);

 if (!lyrics) return message.reply(getLang("notFound"));

 const formattedLyrics = formatLyrics(lyrics, query);

 if (formattedLyrics.length <= 2000) {
 return message.reply(formattedLyrics);
 } else {
 message.reply(getLang("tooLong"));
 const tempDir = path.join(__dirname, 'temp');
 if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

 const filePath = path.join(tempDir, `${sanitizeFilename(query)}_lyrics.txt`);
 fs.writeFileSync(filePath, formattedLyrics, 'utf8');

 await message.reply({
 body: `🎵 Lyrics for: ${query}`,
 attachment: fs.createReadStream(filePath)
 });

 fs.unlinkSync(filePath);
 }
 } catch (error) {
 console.error('Lyrics command error:', error);
 message.reply(getLang("error"));
 }
 }
};

// ==================
// Lyrics Sources
// ==================

async function getLyricsFromGenius(query) {
 const GENIUS_TOKEN = '1zrzf9o9ShdjUBijndnUHh-HWRt5mifl4Ih238ui5wf4hFLsL-adXb1MxgPontF1';
 
 try {
 // Search for song
 const searchRes = await axios.get('https://api.genius.com/search', {
 params: { q: query },
 headers: { 'Authorization': `Bearer ${GENIUS_TOKEN}` },
 timeout: 8000
 });

 const song = searchRes.data?.response?.hits?.[0]?.result;
 if (!song) return null;

 // Scrape lyrics from Genius page
 const pageRes = await axios.get(song.url, { timeout: 10000 });
 const $ = cheerio.load(pageRes.data);

 let lyrics = '';
 $('[data-lyrics-container="true"]').each((i, el) => {
 const stanza = $(el).html()
 .replace(/<br>/g, '\n')
 .replace(/<.*?>/g, '')
 .trim();
 lyrics += stanza + '\n\n';
 });

 return cleanLyrics(lyrics);
 } catch (err) {
 console.error('Genius error:', err.message);
 return null;
 }
}

async function getLyricsFromLyricsOvh(query) {
 try {
 // Split query into song and artist
 const parts = query.split('-').map(p => p.trim());
 const song = parts[0];
 const artist = parts[1] || '';

 const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`, {
 timeout: 8000
 });
 
 return res.data?.lyrics ? cleanLyrics(res.data.lyrics) : null;
 } catch (err) {
 console.error('Lyrics.ovh error:', err.message);
 return null;
 }
}

async function getLyricsFromAZLyrics(query) {
 try {
 const searchUrl = `https://search.azlyrics.com/search.php?q=${encodeURIComponent(query)}`;
 const searchRes = await axios.get(searchUrl, { timeout: 10000 });
 const $ = cheerio.load(searchRes.data);

 // Find first result link
 const songLink = $('td a').first().attr('href');
 if (!songLink) return null;

 // Get lyrics page
 const lyricsRes = await axios.get(songLink, { timeout: 10000 });
 const $$ = cheerio.load(lyricsRes.data);

 let lyrics = '';
 $$('div.main-page div.row div.text-center').each((i, div) => {
 const text = $$(div).text().trim();
 if (text && !text.includes('Submit Corrections')) {
 lyrics += text + '\n\n';
 }
 });

 return cleanLyrics(lyrics);
 } catch (err) {
 console.error('AZLyrics error:', err.message);
 return null;
 }
}

// ==================
// Helper Functions
// ==================

function cleanLyrics(lyrics) {
 if (!lyrics) return null;
 
 return lyrics
 .replace(/\[.*?\]/g, '') // Remove [Verse], [Chorus] etc
 .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
 .replace(/^\s+|\s+$/g, '') // Trim whitespace
 .replace(/�/g, "'"); // Replace weird characters
}

function formatLyrics(lyrics, query) {
 const maxLineLength = 60;
 const lines = lyrics.split('\n');
 let formatted = `🎵 Lyrics for: ${query} 🎵\n\n`;

 for (const line of lines) {
 if (line.length <= maxLineLength) {
 formatted += line + '\n';
 } else {
 // Wrap long lines
 const words = line.split(' ');
 let currentLine = '';
 
 for (const word of words) {
 if ((currentLine + word).length > maxLineLength) {
 formatted += currentLine.trim() + '\n';
 currentLine = '';
 }
 currentLine += word + ' ';
 }
 
 formatted += currentLine.trim() + '\n';
 }
 }

 return formatted.trim();
}

function sanitizeFilename(name) {
 return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}