process.on('unhandledRejection', error => console.error(error));
process.on('uncaughtException', error => console.error(error));

// Set bash title
process.stdout.write("\x1b]2;Shipu AI - Made by Chitron Bhattacharjee\x1b\x5c");

// Verify and require essential packages
try {
  var colors = require('colors');
} catch (e) {
  console.error("CRITICAL: 'colors' package missing. Run: npm install colors");
  process.exit(1);
}

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const readline = require("readline");
const gradient = require("gradient-string");
const { promisify } = require("util");

class ShipuAiLogin {
  constructor() {
    this.dirAccount = path.resolve(process.cwd(), global.client?.dirAccount || "account.dev.txt");
    this.config = global.GoatBot?.config || {};
    this.currentVersion = require(path.resolve(process.cwd(), "package.json")).version;
    this.titles = this.getTitleArt();
    
    // Enhanced error handling for initialization
    this.init().catch(err => {
      console.error(colors.red("[FATAL] INIT ERROR:"), err.stack || err);
      process.exit(1);
    });
  }

  getTitleArt() {
    return [
      [
        "███████╗██╗  ██╗██╗██████╗ ██╗   ██╗",
        "██╔════╝██║  ██║██║██╔══██╗██║   ██║",
        "███████╗███████║██║██████╔╝██║   ██║",
        "╚════██║██╔══██║██║██╔═══╝ ██║   ██║",
        "███████║██║  ██║██║██║     ╚██████╔╝",
        "╚══════╝╚═╝  ╚═╝╚═╝╚═╝      ╚═════╝",
        "",
        " █████╗ ██╗",
        "██╔══██╗██║",
        "███████║██║",
        "██╔══██║██║",
        "██║  ██║██║",
        "╚═╝  ╚═╝╚═╝",
        "",
        colors.gray("made by Chitron Bhattacharjee")
      ],
      [
        "Shipu",
        "  AI",
        "",
        colors.gray("made by Chitron Bhattacharjee")
      ],
      [
        `Shipu AI @${this.currentVersion}`,
        "",
        colors.gray("made by Chitron Bhattacharjee")
      ],
      [
        "Shipu AI",
        "",
        colors.gray("made by Chitron Bhattacharjee")
      ]
    ];
  }

  async init() {
    await this.showWelcome();
    await this.checkVersion();
    await this.startBot();
  }

  async showWelcome() {
    try {
      const maxWidth = process.stdout.columns || 80;
      const titleSet = this.getTitleForWidth(maxWidth);
      
      console.log(gradient("#f5af19", "#f12711")(this.createLine(null, true)));
      console.log();
      
      titleSet.forEach(line => {
        if (line.includes("made by")) {
          console.log(colors.gray(line));
        } else {
          const colored = gradient("#FA8BFF", "#2BD2FF", "#2BFF88")(line);
          this.centerText(colored, line.length);
        }
      });

      console.log();
      this.centerText(gradient("#9F98E8", "#AFF6CF")(`Shipu AI v${this.currentVersion}`));
      this.centerText(colors.blue("Advanced AI Assistant"));
      this.centerText(colors.blue.underline("https://github.com/chitronb/shipu-ai"));
      console.log();
    } catch (err) {
      console.error(colors.red("[WELCOME ERROR]"), err);
    }
  }

  getTitleForWidth(width) {
    if (width > 58) return this.titles[0];
    if (width > 36) return this.titles[1];
    if (width > 26) return this.titles[2];
    return this.titles[3];
  }

  centerText(text, length) {
    const width = process.stdout.columns || 80;
    const padLength = Math.max(0, Math.floor((width - (length || text.length)) / 2));
    console.log(' '.repeat(padLength) + text);
  }

  createLine(content, isMaxWidth = false) {
    const width = isMaxWidth ? (process.stdout.columns || 80) : Math.min(process.stdout.columns || 80, 50);
    if (!content) return colors.yellow('─'.repeat(width));
    
    content = ` ${content.trim()} `;
    const padLength = Math.floor((width - content.length) / 2);
    return colors.yellow('─'.repeat(padLength) + content + '─'.repeat(width - content.length - padLength));
  }

  async checkVersion() {
    try {
      const { data } = await axios.get(
        "https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/package.json",
        { timeout: 5000 }
      );
      
      if (this.compareVersion(data.version, this.currentVersion) > 0) {
        console.log(colors.yellow(`Update available: v${this.currentVersion} → v${data.version}`));
        console.log(colors.yellow("Run: npm update"));
      }
    } catch (err) {
      console.warn(colors.yellow("[VERSION CHECK]"), "Failed to check updates:", err.message);
    }
  }

  compareVersion(v1, v2) {
    const parsePart = part => isNaN(part) ? part : parseInt(part);
    const parts1 = v1.split('.').map(parsePart);
    const parts2 = v2.split('.').map(parsePart);
    
    for (let i = 0; i < 3; i++) {
      if (parts1[i] > parts2[i]) return 1;
      if (parts1[i] < parts2[i]) return -1;
    }
    return 0;
  }

  async startBot() {
    console.log(this.createLine("STARTING SHIPU AI", true));
    
    try {
      // Load original bot login logic
      const loginFile = path.resolve(__dirname, `login${process.env.NODE_ENV === 'development' ? '.dev' : ''}.js`);
      if (!fs.existsSync(loginFile)) {
        throw new Error(`Login file not found: ${loginFile}`);
      }
      
      console.log(colors.green("Initializing..."));
      require(loginFile);
      
    } catch (err) {
      console.error(colors.red("[STARTUP FAILED]"), err.stack || err);
      process.exit(1);
    }
  }
}

// Start with enhanced error handling
try {
  new ShipuAiLogin();
} catch (err) {
  console.error(colors.red("[CRITICAL ERROR]"), err.stack || err);
  process.exit(1);
}
