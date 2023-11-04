/* eslint-disable */
const moment = require('moment');
const PRODUCT_ID = '653a3bc74b20d28f5f6ab66b';
let DEVICE_ID = '';

const HEADERS = [
  'UNIQUE_QUERY_ID',
  'QUERY_TYPE',
  'QUERY_TIME',
  'SENDER_NAME',
  'SENDER_MOBILE',
  'SENDER_EMAIL',
  'SUBJECT',
  'SENDER_COMPANY',
  'SENDER_ADDRESS',
  "SENDER_CITY",
  "SENDER_STATE",
  "SENDER_PINCODE",
  "SENDER_COUNTRY_ISO",
  "SENDER_MOBILE_ALT",
  "SENDER_PHONE",
  "SENDER_PHONE_ALT",
  "SENDER_EMAIL_ALT",
  "QUERY_PRODUCT_NAME",
  "QUERY_MESSAGE",
  "QUERY_MCAT_NAME",
  "CALL_DURATION",
  'RECEIVER_MOBILE'
];

var DATA = {
  name: 'Indiamart To Google Sheet',
  short_name: 'indiamart-to-google-sheet',
  author: '',
  git_repo: 'indiamart-to-google-sheet',
  reseller_id: '',
  show_ads: true,
  active_shop: true,
  buy_url: '',
  phone: '',
  email: '',
  website: '',
  theme: 'dark',
  theme_setting: {
    'primary-color': '#2E3192',
  },
  instance_limit: 10,
  lang: 'en',
  country: 'IN',
  country_code: 91,
  logo: 'logo.png',
  logo_long: 'logo.png',
  app_logo: 'icon.png',
  renew: true,
};
var BUILD_VERSION = 1;
const TEST = true;
const API_BASE = 'https://api.digibulkmarketing.com/license/';

const COLUMNS = [
  {
    value: 'name',
    label: 'Name',
  },
  {
    value: 'address',
    label: 'Address',
  },
  {
    value: 'phone',
    label: 'Phone Number',
  },
  {
    value: 'website',
    label: 'Website Url',
  },
  {
    value: 'business',
    label: 'Business',
  },
  {
    value: 'rating',
    label: 'Rating',
  },

  {
    value: 'review',
    label: 'Review',
  },
  {
    value: 'latitude',
    label: 'Latitude',
  },
  {
    value: 'longitude',
    label: 'Longitude',
  },
];

const getSheets = () => SpreadsheetApp.getActive().getSheets();

const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

export const getIDs = () => {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var spreadSheetID = ss.getId();
  var sheetID = sheet.getSheetId();
  Logger.log(spreadSheetID);
  Logger.log(sheetID);
};

const getApiData = (path, data) => {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var spreadSheetID = ss.getId();

  Logger.log('deviceId: ' + spreadSheetID);

  return new Promise((resolve, reject) => {
    try {
      const url = API_BASE + path;

      const options = {
        muteHttpExceptions: true,
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify({
          ...data,
          device_id: spreadSheetID,
          product_id: PRODUCT_ID,
        }),
        headers: {
          Accept: 'application/json',
        },
      };

      Logger.log('ApiData URL: ' + url);

      if (TEST) {
        const requestSimulate = UrlFetchApp.getRequest(url, options);
        Logger.log('ApiData Request:' + JSON.stringify(requestSimulate));
      }

      var response = UrlFetchApp.fetch(url, options);
      const responseCode = response.getResponseCode();

      if (responseCode === 200) {
        const data = response.getContentText();
        if (TEST) {
          Logger.log('ApiData Response:' + data);
        }
        resolve(JSON.parse(data));
      } else {
        Logger.log(
          `ApiData Error (${responseCode}): ${response.getContentText()}`
        );
        return resolve({
          status: false,
          message: 'Server Error',
        });
      }
    } catch (error) {
      Logger.log(`ApiData Exception: ${error.toString()}`);
      resolve({
        status: false,
        error: error.toString(),
        message: 'Server Error',
      });
    }
  });
};

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
  if (apiData.STATUS == 'SUCCESS') {
    // console.log("result.RESPONSE", result.RESPONSE)
    const dataWithDate = apiData.RESPONSE;
    var newData = [];
    console.log('dataWithDate', dataWithDate);
    console.log('getSheetData===', getSheetData);

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

    console.log('newData---', newData);
    newData.map((item, i) => {
      sheet.appendRow([
        item.UNIQUE_QUERY_ID,
        item.QUERY_TYPE,
        item.QUERY_TIME,
        item.SENDER_NAME,
        item.SENDER_MOBILE,
        item.SENDER_EMAIL,
        item.SUBJECT,
        item.SENDER_COMPANY,
        item.SENDER_ADDRESS,
        item.SENDER_CITY,
        item.SENDER_STATE,
        item.SENDER_PINCODE,
        item.SENDER_COUNTRY_ISO,
        item.SENDER_MOBILE_ALT,
        item.SENDER_PHONE,
        item.SENDER_PHONE_ALT,
        item.SENDER_EMAIL_ALT,
        item.QUERY_PRODUCT_NAME,
        item.QUERY_MESSAGE,
        item.QUERY_MCAT_NAME,
        item.CALL_DURATION,
        item.RECEIVER_MOBILE,
      ]);
      // console.log("Responce Data", item.SENDER_NAME);
    });
  } else {
    console.log('message', result);
    var recipient = 'srksonwarsha@gmail.com';
    var subject = 'Hello function Email';
    var body = '<h1>This is a test email sent from Google Apps Script.</h1>';

    MailApp.sendEmail({ to: recipient, subject: subject, htmlBody: body });
  }

  return apiData;
};

