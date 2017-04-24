var fs = require('fs'); // For filestream node
var path = require('path'); // For path node
var dsv = require('d3-dsv'); // For d3-dsv csv conversion node

//path.join to make folders correct

// Let's get our csv file
var readInCsvFile = fs.readFileSync("fileNameErrors.csv", 'utf8');
var newUrlTemplate = fs.readFileSync("newUrl.txt", 'utf8');

//console.log(readInCsvFile);

var fileData = dsv.csvParse(readInCsvFile);

var arrayOfJsonStrings = [];
var fileNameArray = [];

// We will loop through each entry and replace the appropriate url
for (var i = 0; i < fileData.length; i++) {
  var fileName = fileData[i].fileName;
  fileNameArray.push(fileName);

  /*if (!fileNameArray.includes(fileName)) {

  }*/
  // Now, we will access the file at the given fileName and then replace the url there with our newUrlFinal
  var readInFile = fs.readFileSync(fileName, 'utf8');
  var parsedReadInFile = readInFile.replace('var diggingDeeperVideos =', '')
    .replace(/title:/g, '"title":')
    .replace(/speaker:/g, '"speaker":')
    .replace(/imageURL:/g, '"imageURL":')
    .replace(/frameURL:/g, '"frameURL":')
    .replace(/\];/, ']')
    .replace(/\},\s+\]/, '}\n]')
    .trim();

  var jsonFile = JSON.parse(parsedReadInFile);

  var identifiedJ;
  for (var j = 0; j < jsonFile.length; j++) {
    if (jsonFile[j].frameURL === fileData[i].frameURL) {
      // Generate a new URL
      identifiedJ = j;

      var entry_id = fileData[i].ENTRY_ID;
      var play_from = fileData[i].PLAY_FROM;
      var play_to = fileData[i].PLAY_TO;

      // Now, we will place these new values into our newUrlTemplate
      var newUrlEntry_id = newUrlTemplate.replace('{ENTRY_ID}', entry_id);
      var newUrlplay_from = newUrlEntry_id.replace('{PLAY_FROM}', play_from);
      var newUrlFinal = newUrlplay_from.replace('{PLAY_TO}', play_to);

      jsonFile[j].frameURL = newUrlFinal;
    }
  }

  var jsonString = JSON.stringify(jsonFile[identifiedJ], null, '\t');

  arrayOfJsonStrings.push(jsonString);
}

/*for (var x = 0; x < arrayOfJson.length; x++) {
  for (var m = 0; m < arrayOfJson[x].length; m++) {
    console.log(arrayOfJson[x][m]);
  }
}*/

// Now, output the completed JSON file in .js files

//console.log(arrayOfJsonStrings[0]);

console.log("FileNameArrayLength: " + fileNameArray.length);
for (var iter1 = 0; iter1 < fileNameArray.length; iter1++) {
  console.log(fileNameArray[iter1]);
}
console.log("ArrayOfJSONLength: " + arrayOfJsonStrings.length);
console.log(arrayOfJsonStrings[0]);
console.log(arrayOfJsonStrings[1]);

//fs.mkdirSync('.\Corrections');


for (var generateNum = 0; generateNum < arrayOfJsonStrings.length; generateNum++) {
  fs.writeFileSync("correctedFile" + generateNum + ".js", arrayOfJsonStrings[generateNum]);

  //fs.writeFileSync(fileNameArray[generateNum], arrayOfJsonStrings[generateNum]);
}
