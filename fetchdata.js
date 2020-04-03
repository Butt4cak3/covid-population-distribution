const fs = require("fs");
const fetch = require("node-fetch");

async function main() {
  const response = await fetch(
    "https://covid2019-api.herokuapp.com/v2/current"
  );
  const data = await response.text();

  fs.writeFile("dist/data.json", data, err => {
    if (err) {
      console.error(err);
    }
  });
}

main();
