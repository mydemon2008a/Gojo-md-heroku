const axios = require('axios');
const fetch = require('node-fetch');
const config = require('../settings');
const { cmd } = require('../lib/command');
const { getBuffer, fetchApi, sleep } = require('../lib/functions');
const fg = require('api-dylux');
const { File } = require('megajs');
const mimeType = require('mime-types');

// Common variables
const url = "Give me movie url ?";
const valid_url = "This Url Type is Invalid";
const not_fo = 'I can\'t find anything';
const baseUrl = "https://darkyasiya-new-movie-api.vercel.app/";
const apilink = baseUrl;
const apikey = ""; // add your key here

// ===================== TV SHOW DETAILS =====================
cmd({
  pattern: "tv",
  react: "📺",
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q || !q.includes('cinesubz.co/tvshow')) return await reply(valid_url);
    const parts = q.split("🎈");
    const inp = parts[0];
    const jidx = parts[1] || from;

    const res = await fetchApi(`${apilink}/private/sit1/sc3?url=${inp}&apikey=${apikey}`);
    const mov = res.result.data;

    const caption = `
📺 *Tv Show Name:* ${mov.title}
✨ *First Air Date:* ${mov.first_air_date}
🎐 *Last Air Date:* ${mov.last_air_date}
🎀 *Categories:* ${mov.category}
⭐ *TMDB Rating:* ${mov.tmdbRate}
🔮 *TMDB Votes:* ${mov.tmdbVoteCount}
🎡 *Episode Count:* ${mov.episode_count}

🕺🏻 Follow us: https://whatsapp.com/channel/0029VagN2qW3gvWUBhsjcn3I
`;

    const image = (mov.mainImage || mov.image || "").replace("fit=", "fit");
    await conn.sendMessage(jidx, { image: { url: image }, caption: caption + config.CAPTION });

    if (jidx === from) {
      await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });
    } else {
      await conn.sendMessage(from, { text: '✔ TV Show details sent.', quoted: mek });
      await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });
    }

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    reply("❗ Error:\n" + e.toString());
  }
});

// ===================== EPISODE DETAILS =====================
cmd({
  pattern: "ciepdet",
  react: "📺",
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q || !q.includes('cinesubz.co/episode')) return await reply(valid_url);
    const parts = q.split("🎈");
    const inp = parts[0];
    const jidx = parts[1] || from;

    const res = await fetchApi(`${apilink}/private/sit1/sc4?url=${inp}&apikey=${apikey}`);
    const mov = res.result.data;

    const caption = `
📺 *Episode Name:* ${mov.episode_name}
🖇️ *TV Show Link:* ${inp}
🧿 *Release Date:* ${mov.date}
`;

    await conn.sendMessage(jidx, {
      image: { url: mov.images?.[0] || "" },
      caption: caption + config.CAPTION
    });

    if (jidx === from) {
      await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });
    } else {
      await conn.sendMessage(from, { text: '✔ Episode details sent.', quoted: mek });
      await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });
    }

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    reply("❗ Error:\n" + e.toString());
  }
});

// ===================== DIRECT DOWNLOAD =====================
cmd({
  pattern: "cinedirectdl",
  react: "⬆",
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("❗ Please provide a valid movie link.");
    const parts = q.split("🎈");

    const inp = parts[0];
    const filename = parts[1] || "Movie";
    const quality = parts[2] || "";
    const size = parts[3] || "";
    const jidx = parts[4] || from;

    const res = await fetchApi(`${apilink}/private/sit1/sc5?url=${inp}&apikey=${apikey}`);
    const caption = `${filename} (${quality})\n\n${config.CAPTION}`;

    // ========== GDRIVE ==========
    if (res.result.gdrive) {
      const gdriveLink = res.result.gdrive.replace("https://drive.usercontent.google.com/", "https://drive.google.com/");
      let fileData = await fg.GDriveDl(gdriveLink);
      const ext = fileData.mimetype === "video/mkv" ? "mkv" : "mp4";

      await conn.sendMessage(jidx, {
        document: { url: fileData.downloadUrl },
        fileName: `${filename}.${ext}`,
        mimetype: fileData.mimetype,
        caption: caption
      });
    }

    // ========== DIRECT ==========
    else if (res.result.direct) {
      const buffer = await getBuffer(res.result.direct);
      const { default: fileType } = await import('file-type');
      const type = await fileType.fromBuffer(buffer);
      const mime = type?.mime || "video/mp4";
      const ext = mimeType.extension(mime);

      await conn.sendMessage(jidx, {
        document: buffer,
        fileName: `${filename}.${ext}`,
        mimetype: mime,
        caption: caption
      });
    }

    // ========== MEGA ==========
    else if (res.result.mega) {
      const file = File.fromURL(res.result.mega);
      await file.loadAttributes();
      const data = await file.downloadBuffer();

      await conn.sendMessage(jidx, {
        document: data,
        fileName: `${filename}.mp4`,
        mimetype: "video/mp4",
        caption: caption
      });
    }

    else {
      return reply(not_fo);
    }

    await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });
    if (jidx !== from) {
      await conn.sendMessage(from, { text: '✔ Movie sent successfully.', quoted: mek });
    }

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    reply("❗ Error:\n" + e.toString());
  }
});
