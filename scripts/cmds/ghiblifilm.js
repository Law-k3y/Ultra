// ghibli.js
const axios = require('axios');

module.exports = {
 config: {
 name: "ghiblifilm",
 version: "1.0",
 author: "Chitron Bhattacharjee", // Combined credits
 countDown: 10,
 role: 0,
 shortDescription: {
 vi: "Xem phim Ghibli ngẫu nhiên",
 en: "Get random Studio Ghibli film"
 },
 longDescription: {
 vi: "Xem thông tin phim hoạt hình Studio Ghibli ngẫu nhiên",
 en: "Get information about random Studio Ghibli animated films"
 },
 category: "entertainment",
 guide: {
 vi: " {pn}: xem phim ngẫu nhiên"
 + "\n {pn} <từ khóa>: tìm phim theo từ khóa",
 en: " {pn}: get random film"
 + "\n {pn} <keyword>: search films by keyword"
 }
 },

 langs: {
 vi: {
 loading: "Đang tìm kiếm phim Ghibli cho bạn...",
 result: "🎬 %1\n📅 Năm: %2\n🎥 Đạo diễn: %3\n⭐ Đánh giá: %4/100\n\n📖 Nội dung: %5",
 noResult: "Không tìm thấy phim nào phù hợp với từ khóa của bạn"
 },
 en: {
 loading: "Finding a Ghibli film for you...",
 result: "🎬 %1\n📅 Year: %2\n🎥 Director: %3\n⭐ Rating: %4/100\n\n📖 Synopsis: %5",
 noResult: "No films found matching your keyword"
 }
 },

 onStart: async function ({ message, event, args, getLang }) {
 try {
 // Show loading message
 await message.reply(getLang("loading"));
 
 // Fetch Ghibli films
 const { data: films } = await axios.get('https://ghibliapi.vercel.app/films');
 
 let selectedFilm;
 if (args.length > 0) {
 // Search films if keyword provided
 const keyword = args.join(' ').toLowerCase();
 const matchedFilms = films.filter(film => 
 film.title.toLowerCase().includes(keyword) ||
 film.original_title.toLowerCase().includes(keyword) ||
 film.director.toLowerCase().includes(keyword)
 );
 
 if (matchedFilms.length === 0) {
 return message.reply(getLang("noResult"));
 }
 selectedFilm = matchedFilms[Math.floor(Math.random() * matchedFilms.length)];
 } else {
 // Get random film if no keyword
 selectedFilm = films[Math.floor(Math.random() * films.length)];
 }

 // Format the result
 const response = getLang(
 "result",
 selectedFilm.title,
 selectedFilm.release_date,
 selectedFilm.director,
 selectedFilm.rt_score,
 selectedFilm.description
 );

 // Send result with image attachment if available
 if (selectedFilm.image) {
 await message.reply({
 body: response,
 attachment: await global.utils.getStreamFromURL(selectedFilm.image)
 });
 } else {
 await message.reply(response);
 }

 } catch (error) {
 console.error(error);
 await message.reply("An error occurred while fetching Ghibli films 😢");
 }
 }
};