function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Process Relapse",
    functionName : "relapseProcess"
  }];
  sheet.addMenu("PostClub", entries);
};
