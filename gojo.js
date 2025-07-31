const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip');

// ZIP එක බාගෙන, Extract කරලා Plugins load කරන function එක
async function downloadAndExtractZip(zipUrl) {
  const zipPath = path.join(__dirname, 'temp.zip');
  const extractPath = __dirname;

  try {
    const response = await axios({
      method: 'GET',
      url: zipUrl,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(zipPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log('✅ ZIP එක බාගත්තා.');

    // Extract ZIP
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);
    console.log('✅ ZIP එක extract කරා.');

    // Delete temp.zip
    fs.unlinkSync(zipPath);
    console.log('🗑️ ZIP file එක delete කරා.');

    // Load plugins
    const pluginDir = path.join(__dirname, 'plugins');
    if (fs.existsSync(pluginDir)) {
      const plugins = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));

      if (plugins.length === 0) {
        console.warn('⚠️ plugins folder එකේ plugin කිසිවක් නෑ!');
      }

      for (const file of plugins) {
        try {
          require(path.join(pluginDir, file));
          console.log(`✅ Plugin loaded: ${file}`);
        } catch (e) {
          console.error(`❌ Plugin load error (${file}):`, e);
        }
      }
    } else {
      console.warn('⚠️ plugins folder එක හමු නොවුණා!');
    }

    console.log('🚀 Bot system ready.');

    // 💡 Main bot file එක run කරන්න
    console.log('🟢 Starting main bot...');
    require('./index.js'); // <-- මෙතන ඔබේ main bot file එක දාන්න (e.g., gojo.js or index.js)

  } catch (err) {
    console.error('❌ Error during setup:', err);
  }
}

// 🔗 ZIP URL
const zipUrl = 'https://files.catbox.moe/jbz1vo.zip';

// ▶️ Call the function
downloadAndExtractZip(zipUrl);
