const quotes = [
 {
 anime: "Naruto",
 character: "Naruto Uzumaki",
 quote: "I'm not gonna run away, I never go back on my word! That's my nindo: my ninja way!"
 },
 {
 anime: "One Piece",
 character: "Monkey D. Luffy",
 quote: "I don't want to conquer anything. I just think the guy with the most freedom in this whole ocean... is the Pirate King!"
 },
 {
 anime: "Attack on Titan",
 character: "Levi Ackerman",
 quote: "Give up on your dreams and die."
 },
 {
 anime: "Death Note",
 character: "L",
 quote: "I am justice!"
 },
 {
 anime: "Demon Slayer",
 character: "Tanjirou Kamado",
 quote: "Grit your teeth and look straight ahead!"
 },
 {
 anime: "Jujutsu Kaisen",
 character: "Gojo Satoru",
 quote: "Throughout heaven and earth, I alone am the honored one."
 },
 {
 anime: "Tokyo Revengers",
 character: "Mikey",
 quote: "If you're weak, just get stronger!"
 },
 {
 anime: "Chainsaw Man",
 character: "Denji",
 quote: "I want to touch some boobs before I die!"
 },
 {
 anime: "Hunter x Hunter",
 character: "Hisoka",
 quote: "I'm not a villain. I'm just a little crazy."
 },
 {
 anime: "Bleach",
 character: "Ichigo Kurosaki",
 quote: "I don't care about the future. I'll protect what's in front of me right now!"
 },
 {
 anime: "Fullmetal Alchemist",
 character: "Roy Mustang",
 quote: "A lesson without pain is meaningless."
 },
 {
 anime: "My Hero Academia",
 character: "All Might",
 quote: "It's fine now. Why? Because I am here!"
 },
 {
 anime: "Dragon Ball Z",
 character: "Vegeta",
 quote: "Power comes in response to a need, not a desire."
 },
 {
 anime: "Code Geass",
 character: "Lelouch",
 quote: "The only ones who should kill are those who are prepared to be killed."
 },
 {
 anime: "Steins;Gate",
 character: "Okabe Rintarou",
 quote: "The organization is watching us!"
 },
 {
 anime: "Neon Genesis Evangelion",
 character: "Shinji Ikari",
 quote: "I mustn't run away."
 },
 {
 anime: "Cowboy Bebop",
 character: "Spike Spiegel",
 quote: "Whatever happens, happens."
 },
 {
 anime: "Vinland Saga",
 character: "Thorfinn",
 quote: "I have no enemies."
 },
 {
 anime: "Black Clover",
 character: "Asta",
 quote: "I'm not done yet!"
 },
 {
 anime: "Haikyuu!!",
 character: "Hinata Shoyo",
 quote: "Talent is something you make bloom!"
 },
 {
 anime: "Kaguya-sama: Love is War",
 character: "Kaguya Shinomiya",
 quote: "How cute."
 },
 {
 anime: "Re:Zero",
 character: "Subaru Natsuki",
 quote: "I love Emilia."
 },
 {
 anime: "Sword Art Online",
 character: "Kirito",
 quote: "This is my world."
 },
 {
 anime: "Fairy Tail",
 character: "Natsu Dragneel",
 quote: "We don't die for our friends. We live for them!"
 },
 {
 anime: "The Quintessential Quintuplets",
 character: "Nakano Itsuki",
 quote: "I'll never forgive you!"
 },
 {
 anime: "Dr. Stone",
 character: "Senku Ishigami",
 quote: "Get excited!"
 },
 {
 anime: "Mob Psycho 100",
 character: "Mob",
 quote: "I'm not special."
 },
 {
 anime: "One Punch Man",
 character: "Saitama",
 quote: "I'm just a hero for fun."
 },
 {
 anime: "JoJo's Bizarre Adventure",
 character: "Dio Brando",
 quote: "WRYYYYYY!"
 },
 {
 anime: "Konosuba",
 character: "Kazuma Satou",
 quote: "This is the worst!"
 },
 {
 anime: "Overlord",
 character: "Ainz Ooal Gown",
 quote: "Sasuga Ainz-sama!"
 },
 {
 anime: "No Game No Life",
 character: "Sora",
 quote: "Blank never loses!"
 },
 {
 anime: "The Rising of the Shield Hero",
 character: "Naofumi Iwatani",
 quote: "I hate this world."
 },
 {
 anime: "That Time I Got Reincarnated as a Slime",
 character: "Rimuru Tempest",
 quote: "I'm not a bad slime!"
 },
 {
 anime: "The Promised Neverland",
 character: "Emma",
 quote: "We'll escape together!"
 },
 {
 anime: "Dororo",
 character: "Hyakkimaru",
 quote: "Give me back my body!"
 },
 {
 anime: "Devilman Crybaby",
 character: "Akira Fudo",
 quote: "Humans are the real devils!"
 },
 {
 anime: "Berserk",
 character: "Guts",
 quote: "I'll keep struggling until I die!"
 },
 {
 anime: "Hellsing Ultimate",
 character: "Alucard",
 quote: "I'm here to suck your blood!"
 },
 {
 anime: "Parasyte",
 character: "Shinichi Izumi",
 quote: "Humans are the real parasites."
 },
 {
 anime: "Psycho-Pass",
 character: "Shinya Kogami",
 quote: "Justice will prevail!"
 },
 {
 anime: "Ghost in the Shell",
 character: "Motoko Kusanagi",
 quote: "I'm a cyborg."
 },
 {
 anime: "Akira",
 character: "Tetsuo Shima",
 quote: "I am Tetsuo!"
 },
 {
 anime: "Neon Genesis Evangelion",
 character: "Rei Ayanami",
 quote: "I am not a doll."
 },
 {
 anime: "Clannad",
 character: "Tomoya Okazaki",
 quote: "I hate this town."
 },
 {
 anime: "Angel Beats!",
 character: "Otonashi",
 quote: "I must find the meaning of my life."
 },
 {
 anime: "Anohana",
 character: "Menma",
 quote: "I'm here!"
 },
 {
 anime: "Your Lie in April",
 character: "Kaori Miyazono",
 quote: "I want to shine!"
 },
 {
 anime: "Violet Evergarden",
 character: "Violet Evergarden",
 quote: "What does 'I love you' mean?"
 },
 {
 anime: "A Silent Voice",
 character: "Shoya Ishida",
 quote: "I want to live properly."
 },
 {
 anime: "Weathering With You",
 character: "Hodaka Morishima",
 quote: "I want to see the sun!"
 },
 {
 anime: "Your Name",
 character: "Taki Tachibana",
 quote: "I feel like I'm always searching for someone."
 },
 {
 anime: "Spirited Away",
 character: "Chihiro Ogino",
 quote: "I have to save my parents!"
 },
 {
 anime: "Howl's Moving Castle",
 character: "Howl",
 quote: "I see no point in living if I can't be beautiful."
 },
 {
 anime: "Princess Mononoke",
 character: "San",
 quote: "I'm not human!"
 },
 {
 anime: "Grave of the Fireflies",
 character: "Seita",
 quote: "I'll protect my sister!"
 },
 {
 anime: "Perfect Blue",
 character: "Mima Kirigoe",
 quote: "Who am I?"
 },
 {
 anime: "Paprika",
 character: "Paprika",
 quote: "Dreams can come true!"
 }
];

