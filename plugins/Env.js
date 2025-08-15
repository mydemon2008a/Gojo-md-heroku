const { cmd } = require('../lib/command');
const config = require('../settings');
const os = require('os');

// BOT FAKE RECORDING  SETTINGS
cmd({
    pattern: "record",
    desc: "fake record bot on off",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only  owner can use this!*");
    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.FAKE_RECORDING = "true";
        return reply("✅ fake recording on");
    } else if (status === "off") {
        config.FAKE_RECORDING = "false";
        return reply("❌ fake recording off");
    } else {
        return reply("Example: .record on");
    }
});
