module.exports = {
  config: {
    name: "sexvid",
    aliases: ["sexvideo", "pornvid"],
    version: "2.0",
    author: "Chitron Bhattacharjee",
    countDown: 30,
    role: 0,
    shortDescription: "Send naughty dark fantasy adult videos",
    longDescription: "Get random dark fantasy styled adult videos from Google Drive links",
    category: "18+",
    guide: "{p}{n}",
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    try {
      const loadingMessage = await message.reply("🖤🦇 𝕎𝕒𝕚𝕥 𝕦𝕡, 𝕓𝒶𝒷𝓎... 𝕥𝕙𝕖 𝕟𝕚𝕘𝕙𝕥’𝕤 𝕙𝕠𝕥𝕥𝕖𝕤𝕥 𝕕𝕖𝕤𝕚𝕣𝕖𝕤 𝒶𝓇𝑒 𝕓𝕖𝕚𝕟𝕘 𝕦𝕟𝕝𝕖𝕒𝕤𝕙𝕖𝕕... 🥵💦");

      const videoLinks = [
        "https://drive.google.com/uc?export=download&id=1-gJdG8bxmZLyOC7-6E4A5Hm95Q9gWIPO",
      "https://drive.google.com/uc?export=download&id=1-ryNR8j529EZyTCuMur9wmkFz4ahlv-f",
      "https://drive.google.com/uc?export=download&id=1-vHh7XBtPOS3s42q-s8s30Bzsx2u6czu",
      "https://drive.google.com/uc?export=download&id=11IUd-PDHozLmh_RtvSf0S-f3G6wut1ZT",
      "https://drive.google.com/uc?export=download&id=12YCqZovJ8sVZZZTDLu8dv8NAwsMGfqiB",
      "https://drive.google.com/uc?export=download&id=12eIiCYpd_Jm8zIVRSkqlSt7W-7OsxB6g",
      "https://drive.google.com/uc?export=download&id=13utWruipZ_3fR0QSMtGMnFjGt3bthnbf",
      "https://drive.google.com/uc?export=download&id=14GYNaYL-pkEh3UH0oIUXVamru5h830DY",
      "https://drive.google.com/uc?export=download&id=14UGb2fH4wyUbVSQ-Vt5yf-4sH3-icXGC",
      "https://drive.google.com/uc?export=download&id=161O9_EbCQJ8nHTT7VeE7BWtHvEjHAT4k",
      "https://drive.google.com/uc?export=download&id=170YWB4jpMfR5GpmPb_Lymh6OmrmWDE0x",
      "https://drive.google.com/uc?export=download&id=17nvXNBpMWVmuWLK-kkLzkbrbpW43rD4r",
      "https://drive.google.com/uc?export=download&id=17w7sehThOv6IRrcsLboi7Zk6zZvfBHr5",
      "https://drive.google.com/uc?export=download&id=17yaPd3PoYJkuL0IEZHzcBic9pX4AmGiK",
      "https://drive.google.com/uc?export=download&id=18Dyc1vkysNhHSGi5OYpa6AzD5rk3_vkf",
      "https://drive.google.com/uc?export=download&id=18brau5aYmiMAxfhDTLz_nFWuIcb_mja5",
      "https://drive.google.com/uc?export=download&id=19GcLpOzFYypYFu1FboQyVjWxC9Jh3JC5",
      "https://drive.google.com/uc?export=download&id=19lKQChg0hv2MOTphkyI4zTiUIxuujd03",
      "https://drive.google.com/uc?export=download&id=1AjrBOBRWKpKjLOYV1oof2mVZBzx0ebgD",
      "https://drive.google.com/uc?export=download&id=1BPOEwIt7lGv66w5pUTDU937q4i5ym5S_",
      "https://drive.google.com/uc?export=download&id=1C-VxCoO5gMKCq2rg7PxjlitK4bOg7pt2",
      "https://drive.google.com/uc?export=download&id=1C9t9VNpLT9DelBeDnbFNjdAA0tK_cXh-",
      "https://drive.google.com/uc?export=download&id=1DrhAOOeYIHlTWJU5e26OMjO0R5nueyf7",
      "https://drive.google.com/uc?export=download&id=1Dz7UfOejW9rDFYFAtxmAq_ncv04WaTTL",
      "https://drive.google.com/uc?export=download&id=1EcBmrdqYfQbwSPr2kiKY2QV_6CXLJJj6",
      "https://drive.google.com/uc?export=download&id=1F5Xc5Qff4RGyUuHzuqPfmOn2EZKQIn7P",
      "https://drive.google.com/uc?export=download&id=1FTxkmgt2sWf8U2h8a5HszyKINMr6Gnwm",
      "https://drive.google.com/uc?export=download&id=1Frf4GUg26Abw2lJdQ_RHycNhDMZXfMm2",
      "https://drive.google.com/uc?export=download&id=1FtdiGL244Kcj7tiA6F_2mKeTmMpVCyjr",
      "https://drive.google.com/uc?export=download&id=1G2tE1VdFzzqochfGwXwc46nuwkTeRRSc",
      "https://drive.google.com/uc?export=download&id=1GB6VOhgA3-JUSUZ3D1xgjlKH1Jswy0Z4",
      "https://drive.google.com/uc?export=download&id=1G_04XtbUP-QZNWFzdLohwY_w6BRdmijk",
      "https://drive.google.com/uc?export=download&id=1GpvlwryNcsRz2i6VYEV3NqSLr0WtGGn_",
      "https://drive.google.com/uc?export=download&id=1HYn-ZCVB0JcipKWrMxPnSrAVP4oSjePT",
      "https://drive.google.com/uc?export=download&id=1H_5i2V6W8Fl0N5QIKPACEUcljd8-q_dT",
      "https://drive.google.com/uc?export=download&id=1HhFPMOMXI7DDKc371C-12A0yfC0101x7",
      "https://drive.google.com/uc?export=download&id=1JNRfPMJe1_SodueqhMVf4so0-vjWaK9V",
      "https://drive.google.com/uc?export=download&id=1Jjy85bIGE9efsUIlmHykEistAquEB9oT",
      "https://drive.google.com/uc?export=download&id=1JoXCYZz4YoKpWe809ttUaaSsJdsCJZNf",
      "https://drive.google.com/uc?export=download&id=1Ko-ScBYddulpKX4I4xS7BRkndIaZZ3gT",
      "https://drive.google.com/uc?export=download&id=1LU4PTBFjWlhgzP2HiiJX_Esw2iIq7Zpj",
      "https://drive.google.com/uc?export=download&id=1LaM2kIlZUdA_UbCzX8s92nxcqEJieHLN",
      "https://drive.google.com/uc?export=download&id=1LcClA0b5Qih_tIv_wVRUsWX9gk3bVmzj",
      "https://drive.google.com/uc?export=download&id=1LgVpbMhe0CXM7rIUr9pJNK46QtZcpRtK",
      "https://drive.google.com/uc?export=download&id=1MB-KTUmPMkSb1o4J_EIRQ8mJ3w-cUOtY",
      "https://drive.google.com/uc?export=download&id=1M_cHjSaNWT5b_8p9VSPmzVyz-rqBqo3S",
      "https://drive.google.com/uc?export=download&id=1NC3fFj68PqqvZeg67AdA_cHyNdOBlRfF",
      "https://drive.google.com/uc?export=download&id=1Nk534yO5owt7IaMOKjbT6IGLGW96Gv0f",
      "https://drive.google.com/uc?export=download&id=1O1Cej8MFdytRun3RmGTnmT6uk1T-Zcmu",
            ];

      const randomIndex = Math.floor(Math.random() * videoLinks.length);
      const videoUrl = videoLinks[randomIndex];

      await api.sendMessage(
        {
          body: `💀👀 𝕐𝕠𝕦’𝕣𝕖 𝕕𝕖𝕖𝕡 𝕚𝕟 𝕥𝕙𝕖 𝕕𝕒𝕣𝕜𝕟𝕖𝕤𝕤, 𝕓𝕒𝕓𝕪... 𝒟𝒶𝓇𝓀 𝓅𝓁𝑒𝒶𝓈𝓊𝓇𝑒𝓈 𝒶𝓇𝑒 𝓃𝑜𝓌 𝕓𝕖𝕚𝕟𝕘 𝕣𝕖𝕝𝕖𝕒𝕤𝕖𝕕 🥵👄👅\n\n💦 𝕃𝕖𝕥 𝕞𝕪 𝕡𝕝𝕒𝕪𝕗𝕦𝕝 𝕝𝕚𝕡𝕤 𝕨𝕖𝕥 𝕪𝕠𝕦𝕣 𝕤𝕔𝕣𝕖𝕖𝕟 💋🫦💅`,
          attachment: await global.utils.downloadFile(videoUrl),
        },
        event.threadID,
        () => loadingMessage.delete()
      );
    } catch (error) {
      message.reply("💀 𝕊𝕠𝕞𝕖𝕥𝕙𝕚𝕟𝕘 𝕓𝕣𝕠𝕜𝕖... 𝕥𝕣𝕪 𝕒𝕘𝕒𝕚𝕟 𝕝𝕒𝕥𝕖𝕣 😋");
      console.error(error);
    }
  },
};
