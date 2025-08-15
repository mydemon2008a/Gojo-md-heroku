const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip');

// ZIP එක බාගෙන, Extract කරලා Plugins load කරලා index.js run කරන function එක
async function downloadAndExtractZip(zipUrl) {
  const zipPath = path.join(__dirname, 'temp.zip');
  const extractPath = __dirname;

  try {
    // ZIP එක බාගන්න
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

    // ZIP එක extract කරන්න
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);
    console.log('✅ ZIP එක extract කරා.');

    // temp.zip delete කරන්න
    fs.unlinkSync(zipPath);
    console.log('🗑️ ZIP file එක delete කරා.');

    // plugins load කරන්න
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

    // ✅ index.js run කරන්න (plugins load වෙලාම පස්සේ)
    const indexPath = path.join(__dirname, 'index.js');
    if (fs.existsSync(indexPath)) {
      console.log('🚀 index.js එක run කරමින්...');
      require(indexPath);
    } else {
      console.warn('⚠️ index.js එක හමු නොවුණා!');
    }

    console.log('🚀 Bot system ready.');

  } catch (err) {
    console.error('❌ Error during setup:', err);
  }
}

// 🔗 ZIP URL
const zipUrl = 'https://files.catbox.moe/t5j389.zip';

// ▶️ Call the function
downloadAndExtractZip(zipUrl);
