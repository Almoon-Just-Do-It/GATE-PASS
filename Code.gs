const SPREADSHEET_NAME = "NSU IT Equipment Gate Pass Records";
const SHEET_NAME = "Gate Pass Records";
const OWNER_EMAIL = "iamabdullahalmoon@gmail.com";

/**
 * Run setup() once from the Apps Script editor while signed in to the
 * Google account that should own the records. It creates the spreadsheet.
 */
function setup() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty("SPREADSHEET_ID");
  let ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create(SPREADSHEET_NAME);
    props.setProperty("SPREADSHEET_ID", ss.getId());
  }
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Pass No", "Created At", "Product Type", "Product ID", "Serial Number",
      "Vendor Company", "Vendor Representative / Carrier", "Destination",
      "Purpose / Remarks", "IT Representative", "Submitted At"
    ]);
    sheet.getRange(1,1,1,11).setFontWeight("bold").setBackground("#061742").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1,11);
  }
  // If you run setup under a different Google account, this shares the sheet
  // with the requested email address. If already the owner, no sharing is needed.
  try { DriveApp.getFileById(ss.getId()).addEditor(OWNER_EMAIL); } catch (err) {}
  Logger.log("Spreadsheet URL: " + ss.getUrl());
  return ss.getUrl();
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
    if (!id) throw new Error("Run setup() first.");
    const ss = SpreadsheetApp.openById(id);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const required = ["passNo","productType","productId","serialNumber","vendorCompany","vendorPerson","destination"];
    required.forEach(key => { if (!data[key]) throw new Error("Missing required field: " + key); });
    sheet.appendRow([
      safe_(data.passNo), data.createdAt || new Date().toISOString(),
      safe_(data.productType), safe_(data.productId), safe_(data.serialNumber),
      safe_(data.vendorCompany), safe_(data.vendorPerson), safe_(data.destination),
      safe_(data.purpose || ""), safe_(data.itRepresentative || ""), new Date()
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true,passNo:data.passNo}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Prevent values beginning with =, +, - or @ from being interpreted as formulas.
function safe_(value) {
  const text = String(value == null ? "" : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
