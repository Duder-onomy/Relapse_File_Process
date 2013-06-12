function lockSpreadSheet()
{

  var lock = LockService.getPublicLock();
  var locked = lock.tryLock(60000);
  return locked;
}

function un_lockSpreadSheet()
{
  var lock = LockService.getPublicLock();
  lock.release();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////// got this from: https://developers.google.com/apps-script/articles/docslist_tutorial#section2
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveAsCSV(fileName) {
  // Prompts the user for the file name
  // var fileName = Browser.inputBox("Save CSV file as (e.g. myCSVFile):");

  // Check that the file name entered wasn't empty
  if (fileName.length !== 0) {
    // Add the ".csv" extension to the file name
    // fileName = fileName + ".csv";
    // Convert the range data to CSV format
    var csvFile = convertRangeToCsvFile_(fileName);
    // Create a file in the Docs List with the given name and the CSV data
    var today = Utilities.formatDate(new Date(), "EST", "yyyy.MM.dd 'at' HH:mm:ss z");
    DocsList.getFolderById("0B8yxm0Ut_NZIVUw0MERvSXlFOHc").createFile(fileName + "_PCU_PROCESSED_" + today + ".csv", csvFile);
  }
  else {
    // Browser.msgBox("Error: Please enter a CSV file name.");
  }
}

function convertRangeToCsvFile_(csvFileName) {
  // Get the selected range in the spreadsheet
  var ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Upload").getDataRange();
  try {
    var data = ws.getValues();
    var csvFile = undefined;

    // Loop through the data in the range and build a string with the CSV data
    if (data.length > 0) {
      var csv = "";
      for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row].length; col++) {
          if (data[row][col].toString().indexOf(",") != -1) {
            data[row][col] = "\"" + data[row][col] + "\"";
          }
        }

        // Join each row's columns
        // Add a carriage return to end of each row, except for the last one
        if (row < data.length-1) {
          csv += data[row].join(",") + "\r\n";
        }
        else {
          csv += data[row];
        }
      }
      csvFile = csv;
    }
    return csvFile;
  }
  catch(err) {
    Logger.log(err);
    Browser.msgBox(err);
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////// got this from: https://developers.google.com/apps-script/articles/docslist_tutorial#section2
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function importFromCSV(fileName) {
 // var fileName = Browser.inputBox("Enter the name of the file in your Docs List to import (e.g. myFile.csv):");

 var files = DocsList.getFiles();
  var csvFile = "";

  for (var i = 0; i < files.length; i++) {
    if (files[i].getName() == fileName) {
      csvFile = files[i].getContentAsString();
      break;
    }
  }
  var csvData = CSVToArray(csvFile, ",");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Upload");
  for (var i = 0; i < csvData.length; i++) {
    sheet.getRange(i+1, 1, 1, csvData[i].length).setValues(new Array(csvData[i]));
  }
}

// http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.

function CSVToArray( strData, strDelimiter ){
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );


  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;


  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter != strDelimiter)
    ){

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push( [] );

    }


    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ]){

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
      );

    } else {

      // We found a non-quoted value.
      var strMatchedValue = arrMatches[ 3 ];

    }


    // Now that we have our value string, let's add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  return( arrData );
}
