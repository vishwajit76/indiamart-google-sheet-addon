/* eslint-disable */
import React, { useEffect, useState } from "react";
// import "./Form.css";
import {
    Alert,
    Box,
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
    Typography
} from "@mui/material";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";

import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
// import countryList from "../countryList.json";
// import langList from "../lang.json";
// import logo from "../images/logo.png";

import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import MobileStepper from "@mui/material/MobileStepper";
import { styled, useTheme } from "@mui/material/styles";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

import { serverFunctions } from '../../utils/serverFunctions';

import i18next from "i18next";
import { useTranslation } from "react-i18next";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const ITEM_HEIGHT = 36;
const MOBILE_ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MENU_ITEMS = 6; // change this number to see the effect

const TAB_ITEMS = ["home", "data", "setting", "help"];
const font = "'Poppins', sans-serif";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const useStyles = makeStyles((theme) => ({
  customChip: {
    borderColor: `${"#17F8F0 "} !important`,
    color: `${"#17F8F0 "} !important`,
  },
}));
const useStyles1 = makeStyles((theme) => ({
  pulse: {
    animation: "$pulse 1.5s infinite",
  },
  "@keyframes pulse": {
    "0%": {
      boxShadow: "0 0 0 0px rgba(0, 0, 0, 0.2)",
    },
    "100%": {
      opacity: "0.5",
      boxShadow: "0 0 0 4px white",
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
          main: "#0855a4",
        },
        secondary: {
          main: "#FFFFFF",
          error: "17F8F0",
        },
      },
    })
  );

  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [setting, setSetting] = useState(null);
  const [licenseDetails, setLicenseDetails] = useState(null);

  const [isLicenseValid, setIsLicenseValid] = useState(false);
  const [licenseMessage, setLicenseMessage] = useState("");

  const [scrapData, setScrapData] = useState({
    // hotel_in_ahmedabad: {
    //   name: "Hotel in ahmedabad",
    //   data: [
    //     {
    //       name: "AAA",
    //       email: "aaa@gmail.com",
    //     },
    //   ],
    // },
  });

  const [selectedKeywordId, setSelectedKeywordId] = useState("select");

  //activation form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91");
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [key, setKey] = useState("");
  const [keyIsValid, setKeyIsValid] = useState(false);

  const [selectedTabId, setSelectedTabId] = useState(0);

  const [delay, setDelay] = useState(1);
  const [selectLang, setSelectLang] = useState('en')
  const [dataFormate, setDataFormate] = useState("csv");
  const [removeDuplicate, setRemoveDuplicate] = useState("only_phone");

  //var dummy={};
  const [columns, setColumns] = useState([]);
  const [extractCol, setExtractCol] = useState({});

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState('')
  // const [ypLink, setKeyword] = useState('')

  const [showValidation, setShowValidation] = useState(false);

  const [licenceKeyErrorMessage, setLicenceKeyErrorMessage] = useState(
    t("invalidLicenseKey")
  );

  const themeSlider = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const [renewKey, setRenewKey] = useState("");
  const [renewOpen, setRenewOpen] = useState(false);
  const [localmanifestVersion, setLocalmanifestVersion] = useState('');
  const [isUpdate, setIsUpdate] = useState(true)
  const renewOpenForm = () => {
    setRenewKey("");
    setRenewOpen(true);
  };
  const renewCloseForm = () => {
    setRenewOpen(false);
  };

  //check email regex

  const isEmailIsValid = (emailAddress) => {
   
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    return regex.test(emailAddress);

  };

  const sendChromeMessage = (data, callback) => {
    try {
      chrome.runtime.sendMessage(data, (response) => {
        callback(response);
      });
    } catch (e) {
      console.log("sendMessage Error:", e);
      // callback({
      //   status: false,
      //   message: "Something is wrong",
      // });
    }
  };

  const expireDate = () => {
    if (licenseDetails) {
      //return licenseDetails.expireAt;
      //let expDate = new Date(licenseDetails.expireAt);
      return dateFormat(licenseDetails.expireAt);
    } else {
      return "";
    }
  };

  const dateFormat = (dateString, showTime) => {
    let expDate = new Date(dateString);
    let optionsDate = { year: "numeric", month: "long", day: "numeric" };
    //return expDate.toLocaleDateString("en-in", optionsDate)+(showTime? " "+expDate.toLocaleTimeString("en-in"):"");
    const year = expDate.getUTCFullYear();
    const month = expDate.getUTCMonth() + 1; // Months are zero-indexed, so we add 1
    const day = expDate.getUTCDate();
    return `${day}-${month}-${year}`;
  };

  const renewLicenseKey = () => {
    sendChromeMessage(
      { key: licenseDetails.key, renew_key: renewKey, type: "renew" },
      (response) => {
        if (response.status == true) {
          enqueueSnackbar(response.message, { variant: "success" });
          setTimeout(() => {
            renewCloseForm();
          }, 500);
        } else {
          enqueueSnackbar(t(response.message), { variant: "error" });
        }
      }
    );
  };

 

