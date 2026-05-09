const axios = require("axios");

module.exports = {
	config: {
		name: "islamic",
		aliases: ["islam"],
		version: "2.0",
		author: "MR_FARHAN",
		countDown: 5,
		role: 0,
		shortDescription: "Random captions with video and owner link",
		longDescription: "Bangla + English captions with direct video and owner contact link",
		category: "𝗙𝗨𝗡",
		guide: "{pn}"
	},

	onStart: async function ({ message, api }) {
		const { messageID } = message;

		// 🔒 AUTHOR LOCK
		if (this.config.author !== "MR_FARHAN") {
			return message.reply("⚠️ Author change detected! Command disabled.");
		}

		try {
			api.setMessageReaction("⏳", messageID, () => {}, true);
		} catch {}

		let loadingMsg;
		try {
			loadingMsg = await message.reply("⚡ ᴠɪᴅᴇᴏ ʟᴏᴀᴅɪɴɢ...⚡");
		} catch {}

		// 🔥 Drive Links (Converted)
		const links = [
	    "14emH_6vF3fuJe2vmeC52e575TppboHne",
			"15APJbSuGLY7zCiZsAgU7HjCJeinYDX9K",
			"15ImMIXM_mqPM8hXpQNPLTGCrm9sh0RPS",
			"14qUnMm3J3cUqImDDy4ehRjDiv_NeRpMo",
			"15ZqanDuEYrC-lHSsiIYAjWagr1h8yZpP",
			"155rlKywUHP3xzgJkQ1ztxXpKnDxXtXlb",
			"156MaTKck-_ureBfj7NI-iU7_rGut-ssD",
			"15l4gxljfoe9-WvQKzffjambLC5Tt1YNd",
			"15fauLjjElJ0loxajhUvDeaKTqW4YdskK",
			"16IBAHr7AlKM1RR4hiTBuvAn5x27ed6j4",
			"15amvNN6WLIKwg17ufgFhs7EqI0EXNxy5",
			"15OS5gFi2QGZm5TTStIn6iD3YRUNHw1Zm",
			"168qMjWaEyObyBgJrilyTb4vOcvgynQAD",
			"15FFHINVpAbr4ykjkhk1_vQ5uDQakTcpy",
			"14j501R3TheTH3YLInLZlLTU-oXVvjegw",
			"15UmCBW1ddt6Kpt9xytqPpXiJip-05bDG",
			"14e0lCDG6vwzGi8apiDcm38Wov911501y",
			"15Cbl-YGajKcV0QMp6bDtRT4dI-K6lWR0",
			"15hJ9St2amhdLnowAvuDn0BicgZ5Aw0rW",
			"15QIjrXblGNjf5b3J6dRQ4XMSV-_j7soB",
			"15tgfSnX-ICfO8V5T6vXbb_AwYkfl_EYX"
		];

		// 🎲 Random ID
		const randomID = links[Math.floor(Math.random() * links.length)];

		// ✅ Proper Direct Download Link
		const videoURL = `https://drive.google.com/uc?export=download&id=${randomID}`;

		const caption = `✢━━━━━━━━━━━━━━━✢\n✨ 𝐑𝐚𝐧𝐝𝐨𝐦 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 🎬\n𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐦𝐨𝐦𝐞𝐧𝐭 💫`;

		const footer = `\n✢━━━━━━━━━━━━━━━✢\n--❖(✷‿𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓‿✷)❖--\n✢━━━━━━━━━━━━━━━✢\n(✷‿𝐎𝐖𝐍𝐄𝐑:-𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍‿✷)`;

		try {
			const stream = await global.utils.getStreamFromURL(videoURL);

			await message.reply({
				body: caption + footer,
				attachment: stream
			});

			if (loadingMsg) api.unsendMessage(loadingMsg.messageID);
			api.setMessageReaction("✅", messageID, () => {}, true);

		} catch (err) {
			console.error(err);
			api.setMessageReaction("❌", messageID, () => {}, true);
			message.reply("❌ Video load failed!");
		}
	}
};
