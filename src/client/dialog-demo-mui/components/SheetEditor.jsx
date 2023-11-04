import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import jsonData from './data.json'
import FormInput from './FormInput';
import Form from './Form'
import SheetTable from './SheetTable';


// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';

const SheetEditor = () => {
  var SheetRes = jsonData
  const [names, setNames] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    serverFunctions.getSheetsData().then(setNames).catch(alert);
    // serverFunctions.readData(jsonData?.RESPONSE)
    // .then((res) => {
    //   console.log("response:", res);
    //   setData(res);
    // }).catch(alert);
  }, []);

  const deleteSheet = (sheetIndex) => {
    serverFunctions.deleteSheet(sheetIndex).then(setNames).catch(alert);
  };

  const setActiveSheet = (sheetName) => {
    serverFunctions.setActiveSheet(sheetName).then(setNames).catch(alert);
  };

  const submitNewSheet = async (newSheetName) => {
    try {
      const response = await serverFunctions.addSheet(newSheetName);
      setNames(response);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error);
    }
  };
  
  const sendData = async() => {
    console.log("SheetRes------",SheetRes)
    let data = await serverFunctions.readData(SheetRes);
    console.log("data=-====-",data)
  };

  return <Form />
};


export default SheetEditor;
