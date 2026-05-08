const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 🔒 AUTHOR LOCK
const AUTHOR_LOCK = "𝙼'𝚁_𝙵𝙰𝚁𝙷𝙰𝙽";

module.exports.config = {
  name: "auto_azan",
  version: "4.0",
  role: 0,
  author: AUTHOR_LOCK,
  description: "নামাজ টাইমে ভিডিও + Random Dua সহ মেসেজ যাবে (No Duplicate)",
  category: "Utility",
  countDown: 5,
};

// 🔒 SAFE PROTECTION
if (module.exports.config.author !== AUTHOR_LOCK) {
  console.log("❌ Author changed! Command disabled.");
  module.exports.onLoad = () => {};
  module.exports.onStart = () => {};
  return;
}

module.exports.onLoad = async function ({ api }) {

  // 🔥 memory + file based lock (strong anti-duplicate)
  const sentFile = path.join(__dirname, "cache", "azan_sent.json");

  if (!fs.existsSync(sentFile)) {
    fs.writeJsonSync(sentFile, {});
  }

  let sentData = fs.readJsonSync(sentFile);

  const prayerTimes = {
    "05:00 AM": "🕌 ফজরের নামাজের সময় হয়েছে",
    "01:10 PM": "🕌 যোহরের নামাজের সময় হয়েছে",
    "05:00 PM": "🕌 আসরের নামাজের সময় হয়েছে",
    "06:15 PM": "🕌 মাগরিবের নামাজের সময় হয়েছে",
    "08:00 PM": "🕌 এশার নামাজের সময় হয়েছে"
  };

  const duas = [
    "🤲 اللّهُمَّ اغْفِرْ لِي وَارْحَمْنِي\nহে আল্লাহ, আমাকে ক্ষমা করুন ও দয়া করুন",
    "🤲 رَبِّ زِدْنِي عِلْمًا\nহে আমার রব, আমার জ্ঞান বৃদ্ধি করুন",
    "🤲 اللّهُمَّ اهْدِنِي الصِّرَاطَ الْمُسْتَقِيمَ\nহে আল্লাহ, আমাকে সরল পথে পরিচালিত করুন",
    "🤲 رَبَّنَا تَقَبَّلْ مِنَّا\nহে আমাদের রব, আমাদের আমল কবুল করুন",
    "🤲 اللّهُمَّ ارْزُقْنِي حَلَالًا طَيِّبًا\nহে আল্লাহ, আমাকে হালাল রিযিক দান করুন"
  ];

  console.log("🕌 Auto Azan Loaded (No Duplicate Mode)...");

  const checkPrayer = async () => {
    const now = moment().tz("Asia/Dhaka");
    const timeNow = now.format("hh:mm A");
    const dateNow = now.format("DD-MM-YYYY");

    const key = `${dateNow}_${timeNow}`;

    // 🚫 already sent check (strong)
    if (sentData[key]) return;

    if (prayerTimes[timeNow]) {

      sentData[key] = true;
      fs.writeJsonSync(sentFile, sentData);

      const randomDua = duas[Math.floor(Math.random() * duas.length)];

      const finalMsg =
`━━━━━━━━━━━━━━━━━━
${prayerTimes[timeNow]}
🕒 সময়: ${timeNow}
📅 তারিখ: ${dateNow}
━━━━━━━━━━━━━━━━━━

📿 দোয়া:
${randomDua}

◢◤━━━━━━━━━━━━━━━━◥◣
🤖 𝙱𝙾𝚃_𝙾𝚆𝙽𝙴𝚁:- ${AUTHOR_LOCK}
🤲 সবাই নামাজ আদায় করুন
◥◣━━━━━━━━━━━━━━━━◢◤`;

      try {
        const allThreads = await api.getThreadList(100, null, ["INBOX"]);
        const groupThreads = allThreads.filter(t => t.isGroup);

        const cacheDir = path.join(__dirname, "cache");
        const filePath = path.join(cacheDir, "azan.mp4");

        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir);
        }

        // 🎥 download only once
        if (!fs.existsSync(filePath)) {
          const res = await axios({
            url: "https://files.catbox.moe/gr8zqw.mp4",
            method: "GET",
            responseType: "stream"
          });

          await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            res.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
          });
        }

        // 📤 send one time only
        for (const thread of groupThreads) {
          await api.sendMessage({
            body: finalMsg,
            attachment: fs.createReadStream(filePath)
          }, thread.threadID);
        }

        console.log("✅ Azan sent (No duplicate)");

      } catch (err) {
        console.error("❌ Error:", err);
      }
    }
  };

  // ⚡ smarter interval (5 sec)
  setInterval(checkPrayer, 5000);
};

module.exports.onStart = () => {};
