const API_BASE = "https://api.digibulkmarketing.com/license/";
const DEVICE_ID =SpreadsheetApp.getActiveSpreadsheet().getId();
const PRODUCT_ID="62a4272db8d72bd6609afd7c";
const getSheets = () => SpreadsheetApp.getActive().getSheets();

const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

export const getSheetsData = () => {
  const activeSheetName = getActiveSheetName();
  return getSheets().map((sheet, index) => {
    const name = sheet.getName();
    return {
      name,
      index,
      isActive: name === activeSheetName,
    };
  });
};

export const addSheet = (sheetTitle) => {
  SpreadsheetApp.getActive().insertSheet(sheetTitle);
  return getSheetsData();
};

export const deleteSheet = (sheetIndex) => {
  const sheets = getSheets();
  SpreadsheetApp.getActive().deleteSheet(sheets[sheetIndex]);
  return getSheetsData();
};

export const setActiveSheet = (sheetName) => {
  SpreadsheetApp.getActive().getSheetByName(sheetName).activate();
  return getSheetsData();
};
export const readData = (apiData) => {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var data = sheet.getDataRange().getValues();

  var headers = data[0]; // Assuming the first row contains column headers
  var getSheetData = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var object = {};

    for (var j = 0; j < headers.length; j++) {
      object[headers[j]] = row[j];
    }

    getSheetData.push(object);
  }
  if (apiData.STATUS == "SUCCESS") {
    // console.log("result.RESPONSE", result.RESPONSE)
    const dataWithDate = apiData.RESPONSE
    var newData = [];
    console.log("dataWithDate", dataWithDate)
    console.log("getSheetData===", getSheetData)

    for (var i = 0; i < dataWithDate.length; i++) {
      var findUniqueId2 = dataWithDate[i].UNIQUE_QUERY_ID;
      var isLoading = false;

      for (var j = 0; j < getSheetData.length; j++) {
        var findUniqueId1 = getSheetData[j].UNIQUE_QUERY_ID;

        // Check if the UNIQUE_QUERY_ID from dataWithDate exists in getSheetData
        if (findUniqueId2 == findUniqueId1) {
          isLoading = true;
          break; // No need to continue checking data11
        }
      }

      // If it doesn't exist in data11, add it to newData
      if (!isLoading) {
        newData.push(dataWithDate[i]);
      }
    }

    console.log("newData---", newData)
    newData.map((item, i) => {
      sheet.appendRow([item.UNIQUE_QUERY_ID, 
        item.QUERY_TYPE, item.QUERY_TIME, item.SENDER_NAME, item.SENDER_MOBILE,
         item.SENDER_EMAIL, item.SUBJECT, item.SENDER_COMPANY, item.SENDER_ADDRESS,
          item.SENDER_CITY, item.SENDER_STATE, item.SENDER_PINCODE, item.SENDER_COUNTRY_ISO,
           item.SENDER_MOBILE_ALT, item.SENDER_PHONE, item.SENDER_PHONE_ALT, item.SENDER_EMAIL_ALT, 
           item.QUERY_PRODUCT_NAME, item.QUERY_MESSAGE, item.QUERY_MCAT_NAME, item.CALL_DURATION,
            item.RECEIVER_MOBILE]);
      // console.log("Responce Data", item.SENDER_NAME);
    })
  } else {
    console.log("message", result)
    var recipient = "srksonwarsha@gmail.com";
    var subject = "Hello function Email";
    var body = '<h1>This is a test email sent from Google Apps Script.</h1>';

    MailApp.sendEmail({ to: recipient, subject: subject, htmlBody: body });
  }
  // const data = [{name:"shashi",phone:"5445554545"}]

  return apiData;
  // SpreadsheetApp.getActive().deleteSheet(sheets[sheetIndex]);
  // return getSheetsData();
}

export const userActive = async (userData)=>{

  return new Promise()
var Response 

  var requestOptions = {
    key: userData.key,
    device_id: DEVICE_ID,
    product_id: PRODUCT_ID,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    city: userData.city,
    count: userData.country,
  };

  fetch(API_BASE + "active", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestOptions),
  })
    .then((response) => response.json())
    .then((res) => {
     Response=res
    })
    .catch((err) => {
      console.log("license_active error:", err);
    });
  return Response;
}