export const verifyLicense = async (data) => {
  console.log('verifyLicense called');
  const response = await getApiData('verify', data);
  return response;
};

export const productDetails = async () => {
  console.log('productDetails called');
  const data = {};
  const response = await getApiData('product', data);
  Logger.log('productDetails: ' + response);
  return response;
};

export const columns = async () => {
  Logger.log('columns: ' + COLUMNS);
  return {
    status: true,
    columns: COLUMNS,
  };
};

export const resellerData = async () => {
  Logger.log('resellerData: ' + DATA);
  return { status: true, data: DATA };
};

export const setting = async () => {
  Logger.log('setting start');
  const documentProperties = PropertiesService.getDocumentProperties();
  const setting = documentProperties.getProperty('SETTING');
  Logger.log('setting: ' + setting);

  if (setting) {
    Logger.log('setting found');
    return { status: true, setting: JSON.parse(setting) };
  } else {
    Logger.log('setting not found');
    const data = {
      lang: 'en',
      exportForm: 'xls',
      removeDuplicate: 'only_phone',
      delay: 10,
      sheetName: 'Sheet1',
      apiKey: '',
    };

    //Set Trigger
    setTrigger(data.delay ?? 10);

    syncSheet(data.sheetName??"Sheet1");

    documentProperties.setProperty('SETTING', JSON.stringify(data));
    return { status: true, setting: data };
  }
};

export const renewLicenseKey = async (data) => {
  console.log('renewLicenseKey called');
  const response = await getApiData('renew-license-key', data);
  Logger.log('renewLicenseKey: ' + response);
  return response;
};

export const getLicenseDetails = async () => {
  const documentProperties = PropertiesService.getDocumentProperties();
  const licenseKey = documentProperties.getProperty('LICENSE_KEY');

  Logger.log('getLicenseDetails licenseKey: ' + licenseKey);
  if (licenseKey) {
    Logger.log('getLicenseDetails licenseKey: Found');
    const response = await getApiData('details', { key: licenseKey });

    //Logger.log("getLicenseDetails response: "+JSON.stringify(response));

    if (response.status) {
      if (!response.detail.enable) {
        return {
          status: false,
          code: 800,
          detail: response.detail,
          message: 'keyDisabledByAdmin',
        };
      } else if (response.detail.status === 3) {
        return {
          status: false,
          code: 550,
          detail: response.detail,
          message: 'expireLkey',
        };
      } else if (response.detail.status !== 1) {
        return {
          status: false,
          code: 800,
          detail: response.detail,
          message: 'keyIsNotActive',
        };
      }

      return response;
    } else {
      return {
        status: false,
        message: '',
      };
    }
  } else {
    Logger.log('getLicenseDetails licenseKey: Not Found');
    return {
      status: false,
      message: '',
    };
  }
};

export const getVersion = async () => {
  Logger.log('getVersion: ' + BUILD_VERSION);
  return {
    status: true,
    version: BUILD_VERSION,
  };
};

