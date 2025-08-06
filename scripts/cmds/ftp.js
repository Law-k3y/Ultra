const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const ftp = require("basic-ftp");

const FTP_CONFIG = {
  host: "ftpupload.net",
  user: "cpfr_39361582",
  password: "chitron@2448766",
  secure: false,
  port: 21
};

module.exports = {
  config: {
    name: "ftp",
    version: "2.2",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 2,
    shortDescription: { en: "✨ Upload, list, delete FTP files" },
    description: {
      en: "🌸 Upload .js/.txt/.html/etc to your FTP server (htdocs/store) — anime style~"
    },
    category: "tools",
    guide: {
      en:
        "🌸 𝒰𝓈𝒶𝑔𝑒:\n\n" +
        "📤 *Upload:*\n" +
        "➤ +ftp file.js console.log('hi');\n" +
        "➤ +ftp file.js https://link\n\n" +
        "📄 *List files:*\n" +
        "➤ +ftp list\n\n" +
        "🗑 *Delete file:*\n" +
        "➤ +ftp delete file.js"
    }
  },

  onStart: async function ({ message, args }) {
    return handleFtp(message, args);
  },

  onChat: async function ({ event, message, args, prefix }) {
    if (!prefix || !args[0]) return;
    const trigger = args[0].toLowerCase();
    if (trigger !== "ftp") return;
    return handleFtp(message, args.slice(1));
  }
};

async function handleFtp(message, args) {
  const subCmd = args[0];

  // === 🧾 List Files ===
  if (subCmd === "list") {
    return await listFiles(message);
  }

  // === 🗑 Delete File ===
  if (subCmd === "delete") {
    const filename = args[1];
    if (!filename)
      return message.reply("❌ | 𝒫𝓁𝑒𝒶𝓈𝑒 𝓈𝓅𝑒𝒸𝒾𝒻𝓎 𝒶 𝒻𝒾𝓁𝑒 𝓃𝒶𝓂𝑒 𝓉𝑜 𝒹𝑒𝓁𝑒𝓉𝑒 💔");
    return await deleteFile(message, filename);
  }

  // === 📤 Upload File ===
  const [filename, ...rest] = args;
  if (!filename || !/\.(js|php|html|txt|py|json)$/i.test(filename)) {
    return message.reply("🚫 | 𝒱𝒶𝓁𝒾𝒹 𝒻𝒾𝓁𝑒𝓃𝒶𝓂𝑒 𝓇𝑒𝓆𝓊𝒾𝓇𝑒𝒹 (.js, .php...)");
  }

  const content = rest.join(" ");
  if (!content)
    return message.reply("❌ | 𝒫𝓁𝑒𝒶𝓈𝑒 𝓅𝓇𝑜𝓋𝒾𝒹𝑒 𝒸𝑜𝒹𝑒 𝑜𝓇 𝓊𝓇𝓁 ✨");

  let code;
  try {
    code = /^https?:\/\//i.test(content.trim())
      ? (await axios.get(content.trim())).data
      : content;
  } catch (err) {
    return message.reply("😢 | 𝒞𝑜𝓊𝓁𝒹 𝓃𝑜𝓉 𝒻𝑒𝓉𝒸𝒽 𝒸𝑜𝒹𝑒 𝒻𝓇𝑜𝓂 𝓊𝓇𝓁...");
  }

  const tempPath = path.join(__dirname, "cache", filename);
  await fs.ensureDir(path.dirname(tempPath));
  await fs.writeFile(tempPath, code);

  const client = new ftp.Client();
  try {
    await client.access(FTP_CONFIG);
    await client.cd("htdocs");
    try {
      await client.send("MKD store");
    } catch {}
    await client.cd("store");

    await client.uploadFrom(tempPath, filename);
    await client.close();

    return message.reply(
      `✅ | 𝒰𝓅𝓁𝑜𝒶𝒹𝑒𝒹 ✨ \`${filename}\`\n` +
      `📁 𝓉𝑜 \`htdocs/store\`\n🌸 𝒴𝒶𝓎~ 𝒾𝓉'𝓈 𝓈𝒶𝒻𝑒 & 𝓈𝓉𝓎𝓁𝒾𝓈𝒽!`
    );
  } catch (err) {
    return message.reply(
      `❌ | 𝒰𝓅𝓁𝑜𝒶𝒹 𝒻𝒶𝒾𝓁𝑒𝒹 💔\n🛠 𝑅𝑒𝒶𝓈𝑜𝓃: ${err.message}`
    );
  } finally {
    client.close();
    await fs.remove(tempPath);
  }
}

// === 📄 List Files ===
async function listFiles(message) {
  const client = new ftp.Client();
  try {
    await client.access(FTP_CONFIG);
    await client.cd("htdocs/store");
    const files = await client.list();

    if (!files.length)
      return message.reply("📭 | 𝒩𝑜 𝒻𝒾𝓁𝑒𝓈 𝒻𝑜𝓊𝓃𝒹 𝓉𝒽𝑒𝓇𝑒 😥");

    const fileList = files
      .map((f, i) => `📄 ${i + 1}. ${f.name} — \`${f.size} bytes\``)
      .join("\n");

    return message.reply(
      `🌸 𝒲𝒽𝒶𝓉'𝓈 𝒾𝓃 𝓎𝑜𝓊𝓇 𝓈𝓉𝑜𝓇𝑒? 📁\n\n${fileList}`
    );
  } catch (err) {
    return message.reply("❌ | 𝒞𝑜𝓊𝓁𝒹 𝓃𝑜𝓉 𝓁𝒾𝓈𝓉 𝒻𝒾𝓁𝑒𝓈 💢");
  } finally {
    client.close();
  }
}

// === 🗑 Delete File ===
async function deleteFile(message, filename) {
  const client = new ftp.Client();
  try {
    await client.access(FTP_CONFIG);
    await client.remove(`htdocs/store/${filename}`);

    return message.reply(
      `🗑️ | 𝒟𝑒𝓁𝑒𝓉𝑒𝒹 \`${filename}\`\n💨 𝒻𝓇𝑜𝓂 \`htdocs/store\`\n😌 𝒢𝑜𝓃𝑒 𝓁𝒾𝓀𝑒 𝓉𝒽𝑒 𝓌𝒾𝓃𝒹~`
    );
  } catch (err) {
    return message.reply(
      `❌ | 𝒞𝑜𝓊𝓁𝒹 𝓃𝑜𝓉 𝒹𝑒𝓁𝑒𝓉𝑒 💔\n📛 𝑅𝑒𝒶𝓈𝑜𝓃: ${err.message}`
    );
  } finally {
    client.close();
  }
    }
