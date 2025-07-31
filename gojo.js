const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip');

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

    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);
    console.log('✅ ZIP එක extract කරා.');

    fs.unlinkSync(zipPath);
    console.log('🗑️ ZIP file එක delete කරා.');

    const pluginDir = path.join(__dirname, 'plugins');
    if (fs.existsSync(pluginDir)) {
      const plugins = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));

      if (plugins.length === 0) {
        console.warn('⚠️ plugins folder එකේ plugin කිසිවක් නෑ!');
      }

      for (const file of plugins) {
        try {
          const code = fs.readFileSync(path.join(pluginDir, file), 'utf8');
          eval(code); // <-- This still works in obfuscated files
          console.log(`✅ Plugin loaded: ${file}`);
        } catch (e) {
          console.error(`❌ Plugin load error (${file}):`, e);
        }
      }
    } else {
      console.warn('⚠️ plugins folder එක හමු නොවුණා!');
    }

    console.log('🚀 Bot system ready.');

  } catch (err) {
    console.error('❌ Error during setup:', err);
  }
}

const zipUrl = 'https://files.catbox.moe/jbz1vo.zip';
downloadAndExtractZip(zipUrl);