const designs = [
 (a, c, q) => `🌸 𝗔𝗡𝗜𝗠𝗘 𝗤𝗨𝗢𝗧𝗘 🌸\n\n"${q}"\n\n—— 𝗕𝘆 ${c} (${a})`,
 (a, c, q) => `✧･ﾟ: *✧･ﾟ:* *:･ﾟ✧*:･ﾟ✧\n\n"${q}"\n\n~ ${c} | ${a} ✧･ﾟ: *✧･ﾟ:*`,
 (a, c, q) => `『 ${a} 』\n\n"${q}"\n\n- ${c}`,
 (a, c, q) => `╔═══ ∘◦ ✾ ◦∘ ═══╗\n\n "${q}"\n\n╚═══ ∘◦ ❂ ◦∘ ═══╝\n\n — ${c} (${a})`,
 (a, c, q) => `♡₊˚ 🎀 ⋅ ༉‧₊˚.\n"${q}"\n⋅ ༉‧₊˚. 🎀 ˚₊♡\n\n— ${c}・❥・${a}`,
 (a, c, q) => `┌─── ∘◦ ❁ ◦∘ ───┐\n\n ✎ "${q}"\n\n└─── ∘◦ ❀ ◦∘ ───┘\n\n ✧ ${c} » ${a} ✧`,
 (a, c, q) => `⋆⋅☆⋅⋆ ⋆⋅☆⋅⋆ ⋆⋅☆⋅⋆\n\n"${q}"\n\n⋆⋅☆⋅⋆ ${c} ⋅☆⋅ ${a} ⋆⋅☆⋅⋆`,
 (a, c, q) => `▁ ▂ ▄ ▅ ▆ ▇ █\n\n ✦ "${q}" ✦\n\n█ ▇ ▆ ▅ ▄ ▂ ▁\n\n — ${c} [${a}]`,
 (a, c, q) => `◤━━━━━━━━━━━━◥\n\n ✧ ${q} ✧\n\n◣━━━━━━━━━━━━◢\n\n ${c} ≛ ${a}`,
 (a, c, q) => `╭────────────╮\n\n ❝ ${q} ❞\n\n╰────────────╯\n\n ↳ ${c}, ${a}`
];

module.exports = {
 config: {
 name: "animequote",
 aliases: ['animeq', 'aq', 'quote'],
 author: "Chitron Bhattacharjee",
 version: "3.0",
 shortDescription: "Get aesthetic anime quotes",
 longDescription: "Get 59+ popular anime quotes with 10+ random stylish designs",
 category: "entertainment",
 guide: { en: "Just type {pn}" }
 },

 onStart: async function ({ message }) {
 try {
 const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
 const randomDesign = designs[Math.floor(Math.random() * designs.length)];
 
 const formatted = randomDesign(
 randomQuote.anime,
 randomQuote.character,
 randomQuote.quote
 );

 return message.reply(formatted);
 } catch (error) {
 console.error(error);
 return message.reply("🌸 An error occurred while fetching your quote!");
 }
 }
};