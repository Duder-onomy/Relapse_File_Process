function scanEmail() {

  var label = GmailApp.getUserLabelByName("Relapse File");
  var threads = label.getThreads();
  var returned = false;
  var uploadFolder = DocsList.getFolderById("0B8yxm0Ut_NZIeHF5MXZlTzByUlk");
  var originalFileFolder = DocsList.getFolderById("0B8yxm0Ut_NZIQ1N4YlFCMDA3Q2M");

  for (var i = 0; i < threads.length; i++)
    {
       var threadID = threads[i].getId();
       var messages = threads[i].getMessages();
       for (var j = 0; j < messages.length; j++)
         {
           var attachments = messages[j].getAttachments();
           for (var k = 0; k < attachments.length; k++)
             {
               uploadFolder.createFile(attachments[k].getName(), attachments[k].getDataAsString());
               originalFileFolder.createFile(attachments[k].getName(), attachments[k].getDataAsString());
               var returned = true;
             }


         }




       threads[i].moveToTrash();
    }
  return returned;


}
