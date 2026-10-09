function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var ids = data.ids;

    if (ids && ids.length > 0) {
      var rows = ids.map(function (id) {
        return [id];
      });
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 1).setValues(rows);
    }

    return ContentService.createTextOutput("Success").setMimeType(
      ContentService.MimeType.TEXT,
    );
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.message).setMimeType(
      ContentService.MimeType.TEXT,
    );
  }
}
