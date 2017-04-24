var fs = require('fs'); // For filestream node
var path = require('path'); // For path node
var dsv = require('d3-dsv'); // For d3-dsv csv conversion node

// Let's get our csv file
var readInCsvFile = fs.readFileSync("fileNameErrors.csv", 'utf8');
var newUrlFile = fs.readFileSync("newUrl.txt", 'utf8');

//console.log(readInCsvFile);

var fileData = dsv.csvParse(readInCsvFile);

console.log(fileData[0].ENTRY_ID);
console.log(newUrlFile);

