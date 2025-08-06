module.exports = {
 config: {
 name: "neymar",
 aliases: ["njr"],
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Send a random photo of Neymar"
 },
 longDescription: {
 en: "Sends both image and URL of a random Lionel Neymar photo"
 },
 category: "football",
 guide: {
 en: "{pn}"
 }
 },

 onStart: async function ({ message }) {
 try {
 const fs = require("fs-extra");
 const path = require("path");
 const https = require("https");
 
 const links = [
 "https://images.ctfassets.net/3mv54pzvptwz/145cVGPOfPtvT6F7gELWAh/29f162964282ca464e4276f07e3a3952/capa_2.jpg",
 "https://images.ctfassets.net/3mv54pzvptwz/2kmSrF25lY9DJMcan16Vmf/2e3d56a1d807639efd13d687082fd74e/54309793526_95bde43c49_o_edit.jpg",
 "https://images.ctfassets.net/3mv54pzvptwz/35pn1eth2Axl7wotYaraGZ/3876155128f38d60fd90802a2a87f5a6/54310215145_fa08227213_o_edit.jpg",
 "https://images.ctfassets.net/3mv54pzvptwz/55YLwKPDnRXkqMBITRpWbC/0c2aefc04afa455c20e9ca0d209698e0/53174188191_42d4c831ae_o.jpg",
 "https://images.ctfassets.net/3mv54pzvptwz/42TD6Fhq2w0oyhabHWp8xO/0a4c6268a3f2cf7c55457c16f10709c0/53173917847_d627d526a8_o.jpg",
 "https://images.ctfassets.net/3mv54pzvptwz/6gtrvTIktVpctNW2abHK3S/5ce482bab95bc52d4131ed164060653f/53184067857_5779f60dc1_o.jpg",
 "https://images.ctfassets.net/3mv54pzvptwz/2Ttblioug727xLw2gnbpfW/52691213435bfd32d0e899ed06d2d4ea/_A8A3068-2.jpg",
 "https://images.ctfassets.net/3mv54pzvptwz/1qmWM305s5iA9RWgOIK1dR/c126653923aef2224b1ce6b9a938bdb0/54308913647_e7100da4d0_o_cut.jpg",
 "https://images.ctfassets.net/3mv54pzvptwz/pgbaqNJWxQFU6zbpVX9nG/0e201d447e12e6e67515392e200712c2/WhatsApp_Image_2025-04-29_at_13.25.44.jpeg",
 "https://images.ctfassets.net/3mv54pzvptwz/7oh64sJIZ5oAZxJK5wB4Rk/e022bdffb67bf205097e3f6bd389fe7b/WhatsApp_Image_2025-04-29_at_13.24.52.jpeg",
 "https://images.ctfassets.net/3mv54pzvptwz/7hKc8lbO4dvfcZuNoeQSWc/7c0bf8d3b8c18a23815c6fc696a663bb/WhatsApp_Image_2025-04-29_at_13.22.16.jpeg",
 "https://images.ctfassets.net/3mv54pzvptwz/c1wlKC0CzbuMXyfGzg42e/9ab5df990afdf2d9cdfb3f7a8b1157d6/WhatsApp_Image_2025-04-29_at_13.24.12.jpeg",
 "https://images.ctfassets.net/3mv54pzvptwz/5ptBMwvILg5tH3bfwKw28k/4160832c5234a914b30f1e433e244358/WhatsApp_Image_2025-04-29_at_13.23.38.jpeg",
 "https://images.ctfassets.net/3mv54pzvptwz/4kRF4de5pWBUK2BKANNF9B/bd7b303b7cbbaf23fb8cf546dcab227a/WhatsApp_Image_2025-04-29_at_13.26.15.jpeg",
 "https://images.ctfassets.net/3mv54pzvptwz/5QUmMdxmrm8nbG8qNmNDEM/46b8349a0ff5a3c4c452983d95bf0ae1/WhatsApp_Image_2025-04-29_at_13.23.38__1_.jpeg",
 "https://images.ctfassets.net/3mv54pzvptwz/5zIghnHED3VNsvPxk2L0BZ/d9d477c96a09b815669e3dd2f2008995/WhatsApp_Image_2025-04-29_at_13.26.58.jpeg",
 "https://i.ytimg.com/vi/Had2RaHt2_A/maxresdefault.jpg",
 "https://images.ctfassets.net/3mv54pzvptwz/2ewpDfXtzG9WxlJ0PlmKhv/d39c0b7261a8479dd8dbb4fcfa972279/confederacoes.jpg",
 "https://images.ctfassets.net/3mv54pzvptwz/67h4qafrrcDtn09HHQ3iEw/f77a8a5ad03d1e3968c99ead4cd3cae7/campe_o.jpg",
 "https://i.ytimg.com/vi/Had2RaHt2_A/hqdefault.jpg",
 "https://i.ytimg.com/vi/LhGzAD2mtD4/hqdefault.jpg"
 ];

 const randomLink = links[Math.floor(Math.random() * links.length)];
 const imgName = `Neymar_${randomLink.split('/').pop()}`;
 const imgPath = path.join(__dirname, "cache", imgName);

 if (!fs.existsSync(imgPath)) {
 await new Promise((resolve, reject) => {
 https.get(randomLink, (res) => {
 const fileStream = fs.createWriteStream(imgPath);
 res.pipe(fileStream);
 fileStream.on("finish", () => {
 fileStream.close();
 resolve();
 });
 }).on("error", (err) => {
 fs.unlinkSync(imgPath);
 reject(err);
 });
 });
 }

 message.reply({
 body: `「 The GOAT has arrived 🐐 」\nImage URL: ${randomLink}`,
 attachment: fs.createReadStream(imgPath)
 });

 } catch (error) {
 console.error("Error sending Neymar image:", error);
 message.send("Sorry, couldn't send the Neymar image right now. Try again later!");
 }
 }
};