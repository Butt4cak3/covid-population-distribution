const fs = require("fs");
const fetch = require("node-fetch");

async function main() {
  const distDir = __dirname + "/dist";
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  const response = await fetch(
    "https://covid2019-api.herokuapp.com/v2/current"
  );
  const data = await response.text();

  fs.writeFile(distDir + "/data.json", data, err => {
    if (err) {
      console.error(err);
    }
  });
}

main();
