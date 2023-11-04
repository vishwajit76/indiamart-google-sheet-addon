/* eslint-disable */
import React, { useEffect, useState } from 'react';
import './Form.css';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';

import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import countryList from '../countryList.json';
import langList from '../lang.json';
//import logo from "../images/logo.png";

import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import MobileStepper from '@mui/material/MobileStepper';
import { styled, useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

import { serverFunctions } from '../../utils/serverFunctions';

import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const ITEM_HEIGHT = 36;
const MOBILE_ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MENU_ITEMS = 6; // change this number to see the effect

const TAB_ITEMS = ['home', 'setting', 'help'];
const font = "'Poppins', sans-serif";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
const useStyles = makeStyles((theme) => ({
  customChip: {
    borderColor: `${'#1976d2 '} !important`,
    color: `${'#1976d2 '} !important`,
  },
}));
const useStyles1 = makeStyles((theme) => ({
  pulse: {
    animation: '$pulse 1.5s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 0 0 0px rgba(0, 0, 0, 0.2)',
    },
    '100%': {
      opacity: '0.5',
      boxShadow: '0 0 0 4px white',
    },
  },
}));

const Form = () => {
  const classes = useStyles();
  const pulse = useStyles1();

  const { t, i18n } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();
  const [rData, setRData] = useState({});

  //const [color, setColor] = useState("#0855a4");
  const [theme, setTheme] = useState(
    createTheme({
      typography: {
        fontFamily: font,
      },
      palette: {
        primary: {
          main: '#0855a4',
        },
        secondary: {
          main: '#FFFFFF',
          error: '17F8F0',
        },
      },
    })
  );

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [setting, setSetting] = useState(null);
  const [licenseDetails, setLicenseDetails] = useState(null);

  const [isLicenseValid, setIsLicenseValid] = useState(false);
  const [licenseMessage, setLicenseMessage] = useState('');

  const [selectedKeywordId, setSelectedKeywordId] = useState('select');

  //activation form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');
  const [key, setKey] = useState('');
  const [keyIsValid, setKeyIsValid] = useState(false);

  const [selectedTabId, setSelectedTabId] = useState(0);

  const [delay, setDelay] = useState('10');
  const [selectLang, setSelectLang] = useState('en');
  const [dataFormate, setDataFormate] = useState('csv');
  const [removeDuplicate, setRemoveDuplicate] = useState('only_phone');

  //var dummy={};
  //const [columns, setColumns] = useState([]);
  //const [extractCol, setExtractCol] = useState({});

  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  // const [ypLink, setKeyword] = useState('')

  const [showValidation, setShowValidation] = useState(false);

  const [licenceKeyErrorMessage, setLicenceKeyErrorMessage] = useState(
    t('invalidLicenseKey')
  );

  const themeSlider = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const [renewKey, setRenewKey] = useState('');
  const [renewOpen, setRenewOpen] = useState(false);
  const [version, setVersion] = useState('');
  const [isUpdate, setIsUpdate] = useState(true);
  const renewOpenForm = () => {
    setRenewKey('');
    setRenewOpen(true);
  };
  const renewCloseForm = () => {
    setRenewOpen(false);
  };

  //check email regex

  //sheets
  const [activeSheetName, setActiveSheetName] = useState('select');
  const [sheets, setSheets] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [statistics, setStatistics] = useState({ totalData: 0, todayData: 0 });

  const isEmailIsValid = (emailAddress) => {
    let regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
    return regex.test(emailAddress);
  };

  const getProductData = async () => {
    let response = await serverFunctions.productDetails();
    console.log('getProductData:', JSON.stringify(response));
    if (response.status) {
      setProduct(response.product);
    }
  };

  // const getColumns = async () => {
  //   let response = await serverFunctions.columns();
  //   console.log('columns:', JSON.stringify(response));
  //   setColumns(response.columns);
  //   response.columns.forEach((x) => {
  //     setExtractCol((col) => {
  //       return { ...col, [x.value]: true };
  //     });
  //   });
  // };

  const getResellerData = async () => {
    let response = await serverFunctions.resellerData();
    console.log('resellerData:', JSON.stringify(response));
    if (response.status == true) {
      setRData(response.data);
      setPhone('+' + response.data.country_code);

      const c = countryList.find(
        (c) => c.countryCode == (response.data.country ?? 'IN')
      );
      if (c) {
        setCountry(c.countryNameEn);
      } else {
        console.log('Country name not found');
      }
    }
  };

  const getSetting = async () => {
    let response = await serverFunctions.setting();
    console.log('setting:', JSON.stringify(response));

    if (response.status == true) {
      const data = response.setting;
      setSetting(data);
      setDataFormate(data.exportForm);
      setRemoveDuplicate(data.removeDuplicate);
      setDelay(`${data.delay ?? 10}`);
      //setExtractCol(data.extractCol);
      setSelectLang(data.lang ?? 'en');
      i18next.changeLanguage(data.lang ?? 'en');
      setActiveSheetName(data.sheetName ?? 'Sheet1');
      setApiKey(data.apiKey ?? '');
    } else {
      enqueueSnackbar(t(response.message));
    }
  };

  const expireDate = () => {
    if (licenseDetails) {
      return dateFormat(licenseDetails.expireAt);
    } else {
      return '';
    }
  };

  const dateFormat = (dateString, showTime) => {
    let expDate = new Date(dateString);
    let optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    //return expDate.toLocaleDateString("en-in", optionsDate)+(showTime? " "+expDate.toLocaleTimeString("en-in"):"");
    const year = expDate.getUTCFullYear();
    const month = expDate.getUTCMonth() + 1; // Months are zero-indexed, so we add 1
    const day = expDate.getUTCDate();
    return `${day}-${month}-${year}`;
  };

  const renewLicenseKey = async () => {
    let response = await serverFunctions.renewLicenseKey({
      key: licenseDetails.key,
      renew_key: renewKey,
    });
    console.log('renewLicenseKey:', JSON.stringify(response));

    if (response.status == true) {
      enqueueSnackbar(response.message, { variant: 'success' });
      setTimeout(() => {
        renewCloseForm();
      }, 500);
    } else {
      enqueueSnackbar(t(response.message), { variant: 'error' });
    }
  };

  const getLicenseDetails = async () => {
    let response = await serverFunctions.getLicenseDetails();

    console.log('License Details:', JSON.stringify(response));

    if (response.status == true) {
      setIsLicenseValid(true);
      setLicenseMessage('');
    } else {
      setIsLicenseValid(false);
      setLicenseDetails(null);
      setLicenseMessage(response.message);
    }

    if (response.detail) {
      setLicenseDetails(response.detail);
      //fill the form details
      setName(response.detail.name ?? '');
      setEmail(response.detail.email ?? '');
      setPhone(response.detail.phone ?? '');
      setCity(response.detail.place ?? '');
      setCountry(response.detail.country ?? '');
      setKey(response.detail.key ?? '');
    }

    setIsLoading(false);
  };

  const getVersion = async () => {
    let response = await serverFunctions.getVersion();
    setVersion(response?.version);
  };

  const getTrial = async () => {
    let response = await serverFunctions.getTrial();
    if (response.status) {
      setKey(response.key);
      enqueueSnackbar(response.message, { variant: 'success' });
    } else {
      setKey(response.key);
      enqueueSnackbar(response.message, { variant: 'error' });
    }
  };

  const getAllSheets = async () => {
    let response = await serverFunctions.sheets();
    setSheets(response);
  };

  const getStatistics = async () => {
    let response = await serverFunctions.statistics();
    setStatistics(response);
  };

  useEffect(() => {
    console.log('langList size:', langList.length);
    console.log('langList:', JSON.stringify(langList));

    getResellerData();

    //getColumns();
    getSetting();
    getProductData();
    getLicenseDetails();
    getVersion();
    //getScrapeData();
    getAllSheets();
    getStatistics();
  }, []);

  useEffect(() => {
    const sheetExist = sheets.find((x) => x.name === activeSheetName);
    if (!sheetExist) {
      setActiveSheetName('select');
    }
  }, [sheets]);

  useEffect(() => {
    var color = '#0855a4';

    if (product) {
      color = product.color;
    }

    if (rData.theme_setting) {
      if (rData.theme_setting['primary-color']) {
        color = rData.theme_setting['primary-color'];
      }
    }

    setTheme(
      createTheme({
        typography: {
          fontFamily: font,
        },
        palette: {
          primary: {
            main: color,
          },
          secondary: { main: '#FFFFFF' },
        },
      })
    );
  }, [product, rData]);

  useEffect(() => {
    if (showValidation) {
      setTimeout(() => setShowValidation(false), 2000);
    }
  }, [showValidation]);

  // useEffect(() => {

  //   if(licenseDetails){
  //    if(!licenseDetails.enable || status ){

  //    }
  //   }

  //  }, [licenseDetails]);

  useEffect(() => {
    checkLicense(key);
  }, [key]);

  async function checkLicense(key) {
    if (key.length == 19) {
      let response = await serverFunctions.verifyLicense({ key: key });

      setKeyIsValid(response.status);
      setLicenceKeyErrorMessage(response.message);
    } else {
      setKeyIsValid(false);
      setLicenceKeyErrorMessage(t('invalidLicenseKey'));
    }
  }

  const onActivateSubmit = async (e) => {
    e.preventDefault();
    setShowValidation(true);
    if (name == '') {
      return enqueueSnackbar(t('nameRequired'));
    } else if (email == '') {
      return enqueueSnackbar(t('emailRequired'));
    } else if (!isEmailIsValid(email)) {
      return enqueueSnackbar(t('emailInvalid'));
    } else if (phone == '') {
      return enqueueSnackbar(t('phoneInvalid'));
    } else if (city == '') {
      return enqueueSnackbar(t('cityRequired'));
    } else if (country == '') {
      return enqueueSnackbar(t('countryRequired'));
    } else if (key == '') {
      return enqueueSnackbar(t('licenseKeyRequired'));
    }
    // else if (!keyIsValid) {
    //   return enqueueSnackbar(t("licenseKeyInvalid"));
    // }

    const userData = {
      name: name,
      email: email,
      phone: `+${phone}`,
      place: city,
      country: country,
      key: key,
    };

    let response = await serverFunctions.onActiveLicense(userData);

    if (response.status == true) {
      setIsLicenseValid(true);
      getLicenseDetails();
      enqueueSnackbar(t(response.message), { variant: 'success' });
    } else {
      setIsLicenseValid(false);
      enqueueSnackbar(t(response.message));
    }
  };

  const onSaveSetting = async (e) => {
    e.preventDefault();
    setShowValidation(true);

    let data = {
      exportForm: dataFormate,
      removeDuplicate: removeDuplicate,
      delay: Number(delay),
      //extractCol: extractCol,
      lang: selectLang,
      sheetName: activeSheetName,
      apiKey: apiKey,
    };

    let response = await serverFunctions.saveSetting(data);

    if (response.status) {
      enqueueSnackbar(t('settingSave'), { variant: 'success' });
      i18next.changeLanguage(selectLang);
    } else {
      enqueueSnackbar(t('settingSaveFailed'));
    }
  };

  const get_youtube_thumbnail = (url, quality) => {
    if (url) {
      var video_id, thumbnail, result;
      if ((result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))) {
        video_id = result.pop();
      } else if ((result = url.match(/youtu.be\/(.{11})/))) {
        video_id = result.pop();
      }

      if (video_id) {
        if (typeof quality == 'undefined') {
          quality = 'high';
        }

        var quality_key = 'maxresdefault'; // Max quality
        if (quality == 'low') {
          quality_key = 'sddefault';
        } else if (quality == 'medium') {
          quality_key = 'mqdefault';
        } else if (quality == 'high') {
          quality_key = 'hqdefault';
        }

        var thumbnail =
          'http://img.youtube.com/vi/' + video_id + '/' + quality_key + '.jpg';
        return thumbnail;
      }
    }
    return false;
  };

  const totalSlider = () => {
    var count = 0;
    if (product != null) {
      if (product.showAd) {
        count++;
      }

      if (
        product.demoVideoUrl != '' &&
        (product.demoVideoUrl ?? '').includes('youtube.com')
      ) {
        count++;
      }
    }

    return count;
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <BootstrapDialog
          // onClose={renewCloseForm}
          aria-labelledby="customized-dialog-title"
          open={renewOpen}
          sx={{ width: '400px', ml: '-20px' }}
        >
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '12px' }}
            id="customized-dialog-title"
          >
            {t('renewLicense')}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={renewCloseForm}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <Typography gutterBottom>
              <TextField
                value={renewKey}
                onChange={(e) => setRenewKey(e.target.value)}
                label={t('licenseKey')}
                size="small"
                placeholder={t('enterLicenseKey')}
                autoComplete="off"
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyOutlinedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" style={{ marginTop: '5px' }}>
                      {keyIsValid == true ? (
                        <DoneAllOutlinedIcon color="primary" />
                      ) : (
                        <DoneAllOutlinedIcon color="disabled" />
                      )}
                    </InputAdornment>
                  ),
                }}
                // required
              />
            </Typography>
            <Typography variant="subtitle2">
              {t('renewDBMbeforeExpire')}
            </Typography>
            <Typography variant="subtitle2">{t('subscription1Y')}</Typography>
            <Typography variant="subtitle2">{t('subscription3M')}</Typography>
            <Typography variant="subtitle2">{t('subscription1M')}</Typography>
          </DialogContent>
          <DialogActions>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              sx={{ py: 1 }}
            >
              <Button
                size="small"
                variant="contained"
                onClick={renewLicenseKey}
              >
                {t('renew')}
              </Button>
              {product && rData?.active_shop == true ? (
                <Grid item xs={4}>
                  <Button size="small" variant="outlined" color="success">
                    <Link
                      underline="none"
                      href={product?.siteUrl ? product.siteUrl : rData?.buy_url}
                      target="_blank"
                    >
                      {t('buyNow')}
                    </Link>
                  </Button>
                </Grid>
              ) : (
                <></>
              )}
            </Stack>
          </DialogActions>
        </BootstrapDialog>

        <Stack direction="column" justifyContent="center" alignItems="center">


        <Box
              component={"img"}
              // width={isLicenseValid?380:270}
              // height={isLicenseValid?90:75}
              width={isLicenseValid?270:270}
              height={isLicenseValid?75:75}
              src="https://api.digibulkmarketing.com/media/indiamart-to-google-long.png"
              alt={product?.name ?? ""}
            />


         

          {isLicenseValid ? (
            <>
             <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{ my: 1 }}
              >
                <Typography variant="p">{t('expireDate')}</Typography>

                <Chip
                  size="small"
                  className={classes.customChip}
                  sx={{
                    borderRadius: '4px',
                    fontSize: '10px',
                    height: '17px',
                  }}
                  label={`${expireDate()}`}
                  variant="outlined"
                />

                <Chip
                  size="small"
                  className={pulse.pulse}
                  onClick={renewOpenForm}
                  sx={{
                    borderRadius: '4px',
                    fontSize: '10px',
                    height: '17px',
                  }}
                  label={t('renewLabel')}
                  variant="outlined"
                />
              </Stack>
            </>
          ) : (
            <></>
          )}
        </Stack>

        {isLoading ? (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              height: "100vh",
            }}
            className="mainBox"
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              {t('loading')} <br />
              <CircularProgress />
            </Stack>
          </div>
        ) : (
          <Box>
            {isLicenseValid ? (
              <>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    marginTop: '5px',
                    borderRadius: '10px',
                  }}
                >
                  <Grid
                    container
                    direction={'row'}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ py: 1 }}
                    //spacing={2}
                  >
                    {TAB_ITEMS.map((x, i) => (
                      <Grid item xs={3} key={'tab-' + i}>
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Button
                            variant={selectedTabId == i ? 'outlined' : 'text'}
                            // color={
                            //   selectedKeywordId == i ? "secondary" : "primary"
                            // }
                            color="secondary"
                            size="small"
                            onClick={() => setSelectedTabId(i)}
                          >
                            {t(x)}
                          </Button>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box className="mainBox">
                  {selectedTabId == 0 ? (
                    <>
                      <Grid
                        container
                        spacing={0}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mt: 2 }}
                      >
                        <Grid item xs={6} sx={{ p: 1 }}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography
                                sx={{ fontSize: 14 }}
                                color="text.secondary"
                                gutterBottom
                              >
                                {/* Total Entry */}
                                {t('totalEntry')}
                              </Typography>

                              <Typography variant="h5" component="div">
                                {statistics.totalData ?? 0}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={6} sx={{ p: 1 }}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography
                                sx={{ fontSize: 14 }}
                                color="text.secondary"
                                gutterBottom
                              >
                                {/* Today's Entry */}
                                {t('todayEntry')}
                              </Typography>

                              <Typography variant="h5" component="div">
                                {statistics.todayData ?? 0}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <></>
                  )}

                  {selectedTabId == 1 ? (
                    <Box sx={{ mt: 2 }}>
                      <form onSubmit={onSaveSetting}>
                        <Grid
                          container
                          direction={'column'}
                          sx={{ mb: 2 }}
                          spacing={2}
                        >
                          {/* <Grid item>
                            <FormControl fullWidth>
                              <InputLabel>{t('removeDuplicate')}</InputLabel>

                              <Select
                                value={removeDuplicate}
                                size="small"
                                label={t('removeDuplicate')}
                                onChange={(e) =>
                                  setRemoveDuplicate(e.target.value)
                                }
                              >
                                <MenuItem value="only_phone">
                                  {t('onlyPhone')}
                                </MenuItem>
                                <MenuItem value="only_address">
                                  {t('onlyAddress')}
                                </MenuItem>
                                <MenuItem value="phone_and_address">
                                  {t('phoneAndaddress')}
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid> */}

                          <Grid item>
                            <FormControl fullWidth>
                              <InputLabel>{t('chooseSheet')}</InputLabel>

                              <Select
                                value={activeSheetName}
                                size="small"
                                label={t('sheet')}
                                onChange={(e) =>
                                  setActiveSheetName(e.target.value)
                                }
                              >
                                <MenuItem value={'select'}>
                                  {t('select')}
                                </MenuItem>

                                {sheets.map((x) => {
                                  return (
                                    <MenuItem key={x.id} value={x.name}>
                                      {x.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item>
                            <TextField
                              onChange={(e) => setApiKey(e.target.value)}
                              label={t('apiKey')}
                              variant="outlined"
                              placeholder={t('enterIndiaMartApiKey')}
                              value={apiKey}
                              size="small"
                              type="text"
                              autoComplete="off"
                              fullWidth
                            />
                          </Grid>

                          <Grid item>
                            <FormControl fullWidth>
                                <InputLabel>{t('apiTrigger')}</InputLabel>

                                <Select
                                  value={delay}
                                  size="small"
                                  label={t('apiTrigger')}
                                  onChange={(e) => setDelay(e.target.value)}
                                >
                                  <MenuItem value="10">
                                    {t('every10Minutes')}
                                  </MenuItem>
                                  <MenuItem value="15">
                                    {t('every15Minutes')}
                                  </MenuItem>
                                  <MenuItem value="30">
                                    {t('every30Minutes')}
                                  </MenuItem>
                                </Select>
                              </FormControl>
                              </Grid>
                              <Grid item>
                              <FormControl fullWidth>
                                <InputLabel>{t('language')}</InputLabel>
                                <Select
                                  value={selectLang}
                                  size="small"
                                  label={t('language')}
                                  onChange={(e) =>
                                    setSelectLang(e.target.value)
                                  }
                                  MenuProps={{
                                    PaperProps: {
                                      sx: {
                                        width: '10%',
                                        maxHeight: {
                                          xs:
                                            MOBILE_ITEM_HEIGHT * MENU_ITEMS +
                                            ITEM_PADDING_TOP,
                                          sm:
                                            ITEM_HEIGHT * MENU_ITEMS +
                                            ITEM_PADDING_TOP,
                                        },
                                      },
                                    },
                                  }}
                                >
                                  {langList.map((x, i) => {
                                    return (
                                      <MenuItem key={x.key} value={x.key}>
                                        {x.name ?? ''}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                           
                          </Grid>
                        </Grid>

                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={2}
                          // sx={{ mt: 1 }}
                        >
                          <Button
                            variant="contained"
                            type="submit"
                            size="small"
                          >
                            {t('save')}
                          </Button>
                        </Stack>
                      </form>
                      </Box>
                   
                  ) : (
                    <></>
                  )}

                  {selectedTabId == 2 ? (
                  
                  <Box sx={{ mt: 2 }}>
                      <Typography variant="h6">{t('helpMsg')}</Typography>

                      <Typography variant="caption">
                        {t('contactWithEmail')}
                      </Typography>

                      <List>
                        {product?.contactNumber != '' ? (
                          <ListItem>
                            <ListItemAvatar>
                              <PhoneIcon />
                            </ListItemAvatar>
                            <ListItemText
                              sx={{ my: 0 }}
                              primary={t('phone')}
                              secondary={
                                <Link
                                  underline="none"
                                  href={'tel:' + product?.contactNumber}
                                  target="_blank"
                                  variant="body2"
                                >
                                  {product?.contactNumber}
                                </Link>
                              }
                            />
                          </ListItem>
                        ) : (
                          <></>
                        )}
                        {product?.email != '' ? (
                          <ListItem>
                            <ListItemAvatar>
                              <EmailOutlinedIcon />
                            </ListItemAvatar>
                            <ListItemText
                              sx={{ my: 0 }}
                              primary={t('email')}
                              secondary={
                                <Link
                                  underline="none"
                                  href={'mailto:' + product?.email}
                                  target="_blank"
                                  variant="body2"
                                >
                                  {product?.email}
                                </Link>
                              }
                            />
                          </ListItem>
                        ) : (
                          <></>
                        )}
                        {product?.siteUrl != '' ? (
                          <ListItem>
                            <ListItemAvatar>
                              <LanguageIcon />
                            </ListItemAvatar>
                            <ListItemText
                              sx={{ my: 0 }}
                              primary={t('website')}
                              secondary={
                                <Link
                                  underline="none"
                                  href={product?.siteUrl}
                                  variant="body2"
                                  target="_blank"
                                >
                                  {product?.siteUrl}
                                </Link>
                              }
                            />
                          </ListItem>
                        ) : (
                          <></>
                        )}
                      </List>

                      <Typography variant="h6">{t('disclaimer')}:</Typography>
                      <Typography variant="caption">
                        {t('imCertified ')}
                      </Typography>
                      </Box>
                  ) : (
                    <></>
                  )}
                </Box>

                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                  divider={<Divider orientation="vertical" flexItem />}
                  sx={{mt:2}}
                  //sx={{position:"absolute",bottom:"2px" }}
                >
                  <Typography variant="caption">{`V ${
                    version ?? '1.0'
                  }`}</Typography>
                </Stack>
              </>
            ) : (
              <>
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <form onSubmit={onActivateSubmit}>
                      <Grid
                        container
                        direction={'column'}
                        sx={{
                          py: 1,
                        }}
                        spacing={2}
                      >
                        <Grid item>
                          {licenseMessage != '' ? (
                            <Alert severity="warning">
                              {t(licenseMessage)}
                            </Alert>
                          ) : (
                            <></>
                          )}
                        </Grid>

                        <Grid item>
                          <TextField
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            label={t('name')}
                            size="small"
                            fullWidth
                            variant="outlined"
                            placeholder={t('enterName')}
                            error={name == '' && showValidation}
                            helperText={
                              name == '' && showValidation ? (
                                <Typography variant="p">
                                  {t('nameRequired')}
                                </Typography>
                              ) : (
                                ''
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonOutlineOutlinedIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item>
                          <TextField
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label={t('emailAddress')}
                            size="small"
                            fullWidth
                            variant="outlined"
                            placeholder={t('enterEmail')}
                            type="email"
                            error={
                              (email == '' || !isEmailIsValid(email)) &&
                              showValidation
                            }
                            helperText={
                              showValidation ? (
                                email == '' ? (
                                  <Typography variant="p">
                                    {t('emailRequired')}
                                  </Typography>
                                ) : !isEmailIsValid(email) ? (
                                  <Typography variant="p">
                                    {t('emailInvalid')}
                                  </Typography>
                                ) : (
                                  ''
                                )
                              ) : (
                                ''
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonOutlineOutlinedIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item>
                          <FormControl
                            fullWidth
                            error={phone == '' && showValidation}
                            helperText={
                              phone == '' && showValidation ? (
                                <Typography variant="p">
                                  {t('phoneRequired')}
                                </Typography>
                              ) : (
                                ''
                              )
                            }
                          >
                            <PhoneInput
                              country={'in'}
                              value={phone}
                              placeholder={t('enterPhone')}
                              inputStyle={{ width: 'inherit' }}
                              onChange={(phone) => setPhone(phone)}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item>
                          <TextField
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            label={t('city')}
                            size="small"
                            fullWidth
                            variant="outlined"
                            placeholder={t('enterCity')}
                            error={city == '' && showValidation}
                            helperText={
                              city == '' && showValidation ? (
                                <Typography variant="p">
                                  {t('cityRequired')}
                                </Typography>
                              ) : (
                                ''
                              )
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <HomeOutlinedIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item>
                          <FormControl fullWidth>
                            <InputLabel>{t('country')}</InputLabel>

                            <Select
                              value={country}
                              size="small"
                              label={t('selectCountry')}
                              onChange={(e) => setCountry(e.target.value)}
                              renderValue={(value) => {
                                return (
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <SvgIcon>
                                      <FmdGoodOutlinedIcon />
                                    </SvgIcon>
                                    {value}
                                  </Box>
                                );
                              }}
                              //IconComponent={FmdGoodOutlinedIcon}
                              // InputProps={{
                              //   startAdornment: (
                              //     <InputAdornment position="start">
                              //       <FmdGoodOutlinedIcon />
                              //     </InputAdornment>
                              //   ),}}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    width: '10%',
                                    maxHeight: {
                                      xs:
                                        MOBILE_ITEM_HEIGHT * MENU_ITEMS +
                                        ITEM_PADDING_TOP,
                                      sm:
                                        ITEM_HEIGHT * MENU_ITEMS +
                                        ITEM_PADDING_TOP,
                                    },
                                  },
                                },
                              }}
                            >
                              {countryList.map((x, i) => (
                                <MenuItem
                                  key={x.countryCode}
                                  value={x.countryNameEn}
                                >
                                  {x.countryNameEn}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item>
                          <TextField
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            label={t('licenseKey')}
                            size="small"
                            placeholder={t('enterLicenseKey')}
                            autoComplete="off"
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <KeyOutlinedIcon />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  style={{ marginTop: '5px' }}
                                >
                                  {keyIsValid == true ? (
                                    <DoneAllOutlinedIcon color="primary" />
                                  ) : (
                                    <DoneAllOutlinedIcon color="disabled" />
                                  )}
                                </InputAdornment>
                              ),
                            }}
                            // required
                            color={keyIsValid ? 'success' : null}
                            error={key != '' && keyIsValid == false}
                            // error={
                            //   (key == "" ||
                            //     (keyIsValid == false && key.length == 19)) &&
                            //   showValidation
                            // }
                            helperText={
                              key != '' && keyIsValid == false ? (
                                <Typography variant="p">
                                  {licenceKeyErrorMessage}
                                </Typography>
                              ) : (
                                <></>
                              )
                            }

                            // helperText={
                            //   (key == "" ||
                            //     (keyIsValid == false && key.length == 19)) &&
                            //   showValidation ? (
                            //     <Typography variant="p">
                            //       Invalid License Key
                            //     </Typography>
                            //   ) : (
                            //     ""
                            //   )
                            // }
                          />
                        </Grid>
                        <Grid item>
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            sx={{ cursor: 'pointer', mt: -2, mr: 1 }}
                          >
                            <Typography onClick={getTrial} variant="body2">
                              {t('getTrial')}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={2}
                          sx={{ mt: 0 }}
                        >
                          <Button
                            variant="contained"
                            type="submit"
                            size="small"
                          >
                            {t('activate')}
                          </Button>

                          {product && rData?.active_shop == true ? (
                            <Grid item xs={4}>
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                href={
                                  product?.siteUrl
                                    ? product.siteUrl
                                    : rData?.buy_url
                                }
                              >
                                {t('buyNow')}
                              </Button>
                            </Grid>
                          ) : (
                            <></>
                          )}
                        </Stack>
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        )}
      </ThemeProvider>
    </>
  );
};

export default Form;
