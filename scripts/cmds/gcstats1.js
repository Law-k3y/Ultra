const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

const profileSize = 42;

module.exports = {
  config: {
    name: "gcstats",
    version: "1.0",
    author: "Team Calyx",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝗚𝗲𝘁 𝗚𝗿𝗼𝘂𝗽 𝗜𝗺𝗮𝗴𝗲"
    },
    longDescription: {
      en: "𝗚𝗲𝘁 𝗚𝗿𝗼𝘂𝗽 𝗜𝗺𝗮𝗴𝗲"
    },
    category: "𝗜𝗠𝗔𝗚𝗘",
    guide: { en: "{p}{n} --colour [colour] --bgcolour [colour] --admincolour [colour] --membercolour [colour]" },
  },

  onStart: async function ({ api, event, usersData, message }) {
    try {
      const args = event.body.split(" ").slice(1);
      const options = {
        colour: "red",
        bgcolour: null,
        admincolour: "blue",
        membercolour: "green",
      };

      args.forEach((arg, index) => {
        if (arg === "--colour" && args[index + 1]) {
          options.colour = args[index + 1];
        } else if (arg === "--bgcolour" && args[index + 1]) {
          options.bgcolour = args[index + 1];
        } else if (arg === "--admincolour" && args[index + 1]) {
          options.admincolour = args[index + 1];
        } else if (arg === "--membercolour" && args[index + 1]) {
          options.membercolour = args[index + 1];
        }
      });

      const threadInfo = await api.getThreadInfo(event.threadID);
      const participantIDs = threadInfo.participantIDs;
      const adminIDs = threadInfo.adminIDs.map((admin) => admin.id);

      const memberProfileImages = await Promise.all(
        participantIDs.map(async (id) => {
          try {
            const avatarUrl = await usersData.getAvatarUrl(id);
            const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
            return response.data;
          } catch {
            return null;
          }
        })
      );

      const adminProfileImages = [];
      const memberProfileImagesFiltered = [];
      for (let i = 0; i < participantIDs.length; i++) {
        if (adminIDs.includes(participantIDs[i])) {
          adminProfileImages.push(memberProfileImages[i]);
        } else {
          memberProfileImagesFiltered.push(memberProfileImages[i]);
        }
      }

      const numAdmins = adminProfileImages.length;
      const numMembers = memberProfileImagesFiltered.length;

      const maxImagesPerRow = 10;
      const gapBetweenImages = 10;

      const totalImages = numAdmins + numMembers;
      const numRows = Math.ceil(totalImages / maxImagesPerRow);

      const canvasWidth = maxImagesPerRow * (profileSize + gapBetweenImages) - gapBetweenImages + 20;
      const canvasHeight = numRows * (profileSize + gapBetweenImages) + 170 + 80;

      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      if (options.bgcolour) {
        try {
          console.log("Loading background image from URL:", options.bgcolour);
          const backgroundImageResponse = await axios.get(options.bgcolour, { responseType: "arraybuffer" });
          const backgroundImage = await loadImage(backgroundImageResponse.data);
          ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
          console.log("Background image loaded successfully.");
        } catch (err) {
          console.error("Error loading background image:", err);
        }
      }

      const threadImageSize = profileSize * 3;
      const threadImageX = (canvasWidth - threadImageSize) / 2;
      const threadImageY = 20;

      if (threadInfo.imageSrc) {
        try {
          const threadImageResponse = await axios.get(threadInfo.imageSrc, { responseType: "arraybuffer" });
          const threadImage = await loadImage(threadImageResponse.data);
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            canvasWidth / 2,
            threadImageY + threadImageSize / 2,
            threadImageSize / 2,
            0,
            Math.PI * 2,
            true
          );
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(threadImage, threadImageX, threadImageY, threadImageSize, threadImageSize);
          ctx.restore();

          ctx.beginPath();
          ctx.arc(
            canvasWidth / 2,
            threadImageY + threadImageSize / 2,
            threadImageSize / 2 + 3,
            0,
            Math.PI * 2,
            true
          );
          ctx.lineWidth = 3;
          ctx.strokeStyle = "red";
          ctx.stroke();
        } catch (err) {
          console.error("Error loading thread image:", err);
        }
      }

      ctx.font = "25px Arial";
      ctx.fillStyle = options.colour;
      ctx.textAlign = "center";
      ctx.fillText(threadInfo.threadName, canvasWidth / 2, threadImageY + threadImageSize + 30);

      ctx.font = "15px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "left";

      ctx.lineWidth = 1;
      ctx.strokeStyle = options.admincolour;
      ctx.strokeText(`Admins: ${numAdmins}`, 10, threadImageY + threadImageSize + 80);
      ctx.fillText(`Admins: ${numAdmins}`, 10, threadImageY + threadImageSize + 80);

      ctx.textAlign = "right";
      ctx.strokeText(`Members: ${numMembers}`, canvasWidth - 10, threadImageY + threadImageSize + 80);
      ctx.fillText(`Members: ${numMembers}`, canvasWidth - 10, threadImageY + threadImageSize + 80);

      let x = 10, y = threadImageY + threadImageSize + 100, colIndex = 0;
      for (const imageBuffer of adminProfileImages.concat(memberProfileImagesFiltered)) {
        if (!imageBuffer) continue;
        const image = await loadImage(imageBuffer);

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + profileSize / 2, y + profileSize / 2, profileSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(image, x, y, profileSize, profileSize);

        ctx.lineWidth = 3;
        ctx.strokeStyle = adminProfileImages.includes(imageBuffer) ? options.admincolour : options.membercolour;
        ctx.stroke();

        ctx.restore();

        colIndex++;
        x += profileSize + gapBetweenImages;

        if (colIndex >= maxImagesPerRow) {
          colIndex = 0;
          x = 10;
          y += profileSize + gapBetweenImages;
        }
      }

      const outputFile = __dirname + "/cache/group_stats.png";
      fs.writeFileSync(outputFile, canvas.toBuffer("image/png"));

      message.reply({
        body: "Group statistics:",
        attachment: fs.createReadStream(outputFile),
      });
    } catch (err) {
      console.error(err);
      message.reply(`An error occurred: ${err.message}`);
    }
  },
};

<div style="text-align: center;"><div style="position:relative; top:0; margin-right:auto;margin-left:auto; z-index:99999">

</div></div>