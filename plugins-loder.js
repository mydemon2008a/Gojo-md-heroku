const fs = require('fs');
const path = require('path');

function loadPlugins() {
  const pluginDir = path.join(__dirname, 'plugins');

  if (!fs.existsSync(pluginDir)) {
    console.warn('⚠️ plugins folder එක හමු නොවුණා!');
    return;
  }

  const pluginFiles = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'));

  if (pluginFiles.length === 0) {
    console.warn('⚠️ plugins folder එකේ plugin කිසිවක් නෑ!');
    return;
  }

  pluginFiles.forEach(file => {
    const fullPath = path.join(pluginDir, file);
    try {
      const plugin = require(fullPath);
      console.log(`✅ Plugin loaded: ${file}`);
      // plugin එක export කරන function ඇත්නම්, ඔයාට ඒ function call කරන්න පුළුවන් මෙතන
    } catch (err) {
      console.error(`❌ Plugin load error (${file}):`, err.message);
    }
  });
}

module.exports = { loadPlugins };
