var fs = require('fs'); // For filestream node
var path = require('path'); // For path node
var dsv = require('d3-dsv'); // For d3-dsv csv conversion node

//path.join to make folders correct

// Make a directory to put our corrected Files
//fs.mkdir('\Corrected_Files');
//path.join()

// Let's get our csv file
var readInCsvFile = fs.readFileSync("fileNameErrors.csv", 'utf8');
var newUrlTemplate = fs.readFileSync("newUrl.txt", 'utf8');

console.log(newUrlTemplate);

var fileData = dsv.csvParse(readInCsvFile);

var arrayOfJsonStrings = [];
var fileNameArray = [];

// FROM PRACTICE EXERCISES
var nameArray = fileData.map(function (currentValue, index) {
  return currentValue.fileName;
});

//console.log(nameArray);

var filteredNameArray = nameArray.filter(function (currentAffliction, index) {
  return index === nameArray.lastIndexOf(currentAffliction);
});

//console.log(filteredNameArray);

// Step 1: Convert filtered Array to an object
var afflictedFiles = filteredNameArray.map(function (currentValue, currentIndex) {
  return {
    fileName: currentValue,
    afflictions: []
  }
})

// Step 2: Compare this newly Objectified array to the properties of the arrayOfObjects
afflictedFiles.forEach(function (currentValue, currentIndex) {
  for (var i = 0; i < fileData.length; i++) {
    if (currentValue.fileName === fileData[i].fileName) {
      currentValue.afflictions.push(fileData[i]);
    }
  }
});

//console.log(afflictedFiles);

// --------------------------------------------------------

// LOOP through each entry, and then fix all the fixes
for (var i = 0; i < afflictedFiles.length; i++) {
  // Open the file and find afflictions
  console.log('About to open ' + afflictedFiles[i].fileName);
  var readInFile = fs.readFileSync(afflictedFiles[i].fileName, 'utf8');

  // Convert file to JSON format so that we can search it
  var parsedReadInFile = readInFile.replace('var diggingDeeperVideos =', '')
    .replace(/title:/g, '"title":')
    .replace(/speaker:/g, '"speaker":')
    .replace(/imageURL:/g, '"imageURL":')
    .replace(/frameURL:/g, '"frameURL":')
    .replace(/\];/, ']')
    .replace(/\},\s+\]/, '}\n]')
    .trim();

  var fileToCorrect = JSON.parse(parsedReadInFile);

  //console.log(fileToCorrect);
  //console.log(afflictedFiles[i]);

  // Start with afflictions and then search the fileToCorrect
  afflictedFiles[i].afflictions.forEach(function (currentAffliction) {
    fileToCorrect.forEach(function (currentVideo) {
      //console.log(fileToCorrect[j]);

      //console.log(currentAffliction);

      if (currentAffliction.frameURL === currentVideo.frameURL) {
        console.log('affliction found');
        var entry_id = currentAffliction.ENTRY_ID;
        var play_from = currentAffliction.PLAY_FROM;
        var play_to = currentAffliction.PLAY_TO;

        // Now, we will place these new values into our newUrlTemplate
        var newUrlEntry_id = newUrlTemplate.replace('{ENTRY_ID}', entry_id);
        var newUrlplay_from = newUrlEntry_id.replace('{PLAY_FROM}', play_from);
        var newUrlFinal = newUrlplay_from.replace('{PLAY_TO}', play_to);

        //console.log(newUrlFinal);

        // Place the fixed url back into the file
        currentVideo.frameURL = newUrlFinal;

        //console.log(fileToCorrect[j]);
      }
    });
  });

  /*fileToCorrect.forEach(function (currentAffliction, currentIndex) {
    // FIND THE AFFLICTION
    for (var j = 0; j < afflictedFiles[i].afflictions.length; j++) {
      if (currentAffliction.frameURL === afflictedFiles[i].afflictions[j].frameURL) {
        // We have found an affliction.  Time to fix!
        // FIX AFFLICTION
        // Generate a new URL
        var entry_id = afflictedFiles[i].afflictions[j].ENTRY_ID;
        var play_from = afflictedFiles[i].afflictions[j].PLAY_FROM;
        var play_to = afflictedFiles[i].afflictions[j].PLAY_TO;

        // Now, we will place these new values into our newUrlTemplate
        var newUrlEntry_id = newUrlTemplate.replace('{ENTRY_ID}', entry_id);
        var newUrlplay_from = newUrlEntry_id.replace('{PLAY_FROM}', play_from);
        var newUrlFinal = newUrlplay_from.replace('{PLAY_TO}', play_to);
        
        // Place the fixed url back into the file
        currentAffliction.frameURL = newUrlFinal;
        
        j = afflictedFiles[i].afflictions.length;
      }
    }
  });*/

  // Write the file back to the fileName
  correctedFileString = 'var diggingDeeperVideos = ' + JSON.stringify(fileToCorrect, null, '\t') + ';';


  fs.writeFileSync(path.join('.', 'Corrected_Files', afflictedFiles[i].fileName), correctedFileString);
}

//fs.mkdirSync('.\Corrections');

//console.log(fileToCorrect.length);


/*for (var generateNum = 0; generateNum < arrayOfJsonStrings.length; generateNum++) {
  fs.writeFileSync("correctedFile" + generateNum + ".js", arrayOfJsonStrings[generateNum]);

  //fs.writeFileSync(fileNameArray[generateNum], arrayOfJsonStrings[generateNum]);
}*/
