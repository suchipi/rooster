const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

function readStreamToString(stream) {
  const chunks = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });

    stream.on("error", (err) => {
      reject(err);
    });

    stream.on("end", () => {
      const content = Buffer.concat(chunks).toString("utf8");
      resolve(content);
    });
  });
}

function objToOptions(obj) {
  return Object.entries(obj)
    .map(([key, value]) => {
      return `<option value=${JSON.stringify(value)}>${key}</option>`;
    })
    .join("\n");
}

function renderTemplate(filepath, data) {
  const normalizedPath = path.isAbsolute(filepath)
    ? filepath
    : path.resolve(__dirname, filepath);

  let content = fs.readFileSync(normalizedPath, "utf-8");

  for (const [key, value] of Object.entries(data)) {
    const regexp = new RegExp("%%" + key + "%%", "g");
    content = content.replace(regexp, value);
  }

  return content;
}

function runCmd(cmd) {
  return child_process.execSync(cmd, "utf-8");
}

module.exports = {
  readStreamToString,
  objToOptions,
  renderTemplate,
  runCmd,
};
