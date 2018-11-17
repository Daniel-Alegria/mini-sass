#! /usr/bin/env node
const variables = require("./variables");
const concat = require("concat");
const path = require("path");
const fs = require("fs");
const replace = require("replace-in-file");

// for (var key in variables) {
//   console.log(key);
// }

function gatherCSS(startPath, filter) {
  var results = [];

  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      results = results.concat(gatherCSS(filename, filter)); //recurse
    } else if (filename.indexOf(filter) >= 0) {
      console.log("-- found: ", filename);
      results.push(filename);
    }
  }
  return results;
}

function addVariables(file) {
  var options = {
    files: file,
    from: [],
    to: []
  };

  for (var i = 0; i < Object.keys(variables).length; i++) {
    options.from.push(`(` + "\\" + `${Object.keys(variables)[i]})/g`);
  }

  for (var i = 0; i < Object.values(variables).length; i++) {
    options.to.push(Object.values(variables)[i]);
  }

  console.log(options);

  replace(options, (error, changes) => {
    if (error) {
      return console.error("Error occurred:", error);
    }
    console.log("Modified files:", changes.join(", "));
  });
}

function concatCSS(files) {
  concat(files, "./style.css");
  addVariables("./style.css");
}

concatCSS(gatherCSS("./", ".css"));

// for (var i = 0; i < variables.length; console.log(variables[i]));
