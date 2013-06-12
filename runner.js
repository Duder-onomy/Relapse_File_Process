function relapseProcess()
{

// check to see is there are any new emails to process
if (scanEmail() != true)
  {
    return;
  }

// everything is good to run
var ss = SpreadsheetApp.getActiveSpreadsheet();
var uploadSheet = ss.insertSheet("Upload");
var lookupSheet = ss.getSheetByName("Lookup");

//lock the spreadsheet
//get email address to watch for
//search inbox for anything from him without the tag "processed"
//if the email has attachement, download to relapse files folder
//import the file
//process it
//save as csv, append the file name with PCU Processed and the date
//notify me and the other people that the file is ready.
//unlock the spreadsheet

var locked = lockSpreadSheet();
if (locked == false)
  {
    return;
  }

// clear the upload sheet
uploadSheet.clearContents();
SpreadsheetApp.flush();

// go to FTP and get all files
// compare file names to allready processed list, if allready processed, delete

var uploadFolder = DocsList.getFolderById("0B8yxm0Ut_NZIeHF5MXZlTzByUlk");
var filesToProcess = uploadFolder.getFiles();

for (var i = 0; i < filesToProcess.length; i++)
  {
  //get the file name
  var fileName = filesToProcess[i].getName();
  //import the file
  var imported = importFromCSV(fileName);
  //Here it should check if this is a valid upload file
  if ((uploadSheet.getRange("A1").getValue() + ".csv") == fileName)
   {
     SpreadsheetApp.flush();
     //process it
     var processed = process();
     SpreadsheetApp.flush();
     //save as csv, append the file name with PCU Processed and the date
     var saved = saveAsCSV(fileName.replace('.csv',''));
     //EMAIL GREG TO NOTIFY TO UPLOAD FILE
     var attachment = Utilities.newBlob(filesToProcess[i].getBlob());
     attachment.setName(fileName);
     MailApp.sendEmail("Greg.larrenaga@postclubusa.com", "RELAPSE FILE UPLOAD: " + fileName, "Upload This File",
     {
       //attachments: attachment
     });
     //MailApp.sendEmail("MikeJ@relapse.com, john.kadlec@opticalexperts.com, James.dowd@postclubusa.com, lp@postclubusa.com, greg.larrenaga@postclubusa.com", "RELAPSE FILE PROCESSED: " + fileName, "This Email is Automated, but feel free to reply. I will see your reply. The file mentioned has been processed and is available in the PostClub System for label creation.",
     //{
       //attachments: attachment
     //});
     //
   }
  // move the original file to the completed folder
  //var copy = filesToProcess[i].makeCopy(fileName + "_Original");
  //copy.addToFolder(DocsList.getFolderById("0B8yxm0Ut_NZIVUw0MERvSXlFOHc"));
  filesToProcess[i].setTrashed(true);
  //notify me and the other people that the file is ready.
  //unlock the spreadsheet
  uploadSheet.clearContents();
  SpreadsheetApp.flush();
  uploadSheet.getRange(1, 1);
  }

uploadSheet.activate();
ss.deleteActiveSheet();

}

///////////////////////////////////////////////////////////////////////////////////////////////////

function process()
{

var ss = SpreadsheetApp.getActiveSpreadsheet();
var uploadSheet = ss.getSheetByName("Upload");
var lookupSheet = ss.getSheetByName("Lookup");

//Name
uploadSheet.insertColumnBefore(1);
uploadSheet.getRange("H:H").copyTo(uploadSheet.getRange("A:A"));
//Name 2
uploadSheet.insertColumnAfter(1);
uploadSheet.getRange("A:A").copyTo(uploadSheet.getRange("B:B"));
//Addy 1
uploadSheet.insertColumnAfter(2);
uploadSheet.getRange("K:K").copyTo(uploadSheet.getRange("C:C"));
//Addy 2
uploadSheet.insertColumnAfter(3);
uploadSheet.getRange("M:M").copyTo(uploadSheet.getRange("D:D"));
//Addy 3
uploadSheet.insertColumnAfter(4);
//town / city
uploadSheet.insertColumnAfter(5);
uploadSheet.getRange("Q:Q").copyTo(uploadSheet.getRange("F:F"));
//country
uploadSheet.insertColumnAfter(6);
uploadSheet.getRange("U:U").copyTo(uploadSheet.getRange("G:G"));
//Zip
uploadSheet.insertColumnAfter(7);
uploadSheet.getRange("U:U").copyTo(uploadSheet.getRange("H:H"));
//Telephone
uploadSheet.insertColumnAfter(8);
//Email Addy
uploadSheet.insertColumnAfter(9);
uploadSheet.getRange("O:O").copyTo(uploadSheet.getRange("J:J"));
//Weight
uploadSheet.insertColumnAfter(10);
//Number Of Parcels
uploadSheet.insertColumnAfter(11);
uploadSheet.getRange(1, 12, uploadSheet.getLastRow()).setValue("1");
//Description Of Goods
uploadSheet.insertColumnAfter(12);
uploadSheet.getRange(1, 13, uploadSheet.getLastRow()).setValue("Shirts, CD's, Vinyl Records, Music Merchandise");
//Value Of Goods
uploadSheet.insertColumnAfter(13);
uploadSheet.getRange(1, 14, uploadSheet.getLastRow()).setValue("20");
//Currency Of Value
uploadSheet.insertColumnAfter(14);
uploadSheet.getRange(1, 15, uploadSheet.getLastRow()).setValue("USD");
//Order Number
uploadSheet.insertColumnAfter(15);
uploadSheet.getRange("S:S").copyTo(uploadSheet.getRange("P:P"));
//Department Code
uploadSheet.insertColumnAfter(16);
//Shippers Name
uploadSheet.insertColumnAfter(17);
uploadSheet.getRange(1, 18, uploadSheet.getLastRow()).setValue("Relapse Records");
//Notes
uploadSheet.insertColumnAfter(18);
//Service
uploadSheet.insertColumnAfter(19);
uploadSheet.getRange(1, 20, uploadSheet.getLastRow()).setValue("TL");


//Delete all non needed rows
var lastRow = uploadSheet.getLastRow();
var lookup = uploadSheet.getRange("V1");
for (var i=0;i<lastRow;i++)
  {
    if (lookup.getValue() == lookup.offset(1, 0).getValue())
      {
        uploadSheet.deleteRows(lookup.getRowIndex());
      }
    else
      {
        lookup = lookup.offset(1,0);
      }
  }

// delete the non-needed columns
uploadSheet.deleteColumns(21, 18);

return true;

}