export const getTrial = async () => {
  console.log('getTrial called');
  const response = await getApiData('get-trial', {});
  Logger.log('getTrial: ' + response);
  return response;
};

export const onActiveLicense = async (data) => {
  console.log('onActiveLicense called');
  const response = await getApiData('active', data);

  const documentProperties = PropertiesService.getDocumentProperties();

  if (response.status) {
    documentProperties.setProperty('LICENSE_KEY', data.key);
  }
  Logger.log('onActiveLicense: ' + response);
  return response;
};

export const saveSetting = async (data) => {
  const documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty('SETTING', JSON.stringify(data));

  //Set Trigger
  setTrigger(data.delay ?? 10);

  syncSheet(data.sheetName??"Sheet1");

  Logger.log('saveSetting: ' + data);
  return { status: true, message: 'settingSave' };
};

export const sheets = () => {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

  return sheets.map((x) => {
    return {
      id: x.getSheetId(),
      name: x.getName(),
    };
  });
};


const syncSheet = (sheetName) => {

    const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName??"Sheet1");

    if (sheet) {
      if (isSheetEmpty(sheet)) {
        sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
        sheet.setFrozenRows(1);
      }
    }
}


//IndiaMart
export const fetchIndiaMart = async ()  => {


  const licResponse = await getLicenseDetails();

  if(licResponse.status){

    Logger.log("License is valid");

  const documentProperties = PropertiesService.getDocumentProperties();
  var setting = documentProperties.getProperty('SETTING');

  if (setting) {
    setting = JSON.parse(setting);

    //var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    const sheet = SpreadsheetApp.getActive().getSheetByName(setting.sheetName ?? 'Sheet1');

    if (sheet) {


      const startDate = moment(Date.now())
        .subtract(1, 'd')
        .format('DD-MMM-YYYY'); //"20-Aug-2023";

      const endDate = moment(Date.now()).format('DD-MMM-YYYY'); //"21-Aug-2023";

      Logger.log('startDate: ' + startDate);
      Logger.log('endDate: ' + endDate);

      var key = 'mR26Eb1l7XzJTver4nGP7lqGpVfBnTZi';
      var url = `https://mapi.indiamart.com/wservce/crm/crmListing/v2/?glusr_crm_key=${key}&start_time=${startDate}&end_time=${endDate}`;

      var response = UrlFetchApp.fetch(url);
      const responseCode = response.getResponseCode();

      if (responseCode === 200) {
        const data = response.getContentText();
        if (TEST) {
          Logger.log('IndiaMart Response:' + data);
        }

        let result = JSON.parse(data);

        if (result.STATUS == 'SUCCESS') {
          if (result.RESPONSE.length > 0) {
            //var headers = Object.keys(result.RESPONSE[0]).map((key) => key);

            if (isSheetEmpty(sheet)) {
              sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
              sheet.setFrozenRows(1);
            }

            const rowData = getRowsData(sheet);
            const currentIds = rowData.map((row) => (row.UNIQUE_QUERY_ID??"").toString());

            const newData = result.RESPONSE.filter(
              (x) => !currentIds.includes(x['UNIQUE_QUERY_ID'])
            );

            Logger.log("rowData length: "+rowData.length);
            Logger.log("currentIds: "+JSON.stringify(currentIds));

            Logger.log("newData: "+JSON.stringify(newData));

            newData.forEach((x) => {
              writeJSONtoSheet(sheet, x);
            });
          }
        }
      } else {
      }
    } else {
      Logger.log('sheet not found: ' + setting.sheetName);
    }
  } else {
    Logger.log('setting not found');
  }

}else{
  Logger.log('fetchIndiaMart license is invalid');
}
};

