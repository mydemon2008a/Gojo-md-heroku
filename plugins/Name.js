const { cmd } = require('../lib/command');
const config = require('../settings');
const fs = require('fs');

cmd({
  pattern: "name",
  desc: "Change bot name",
  category: "settings",
  filename: __filename,
  use: ".name <new name>"
}, async (m, conn, match, { args, isCreator, reply }) => {
  if (!isCreator) return reply("*📛 Only the owner can use this command!*");

  const newName = args.join(" ").trim();

  if (!newName) return reply("📝 උදා: .name GOJO MD");

  try {
    // Update name in memory
    config.NAME = newName;

    // If config.env exists, update it
    if (fs.existsSync('./config.env')) {
      let env = fs.readFileSync('./config.env', 'utf8');

      // Replace NAME=... or append if not exists
      if (env.includes('NAME=')) {
        env = env.replace(/NAME=.*/g, `NAME="${newName}"`);
      } else {
        env += `\nNAME="${newName}"`;
      }

      fs.writeFileSync('./config.env', env);
    }

    reply(`✅ Bot name updated to: *${newName}*`);

  } catch (e) {
    console.error("name plugin error:", e);
    reply("❌ Failed to update name.");
  }
});
