const fs = require("fs-extra");
const concat = require("concat");
const replace = require("replace-in-file");
const path = require("path");
const variables = require("./variables.js");

const newFile = __dirname + "/style.css";
function findFiles() {
  let results = [];
  let files = fs.readdirSync(__dirname);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(__dirname, files[i]);
    var stat = fs.lstatSync(filename);
    if (
      filename.indexOf(".css") >= 0 &&
      filename !== __dirname + "/style.css"
    ) {
      console.log("-- found: ", filename);
      results.push(filename);
    }
  }
  return results;
}

let files = findFiles();

concat(files, newFile).then(
  replace({
    files: newFile,
    from: Object.keys(variables),
    to: Object.values(variables)
  })
    .then(changes => {
      console.log("Modified files:", changes.join(", "));
    })
    .catch(error => {
      console.error("Error occurred:", error);
    })
);