export const statistics = () => {
  const documentProperties = PropertiesService.getDocumentProperties();
  var setting = documentProperties.getProperty('SETTING');

  if (setting) {
    setting = JSON.parse(setting);

    //var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    const sheet = SpreadsheetApp.getActive().getSheetByName(setting.sheetName ?? 'Sheet1');

    if (sheet) {

      const today = moment(Date.now()).format('YYYY-MM-DD');

      const rowData = getRowsData(sheet);
      
      Logger.log("rows: "+JSON.stringify(rowData))

      Logger.log("total rows: "+rowData.length)
      Logger.log("today: "+today);

    // try{
      
    //     rowData.forEach((row)=>{
    //       Logger.log("row: "+JSON.stringify(row));
    //       // Logger.log("QUERY_TIME 1: "+row.QUERY_TIME);
    //       // Logger.log("QUERY_TIME 2: "+row.QUERY_TIME.toString());
    //       // Logger.log("QUERY_TIME 3: "+row.QUERY_TIME.startsWith(today));
    //       // Logger.log("QUERY_TIME 4: "+row.QUERY_TIME.includes(today));

    //       Logger.log("QUERY_TIME 5: "+moment(row.QUERY_TIME).isSame(today, 'day'));
    //     });

    // }catch(e){
    //   Logger.log("Error: "+e);
    // }

      const todaysData = rowData.filter((row)=>moment(row.QUERY_TIME).isSame(today, 'day'));

      Logger.log("todays rows: "+JSON.stringify(todaysData))

      return {
        totalData: rowData.length,
        todayData: todaysData.length,
      };
    }
  }

  return {
    totalData: 0,
    todayData: 0,
  };
};

export const setTriggerManually = () => {
  const documentProperties = PropertiesService.getDocumentProperties();
  var setting = documentProperties.getProperty('SETTING');

  if (setting) {
    setting = JSON.parse(setting);

    //SpreadsheetApp.getProjectTriggers
    const allTriggers = ScriptApp.getProjectTriggers();

    allTriggers.forEach((trigger) => {
      //ScriptApp.deleteTrigger(trigger.getUniqueId());

      const triggerId = trigger.getUniqueId();
      const functionName = trigger.getHandlerFunction();

      Logger.log('triggerId: ' + triggerId);
      Logger.log('functionName: ' + functionName);

      if (functionName === 'fetchIndiaMart') {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    ScriptApp.newTrigger('fetchIndiaMart')
      .timeBased()
      .everyMinutes(setting.delay)
      .create();
  }
};

function setTrigger(min) {
  //SpreadsheetApp.getProjectTriggers
  const allTriggers = ScriptApp.getProjectTriggers();

  allTriggers.forEach((trigger) => {
    //ScriptApp.deleteTrigger(trigger.getUniqueId());

    const triggerId = trigger.getUniqueId();
    const functionName = trigger.getHandlerFunction();

    Logger.log('triggerId: ' + triggerId);

    if (functionName === 'fetchIndiaMart') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('fetchIndiaMart').timeBased().everyMinutes(min).create();
}

function getRowsData(sheet) {
  var headersRange = sheet.getRange(
    1,
    1,
    sheet.getFrozenRows(),
    sheet.getMaxColumns()
  );
  var headers = headersRange.getValues()[0];
  var dataRange = sheet.getRange(
    sheet.getFrozenRows() + 1,
    1,
    sheet.getMaxRows(),
    sheet.getMaxColumns()
  );
  //return getObjects(dataRange.getValues(), normalizeHeaders(headers));
  return getObjects(dataRange.getValues(), headers);
}

function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}

function isCellEmpty(cellData) {
  return typeof cellData == 'string' && cellData == '';
}

function isSheetEmpty(sheet) {
  return sheet.getDataRange().getValues().join('') === '';
}

function writeJSONtoSheet(sheet, json) {
  //var sheet = SpreadsheetApp.getActiveSheet();

  var keys = Object.keys(json).sort();
  var last = sheet.getLastColumn();
  var header = sheet.getRange(1, 1, 1, last).getValues()[0];
  var newCols = [];

  Logger.log('keys: ' + keys);
  Logger.log('last: ' + last);
  Logger.log('header: ' + header);

  for (var k = 0; k < keys.length; k++) {
    if (header.indexOf(keys[k]) === -1) {
      newCols.push(keys[k]);
    }
  }

  Logger.log('newCols: ' + newCols);

  if (newCols.length > 0) {
    sheet.insertColumnsAfter(last, newCols.length);
    sheet.getRange(1, last + 1, 1, newCols.length).setValues([newCols]);
    header = header.concat(newCols);
  }

  var row = [];

  for (var h = 0; h < header.length; h++) {
    row.push(header[h] in json ? json[header[h]] : '');
  }

  Logger.log('row: ' + row);

  sheet.appendRow(row);
}
