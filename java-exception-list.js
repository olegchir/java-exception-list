const fs = require("fs");
const args = process.argv.slice(2);

const inputFile = args[0];
const outputFile = args[1];
const plainNames = (args[2] === 'true');

if (!fs.existsSync(inputFile)) {
    console.log("Input file does not exist");
    return;
}

const buffer = fs.readFileSync(inputFile);
const content = buffer.toString();

var result = content;

var result = result.replace(/^((?!\[class,load\]).)*$/gm, ""); // Leave only classloading messages
var result = result.replace(/.*\[class,load\] (.*) source: .*/gm, "$1"); // Extract names of classes
if (plainNames) {
    var result = result.replace(/(.*)\.([^.]*)$/gm, "$2"); // Extract plain class names 
    var result = result.replace(/(.*)\$([^$]*)$/gm, "$2"); // Extract name inside lambdas
}
var result = result.replace(/^((?!Exception).)*$/gm, ""); // Filter only exceptions
var result = result.split(/\r?\n/).sort().join("\n"); // Sort strings
var result = result.replace(/^(\s)*$\n/gm, ""); // Remove empty lines

fs.writeFileSync(outputFile, result);

console.log("Done.");