// RELAXIA — Google Apps Script Webhook
// Steps:
// 1. Create a new Google Sheet
// 2. Extensions → Apps Script
// 3. Paste this entire code
// 4. Deploy → New deployment → Web app
// 5. Execute as: Me  |  Who has access: Anyone
// 6. Copy the Web App URL
// 7. Paste it in frontend/.env.local as: NEXT_PUBLIC_SHEETS_WEBHOOK_URL=...

const SHEET_NAME = "Orders";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    appendOrderToSheet(data);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function appendOrderToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    var headers = [
      "Order ID", "Date", "Name", "Phone", "City",
      "Product", "Quantity", "Total (MAD)", "Status",
      "Source", "Medium", "Campaign", "Notes"
    ];
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0B4D2E");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(4, 120);
    sheet.setColumnWidth(6, 180);
  }

  sheet.appendRow([
    data.orderId || "",
    data.date || formatDate(new Date()),
    data.name || "",
    data.phone || "",
    data.city || "",
    data.product || "",
    data.quantity || "",
    data.totalPrice || 0,
    data.status || "جديد",
    data.source || "",
    data.medium || "",
    data.campaign || "",
    ""
  ]);
}

function formatDate(date) {
  var d = ("0" + date.getDate()).slice(-2);
  var m = ("0" + (date.getMonth() + 1)).slice(-2);
  var y = date.getFullYear();
  var h = ("0" + date.getHours()).slice(-2);
  var min = ("0" + date.getMinutes()).slice(-2);
  return d + "/" + m + "/" + y + " " + h + ":" + min;
}

// Run this once manually to test
function testWebhook() {
  appendOrderToSheet({
    orderId: "RLX-TEST-001",
    date: formatDate(new Date()),
    name: "محمد الأمين",
    phone: "0612345678",
    city: "الدار البيضاء",
    product: "كولوفلورا",
    quantity: 2,
    totalPrice: 345,
    status: "جديد",
    source: "facebook",
    medium: "cpc",
    campaign: "test"
  });
  Logger.log("Test order added");
}