//   useEffect(() => {
//     getResellerData();
//     getColumns();
//     getSetting();
//     getProductData();
//     getLicenseDetails();
//     getVersion();
//     getScrapeData();
//   }, []);

  useEffect(() => {
    var color = "#0855a4";

    if (product) {
      color = product.color;
    }

    if (rData.theme_setting) {
      if (rData.theme_setting["primary-color"]) {
        color = rData.theme_setting["primary-color"];
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
          secondary: { main: "#FFFFFF" },
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

  // useEffect(() => {
  //   checkLicense(key);
  // }, [key]);

  // function checkLicense(key) {
  //   if (key.length == 19) {
  //     sendChromeMessage(
  //       { license_key: key, type: "license_verify" },
  //       (response) => {
  //         setKeyIsValid(response.status);
  //         setLicenceKeyErrorMessage(response.message);
  //       }
  //     );
  //   } else {
  //     setKeyIsValid(false);
  //     setLicenceKeyErrorMessage(t("invalidLicenseKey"));
  //   }
  // }

  const onActivateSubmit = async (e) => {
    e.preventDefault();
    setShowValidation(true);
    if (name == "") {
      return enqueueSnackbar(t("nameRequired"));
    } else if (email == "") {
      return enqueueSnackbar(t("emailRequired"));
    } else if (!isEmailIsValid(email)) {
      return enqueueSnackbar(t("emailInvalid"));
    } else if (phone == "") {
      return enqueueSnackbar(t("phoneInvalid"));
    } else if (city == "") {
      return enqueueSnackbar(t("cityRequired"));
    } else if (country == "") {
      return enqueueSnackbar(t("countryRequired"));
    } else if (key == "") {
      return enqueueSnackbar(t("licenseKeyRequired"));
    } 
    // else if (!keyIsValid) {
    //   return enqueueSnackbar(t("licenseKeyInvalid"));
    // }

    const userData = {
      name: name,
      email: email,
      phone: `+${phone}`,
      city: city,
      country: country,
      key: key,
    };
    console.log("UserDatattt",userData)
   let response = await serverFunctions.userActive(userData);
   console.log("response-=-==-Api",response)
    // sendChromeMessage({ data: msg, type: "license_active" }, (response) => {
      if (response.status == true) {
        setIsLicenseValid(true);
        // getLicenseDetails();
        enqueueSnackbar(t(response.message), { variant: "success" });
      } else {
        setIsLicenseValid(false);
        enqueueSnackbar(t(response.message));
      }
    // });
  };

  const onSaveSetting = (e) => {
    e.preventDefault();
    setShowValidation(true);

    let data = {
      exportForm: dataFormate,
      removeDuplicate: removeDuplicate,
      delay: delay,
      extractCol: extractCol,
      lang: selectLang
    };
    sendChromeMessage({ setting: data, type: "save_setting" }, (response) => {
      if (response.status) {
        enqueueSnackbar(t("settingSave"), { variant: "success" });
        i18next.changeLanguage(selectLang);
      } else {
        enqueueSnackbar(t("settingSaveFailed"));
      }
    });
  };

  const onScrape = (e) => {
    e.preventDefault();
    setShowValidation(true);
    if (keyword == "") {
      return enqueueSnackbar(t("keywordIsRequired"));
    }


    sendChromeMessage({ keyword: keyword,location:location, type: "scrap" }, (response) => {
      if (response.status == true) {
        enqueueSnackbar(t(response.message), { variant: "success" });
      } else {
        enqueueSnackbar(t(response.message));
      }
    });
  };

  const onDownloadScrapData = () => {
    sendChromeMessage(
      { type: "download", keyword: selectedKeywordId },
      (response) => {
        if (response.status == true) {
          enqueueSnackbar(t(response.message), { variant: "success" });
          setSelectedKeywordId("select");
        } else {
          enqueueSnackbar(t(response.message));
        }
      }
    );
  };

  const onDeleteScrapData = () => {
    sendChromeMessage(
      { type: "delete_scrap", keyword: selectedKeywordId },
      (response) => {
        if (response.status == true) {
          enqueueSnackbar(t(response.message), { variant: "success" });
          setSelectedKeywordId("select");
        //   getScrapeData();
        } else {
          enqueueSnackbar(t(response.message));
        }
      }
    );
  };

  const onClearScrapData = () => {
    sendChromeMessage(
      { type: "clear_scrap", keyword: selectedKeywordId },
      (response) => {

        if (response.status == true) {
          enqueueSnackbar(t(response.message), { variant: "success" });
          setScrapData({});
        } else {
          enqueueSnackbar(t(response.message));
        }
      }
    );
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
        if (typeof quality == "undefined") {
          quality = "high";
        }

        var quality_key = "maxresdefault"; // Max quality
        if (quality == "low") {
          quality_key = "sddefault";
        } else if (quality == "medium") {
          quality_key = "mqdefault";
        } else if (quality == "high") {
          quality_key = "hqdefault";
        }

        var thumbnail =
          "http://img.youtube.com/vi/" + video_id + "/" + quality_key + ".jpg";
        return thumbnail;
      }
    }
    return false;
  };
  const getTrial = () => {
    sendChromeMessage({ type: "get_trial" }, (response) => {
      console.log("get one day trial demo", response)
      if (response.status) {
        setKey(response.key)
        enqueueSnackbar(response.message, { variant: "success" });
      } else {
        setKey(response.key)
        enqueueSnackbar(response.message, { variant: "error" });
      }

    })
  }


  const totalSlider = () => {
    var count = 0;
    if (product != null) {
      if (product.showAd) {
        count++;
      }

      if (
        product.demoVideoUrl != "" &&
        (product.demoVideoUrl ?? "").includes("youtube.com")
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
          sx={{ width: "400px", ml: "-20px" }}
        >
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: "12px" }}
            id="customized-dialog-title"
          >
            {t("renewLicense")}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={renewCloseForm}
            sx={{
              position: "absolute",
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
                label={t("licenseKey")}
                size="small"
                placeholder={t("enterLicenseKey")}
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
                    <InputAdornment position="end" style={{ marginTop: "5px" }}>
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
              {t("renewDBMbeforeExpire")}
            </Typography>
            <Typography variant="subtitle2">
              {t("subscription1Y")}
            </Typography>
            <Typography variant="subtitle2">
              {t("subscription3M")}
            </Typography>
            <Typography variant="subtitle2">
              {t("subscription1M")}
            </Typography>
          </DialogContent>
          <DialogActions>
          <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              sx={{ py: 1 }}
            >
              <Button size="small" variant="contained" onClick={renewLicenseKey}>
                {t("renew")}
              </Button>
              {product && rData?.active_shop == true ? (
                <Grid item xs={4}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"

                  >
                    <Link
                      underline="none"
                      href={
                        product?.siteUrl
                          ? product.siteUrl
                          : rData?.buy_url
                      } target="_blank" >
                      {t("buyNow")}
                    </Link>

                  </Button>
                </Grid>
              ) : (
                <></>
              )}
            </Stack>
          </DialogActions>
        </BootstrapDialog>

        <Box
          sx={{
            width: "100%",
            height: 100,
            backgroundColor: "primary.main",
            //opacity: [1.0, 0.95,0.9],
            opacity: [0.9, 0.8, 0.7],
            // "&:hover": {
            //   backgroundColor: "primary.main",
            //   opacity: [0.9, 0.8, 0.7],
            // },
          }}
        >

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ py: 1 }}
          >


            {/* <Box
              component={"img"}
              width={45}
              height={45}
              src={logo}
              alt={product?.name ?? ""}
            /> */}

            <Typography component="div" variant="body1" color={"white"}>
              {rData?.name ?? t("Google Sheet")}
            </Typography>


          </Stack>

          {isLicenseValid ? (
            <>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{ mt: 1 }}
              >

                <Typography
                  color={"white"}
                  variant="p"
                >

                  {t("expireDate")}</Typography>

                <Chip
                  size="small"
                  className={classes.customChip}
                  sx={{
                    borderRadius: "4px",
                    fontSize: "10px",
                    height: "17px",
                  }}
                  label={`${expireDate()}`}
                  variant="outlined"
                />

                <Chip
                  size="small"
                  className={pulse.pulse}
                  onClick={renewOpenForm}
                  sx={{
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "10px",
                    height: "17px",
                  }}
                  label={t("renewLabel")}
                  variant="outlined"
                />
                {/* </div> */}
              </Stack>


            </>
          ) : (
            <></>
          )}
        </Box>



        {isLoading ? (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              //height: "100vh",
            }}
            className="mainBox"
          >
            <CircularProgress />
            <span
              style={{
                justifyContent: "center",
                position: "fixed",
                top: "55%",
              }}
            >
              {t("loading")}
            </span>
          </div>
        ) : (
          <Box>
            {isLicenseValid ? (
              <>
                <Box sx={{ bgcolor: "primary.main" }}>
                  <Grid
                    container
                    direction={"row"}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ px: 2, py: 1 }}
                  //spacing={2}
                  >
                    {TAB_ITEMS.map((x, i) => (
                      <Grid item xs={3} key={"tab-" + i}>
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Button
                            variant={selectedTabId == i ? "outlined" : "text"}
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

                  {selectedTabId == 0 ? <>
                    <Grid
                      container
                      spacing={0}
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >

                      <form onSubmit={onScrape}>
                        <Grid item sx={{ width: 300 }}>
                          <Typography sx={{ m: 1 }} variant="subtitle1">
                            {t("welcome")} {licenseDetails?.name ?? ""}
                          </Typography>
                          <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                            sx={{ mt: 1 }}
                          >
                            <TextField
                              value={keyword}
                              onChange={(e) => setKeyword(e.target.value)}
                              label={t("keyword")}
                              size="small"
                              fullWidth
                              variant="outlined"
                              placeholder={t("keyword")}
                              helperText={
                                keyword == "" && showValidation ? (
                                  <Typography variant="p">
                                    {t("keywordIsRequired")}
                                  </Typography>
                                ) : (
                                  ""
                                )
                              }
                            />
                            <TextField
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              label={t("location")}
                              size="small"
                              fullWidth
                              variant="outlined"
                              placeholder={t("enterLocation")}
                              helperText={
                                keyword == "" && showValidation ? (
                                  <Typography variant="p">
                                    {t("locationReq")}
                                  </Typography>
                                ) : (
                                  ""
                                )
                              }
                            />
                          </Stack>
                        </Grid>
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={2}
                          sx={{ mt: 2 }}
                        >
                          <Button
                            variant="contained"
                            type="submit"
                            size="small"
                          >
                            {t("start")}
                          </Button>
                        </Stack>

                      </form>
                      {/* <Grid item xs={12}>
                        <Box sx={{ mt: 4 }} >
                          {product != null ? <AutoPlaySwipeableViews
                            axis={themeSlider.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={activeStep}
                            onChangeIndex={(step) => setActiveStep(step)}
                            enableMouseEvents
                            interval={15000}
                          >


                            {product.showAd ?
                              <Link href={product.adBannerUrl ?? ""} target="_blank"
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width: '100%'
                                }}  >
                                <Box
                                  component="img"
                                  sx={{
                                    height: 200,

                                  }}
                                  src={product.adBannerUrl ?? ''}
                                  alt={product.adBannerUrl ?? ''}
                                />
                              </Link> : <></>}

                            {((product.demoVideoUrl != "") && (product.demoVideoUrl ?? "").includes("youtube.com")) ?
                              <Link href={product.demoVideoUrl ?? ""} target="_blank" >

                                <PlayCircleOutlineOutlinedIcon fontSize="large"
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%',
                                    position: 'absolute',
                                    mt: '10%',
                                    opacity: '0.8',
                                    fontSize: '110px',
                                    color: "grey",
                                    mixBlendMode: "exclusion",
                                  }}
                                />

                                <Box
                                  component="img"
                                  sx={{
                                    height: 200,
                                    display: 'block',
                                    overflow: 'hidden',
                                    maxWidth: 350,
                                    width: '100%',
                                    ml: '2px'
                                  }}
                                  src={get_youtube_thumbnail(product.demoVideoUrl ?? '', 'high')}

                                  alt={product.demoVideoUrl ?? ''}
                                />
                              </Link> : <></>}

                          </AutoPlaySwipeableViews> : <></>}
                          <MobileStepper
                            steps={totalSlider()}
                            position="static"
                            activeStep={activeStep}
                            nextButton={
                              <Button
                                size="small"
                                onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)}
                                disabled={activeStep === (totalSlider()) - 1}
                              >
                                {t("next")}
                                {themeSlider.direction === 'rtl' ? (
                                  <KeyboardArrowLeft />
                                ) : (
                                  <KeyboardArrowRight />
                                )}
                              </Button>
                            }
                            backButton={
                              <Button size="small" onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)} disabled={activeStep === 0}>
                                {themeSlider.direction === 'rtl' ? (
                                  <KeyboardArrowRight />
                                ) : (
                                  <KeyboardArrowLeft />
                                )}
                                {t("back")}
                              </Button>
                            }
                          />
                        </Box>
                      </Grid> */}
                    </Grid>
                  </> : <></>}

                  {selectedTabId == 1 ? (
                    <Box sx={{ p: 3 }}>
                      {Object.keys(scrapData ?? {}).length == 0 ? (
                        // check
                        <Alert severity="warning">{t("noDataFound")}</Alert>
                      ) : (
                        <>
                          <FormControl fullWidth>
                            <InputLabel>{t("keyword")}</InputLabel>

                            <Select
                              value={selectedKeywordId}
                              size="small"
                              label={t("selectKeyword")}
                              onChange={(e) =>
                                setSelectedKeywordId(e.target.value)
                              }
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    width: "10%",
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
                              <MenuItem value={"select"}>Select </MenuItem>
                              {Object.keys(scrapData).map((key) => (
                                <MenuItem key={key} value={key}>
                                  {scrapData[key].name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          {selectedKeywordId != "select" ? (
                            <>
                              <Stack
                                direction="column"
                                // justifyContent="center"
                                // alignItems="center"
                                spacing={1}
                                divider={
                                  <Divider orientation="vertical" flexItem />
                                }
                                sx={{ mt: 2 }}
                              >
                                <Typography variant="p">
                                  {t("totalData")}:{" "}
                                  {
                                    (scrapData[selectedKeywordId]?.data ?? [])
                                      .length
                                  }
                                </Typography>

                                <Typography variant="p">
                                  {t("lastDate")}:{" "}
                                  {dateFormat(
                                    scrapData[selectedKeywordId]?.createdAt,
                                    true
                                  )}
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                divider={
                                  <Divider orientation="vertical" flexItem />
                                }
                                sx={{ mt: 2 }}
                              >
                                <Button
                                  variant="contained"
                                  onClick={(e) => onDownloadScrapData()}
                                  size="small"
                                >
                                  {t("download")}
                                </Button>

                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={(e) => onDeleteScrapData()}
                                  size="small"
                                >
                                  {t("delete")}
                                </Button>
                              </Stack>
                            </>
                          ) : (
                            <></>
                          )}

                          <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                            divider={
                              <Divider orientation="vertical" flexItem />
                            }
                            sx={{ mt: 2 }}
                          >
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={(e) => onClearScrapData()}
                              size="small"
                            >
                              {t("clearAll")}
                            </Button>
                          </Stack>
                        </>
                      )}
                    </Box>
                  ) : (
                    <></>
                  )}

                  {selectedTabId == 2 ? (
                    <Box sx={{ p: 3 }}>
                      <form onSubmit={onSaveSetting}>
                        <Grid
                          container
                          direction={"column"}
                          sx={{ mb: 2 }}
                          spacing={2}
                        >
                          <Grid item>
                            <FormControl fullWidth>
                              <InputLabel>{t("removeDuplicate")}</InputLabel>

                              <Select
                                value={removeDuplicate}
                                size="small"
                                label={t("removeDuplicate")}
                                onChange={(e) =>
                                  setRemoveDuplicate(e.target.value)
                                }
                              >
                                <MenuItem value="only_phone">
                                  {t("onlyPhone")}
                                </MenuItem>
                                <MenuItem value="only_address">
                                  {t("onlyAddress")}
                                </MenuItem>
                                <MenuItem value="phone_and_address">
                                  {t("phoneAndaddress")}
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item>
                            <Stack
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              spacing={1}
                              sx={{ py: 1 }}
                            >
                              {/* //check */}
                              <TextField
                                onChange={(e) => setDelay(e.target.value)}
                                label={t("delay")}
                                variant="outlined"
                                placeholder={t("enterDelay")}
                                value={delay}
                                size="small"
                                type="number"
                                InputProps={{ inputProps: { min: 1 } }}
                                autoComplete="off"
                                fullWidth
                              />
                              <FormControl fullWidth >
                                <InputLabel>{t("language")}</InputLabel>
                                <Select
                                  value={selectLang}
                                  size="small"
                                  label={t("language")}
                                  onChange={(e) =>
                                    setSelectLang(e.target.value)
                                  }

                                  MenuProps={{
                                    PaperProps: {
                                      sx: {
                                        width: "10%",
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
                                  {/* {langList.map((x, i) => (
                                    <MenuItem
                                      // key={x.key}
                                      value={x.key}
                                    >
                                      {x.name}
                                    </MenuItem>
                                  ))} */}
                                </Select>
                              </FormControl>
                            </Stack>
                          </Grid>
                        </Grid>

                        <Typography variant="button">
                          {t("extractingCol")}
                        </Typography>

                        <Grid container spacing={0}>
                          {columns.map((col, i) => {
                            return (
                              <Grid item xs={6}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={extractCol[col.value]}
                                      onChange={(e) =>
                                        setExtractCol((ec) => {
                                          return {
                                            ...ec,
                                            [col.value]: e.target.checked,
                                          };
                                        })
                                      }
                                    />
                                  }
                                  label={
                                    <Typography variant="body2">
                                      {t(col.label)}
                                    </Typography>
                                  }
                                />
                              </Grid>
                            );
                          })}
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
                            {t("save")}
                          </Button>
                        </Stack>
                      </form>
                    </Box>
                  ) : (
                    <></>
                  )}

                  {selectedTabId == 3 ? (
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6">{t("helpMsg")}</Typography>

                      <Typography variant="caption">
                        {t("contactWithEmail")}
                      </Typography>

                      <List>
                        {product?.contactNumber != "" ? (
                          <ListItem>
                            <ListItemAvatar>
                              <PhoneIcon />
                            </ListItemAvatar>
                            <ListItemText
                              sx={{ my: 0 }}
                              primary={t("phone")}
                              secondary={
                                <Link
                                  underline="none"
                                  href={"tel:" + product?.contactNumber}
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
                        {product?.email != "" ? (
                          <ListItem>
                            <ListItemAvatar>
                              <EmailOutlinedIcon />
                            </ListItemAvatar>
                            <ListItemText
                              sx={{ my: 0 }}
                              primary={t("email")}
                              secondary={
                                <Link
                                  underline="none"
                                  href={"mailto:" + product?.email}
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
                        {product?.siteUrl != "" ? (
                          <ListItem>
                            <ListItemAvatar>
                              <LanguageIcon />
                            </ListItemAvatar>
                            <ListItemText
                              sx={{ my: 0 }}
                              primary={t("website")}
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

                      <Typography variant="h6">{t("disclaimer")}:</Typography>
                      <Typography variant="caption">
                        {t("imCertified ")}
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
                  sx={{ mt: 2 }}
                >
                  <Typography variant="caption">{`V ${localmanifestVersion?.localVersion ?? ""}`}</Typography>

                </Stack>
              </>
            ) : (
              <>
                <Container maxWidth="sm" className="mainBox">
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
                          direction={"column"}
                          sx={{ mt: 2 }}
                          spacing={2}
                        >
                          <Grid item>
                            {licenseMessage != "" ? (
                              <Alert severity="warning">{t(licenseMessage)}</Alert>
                            ) : (
                              <></>
                            )}
                          </Grid>

                          <Grid item>
                            <TextField
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              label={t("name")}
                              size="small"
                              fullWidth
                              variant="outlined"
                              placeholder={t("enterName")}
                              error={name == "" && showValidation}
                              helperText={
                                name == "" && showValidation ? (
                                  <Typography variant="p">
                                    {t("nameRequired")}
                                  </Typography>
                                ) : (
                                  ""
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
                              label={t("emailAddress")}
                              size="small"
                              fullWidth
                              variant="outlined"
                              placeholder={t("enterEmail")}
                              type="email"
                              error={
                                (email == "" || !isEmailIsValid(email)) &&
                                showValidation
                              }
                              helperText={
                                showValidation ? (
                                  email == "" ? (
                                    <Typography variant="p">
                                      {t("emailRequired")}
                                    </Typography>
                                  ) : !isEmailIsValid(email) ? (
                                    <Typography variant="p">
                                      {t("emailInvalid")}
                                    </Typography>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
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
                              error={phone == "" && showValidation}
                              helperText={
                                phone == "" && showValidation ? (
                                  <Typography variant="p">
                                    {t("phoneRequired")}
                                  </Typography>
                                ) : (
                                  ""
                                )
                              }
                            >
                              <PhoneInput
                                country={"in"}
                                value={phone}
                                placeholder={t("enterPhone")}
                                inputStyle={{ width: "inherit" }}
                                onChange={(phone) => setPhone(phone)}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item>
                            <TextField
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              label={t("city")}
                              size="small"
                              fullWidth
                              variant="outlined"
                              placeholder={t("enterCity")}
                              error={city == "" && showValidation}
                              helperText={
                                city == "" && showValidation ? (
                                  <Typography variant="p">
                                    {t("cityRequired")}
                                  </Typography>
                                ) : (
                                  ""
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
                              <InputLabel>{t("country")}</InputLabel>

                              <Select
                                value={country}
                                size="small"
                                label={t("selectCountry")}
                                onChange={(e) => setCountry(e.target.value)}
                                renderValue={(value) => {
                                  return (
                                    <Box sx={{ display: "flex", gap: 1 }}>
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
                                      width: "10%",
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
                                {/* {countryList.map((x, i) => (
                                  <MenuItem
                                    key={x.countryCode}
                                    value={x.countryNameEn}
                                  >
                                    {x.countryNameEn}
                                  </MenuItem>
                                ))} */}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item>
                            <TextField
                              value={key}
                              onChange={(e) => setKey(e.target.value)}
                              label={t("licenseKey")}
                              size="small"
                              placeholder={t("enterLicenseKey")}
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
                                    style={{ marginTop: "5px" }}
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
                              color={keyIsValid ? "success" : null}
                              error={key != "" && keyIsValid == false}
                              // error={
                              //   (key == "" ||
                              //     (keyIsValid == false && key.length == 19)) &&
                              //   showValidation
                              // }
                              helperText={
                                key != "" && keyIsValid == false ? (
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
                              sx={{ cursor: "pointer", mt: -2, mr: 1 }}
                            >
                              <Typography onClick={getTrial} variant="body2" >
                                {t("getTrial")}
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
                              {t("activate")}
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
                                  {t("buyNow")}
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
                </Container>
              </>
            )}
          </Box>
        )}
      </ThemeProvider >
    </>
  );
};

export default Form;
