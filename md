let formattedStartDate = null;

  // Check if LeaveStartDate is not selected or not present in formik.values
  if (!formik.values.LeaveStartDate || !formik.values.LeaveStartDate) {
    formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
  } else {
    formattedStartDate = dayjs(formik.values.LeaveStartDate).format("YYYY-MM-DD");
  }

  let formattedEndDate = null;

  // Check if LeaveEndDate is not selected or not present in formik.values
  if (!formik.values.LeaveEndDate || !formik.values.LeaveEndDate) {
    formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");
  } else {
    formattedEndDate = dayjs(formik.values.LeaveEndDate).format("YYYY-MM-DD");
  }

  // Determine the value to pass for approvedTimeTo
  let approvedTimeTo = null;
  if (!formik.values.LeaveEndTime) {
    approvedTimeTo = startTime;
  } else {
    approvedTimeTo = formik.values.LeaveEndTime;
  }
  




import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Routes, Route, useNavigate } from "react-router-dom";
import { sha256 } from "js-sha256";

import logo_left from "../../assets/images/logo_left.png";
import logo_right from "../../assets/images/logo_right.png";
import { TextFields } from "@mui/icons-material";
import blue_bg from "../../assets/images/BLUE_BG.jpg";
import { border } from "@mui/system";
import { grey } from "@mui/material/colors";
import { useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/actions/LoginAction";
import { styled } from "@mui/material";
//
import Toast from "../../components/Toast/Toast";
import { useSnackbar } from "../../components/Snackbar";

const drawerWidth = 280;

const Footer = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,

    duration: theme.transitions.duration.leavingScreen,
  }),

  width: "100%",

  position: "fixed",

  top: "unset",

  bottom: 0,

  color: "white",

  backgroundColor: "black",

  textAlign: "center",

  size: "8px",

  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,

    marginLeft: `${drawerWidth}px`,

    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,

      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://www.ysraarogyasri.ap.gov.in/"
        target="_blank"
      >
        Dr.YSR Aarogyasri Health Care Trust
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Login() {
  const { showSnackbar } = useSnackbar();
  const showMessage = useSelector((state) => state.showMessageReducer);
  //const [salt, setSalt] = useState("");
  // const  hash = sha256.create();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emptyPass, setEmptyPass] = useState(false);
  const [emptyUsername, setEmptyUsername] = useState(false);
  const data = useSelector((state) => state.loginReducer);
  console.log(data);
  const navigateToHome = () => {
    navigate("/home");
  };

  const usernameRef = useRef();
  const passwordRef = useRef();
  let salt = "";
  // const createHmac = (salt, plainText)=>{
  //  let hmac = sha256.hmac(salt, plainText);
  //   return hmac.toString();
  // }

  const hashPassword = (passwordPlainText) => {
    var plainText = passwordPlainText;
    salt = randomString();
    let hash = sha256.hmac(salt, plainText);
    // console.log(hash)
    passwordRef.current.value = hash;
  };

  const randomString = () => {
    let length = 100;
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (usernameRef.current.value === "" && passwordRef.current.value === "") {
      setEmptyUsername(true);
      setEmptyPass(true);
    } else {
      if (usernameRef.current.value === "") {
        setEmptyUsername(true);
        setEmptyPass(false);
      } else if (passwordRef.current.value === "") {
        setEmptyPass(true);
        setEmptyUsername(false);
      }
    }

    if (usernameRef.current.value !== "" && passwordRef.current.value !== "") {
      hashPassword(passwordRef.current.value);
      console.log(passwordRef.current.value);

      let request = {
        username: usernameRef.current.value,
        password: passwordRef.current.value.trim(),
        password2: salt,
      };
      setEmptyPass(false);
      setEmptyUsername(false);
      console.log(request);
      dispatch(loginUser(request, successCb));
    }
  };

  const successCb = (response) => {
    console.log("Inside successCB");
    //navigate("/home");
    try {
      if (
        response.data.status === true ||
        response.data.statusCode === "200" ||
        response.data.status === "SUCCESS"
      ) {
        showSnackbar("Login Successful", "success");
        navigate("/home");
      } else if (
        response.data.statusCode === 400 ||
        response.data.status === false
      ) {
        //setLoading(false);
        showSnackbar(response.data.message, "error");
        navigate("/");
      } else {
        showSnackbar("Opps, something went wrong", "error");
        navigate("/");
      }
    } catch (error) {
      showSnackbar("Opps, something went wrong", "error");
      console.log(error.message);
      navigate("/");
    }
  };

  return (
    <>
      {/* {showMessage.showMessage.title && (
        <>
          <Toast
            title={showMessage.showMessage.title}
            variant={showMessage.showMessage.variant}
            description={showMessage.showMessage.description}
            linkText={showMessage.showMessage.linkText}
            link={showMessage.showMessage.link}
          />
        </>
      )} */}

      {/* <Grid container component="main" sx={{ height: "100vh" }}> */}
      <Box

        sx={{
          backgroundImage: `url(${blue_bg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
         
        }}
      >
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          sx={{ mx: 3 }}
        >
          <Grid container>
            {/* <Grid
              item
              xs={12}
              sm={5}
              sx={{
                // height: "80vh", //remove
                spacing: 0,
                backgroundColor: "#F1F8FF",
                borderRight: "1px solid #CDE6FF",
                borderRadius: "5px 0 0 5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingRight: 2,
              }}
            >
              <Grid
                md={8}
                xs={6}
                // component="img"
                // alt="The house from the offer."
                //src={logo_left}
              // margin={"15%"}
              // display='flex'
              // placeItems='center'
              // justifyContent='center'
              // alignItems='center'
              />
            </Grid> */}
            <Grid
              item
              xs={12}
              sm={7}
              sx={{
                // height: "80vh",//rem
                spacing: 0,
                backgroundColor: "white",
                borderRight: "1px solid #CDE6FF",
                borderRadius: "0 5px 5px 0",
              }}
            >
              <Box
                component={"form"}
                onSubmit={handleSubmit}
                display="flex"
                justifyContent="center"
              >
                <Grid m={4}>
                  <Grid
                    xs={12}
                    md={12}
                    //component="img"
                    //alt="The house from the offer."
                    //src={logo_right}
                  />
                  <Grid item xs={12} md={12}>
                    <Typography
                      variant="body1"
                      my={2}
                      fontWeight={500}
                      fontFamily="Lato, sans-serif"
                    >
                      ADMIN
                    </Typography>
                    <Grid item md={12} xs={12}>
                      <Grid item md={12} xs={10}>
                        <TextField
                          id="outlined-basic"
                          placeholder="User Id"
                          variant="outlined"
                          fullWidth
                          inputRef={usernameRef}
                          sx={{
                            border: "1px solid #EAEDF1",
                            borderRadius: "5px",
                          }}
                          size="small"
                          error={emptyUsername}
                          helperText={
                            emptyUsername ? "User Id is required" : null
                          }
                        />
                      </Grid>
                      <Grid item md={12} xs={10} mt={1}>
                        <TextField
                          id="outlined-basic"
                          placeholder="Password"
                          variant="outlined"
                          type="password"
                          fullWidth
                          inputRef={passwordRef}
                          sx={{
                            border: "1px solid #EAEDF1",
                            borderRadius: "5px",
                          }}
                          size="small"
                          error={emptyPass}
                          helperText={emptyPass ? "Password is required" : null}
                        />
                      </Grid>
                    </Grid>
                    <Grid container display="flex" sx={{ ml: 4 }} justifyContent="right">
                      <Link style={{ textDecoration: "none", cursor: 'pointer' }} onClick={() => { navigate("/forgotpassword") }} >Forgot Password?</Link>
                    </Grid>
                    <Grid container display="flex" justifyContent="center">

                      <Button
                        variant="contained"
                        type="submit"
                        sx={{
                          backgroundColor: "#2169B2",
                          padding: "12px 51px",
                          borderRadius: "5px",
                        }}
                      >
                        LOGIN
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Footer position="fixed">
        <Typography noWrap component="div">
          {/* CMS {location.pathname} */}
          &copy; Site maintained by KPMG Advisory Services Pvt. Ltd. The
          contents are owned by Govt. Of AP , India.
        </Typography>
      </Footer>
      {/* </Grid> */}
    </>
  );
}

























import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Routes, Route, useNavigate } from "react-router-dom";
import { sha256 } from "js-sha256";

import logo_left from "../../assets/images/logo_left.png";
import logo_right from "../../assets/images/logo_right.png";
import { TextFields } from "@mui/icons-material";
import blue_bg from "../../assets/images/BLUE_BG.jpg";
import { border } from "@mui/system";
import { grey } from "@mui/material/colors";
import { useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/actions/LoginAction";
import { styled } from "@mui/material";
//
import Toast from "../../components/Toast/Toast";
import { useSnackbar } from "../../components/Snackbar";

const drawerWidth = 280;

const Footer = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,

    duration: theme.transitions.duration.leavingScreen,
  }),

  width: "100%",

  position: "fixed",

  top: "unset",

  bottom: 0,

  color: "white",

  backgroundColor: "black",

  textAlign: "center",

  size: "8px",

  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,

    marginLeft: `${drawerWidth}px`,

    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,

      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://www.ysraarogyasri.ap.gov.in/"
        target="_blank"
      >
        Dr.YSR Aarogyasri Health Care Trust
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Login() {
  const { showSnackbar } = useSnackbar();
  const showMessage = useSelector((state) => state.showMessageReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emptyPass, setEmptyPass] = useState(false);
  const [emptyUsername, setEmptyUsername] = useState(false);
  const data = useSelector((state) => state.loginReducer);
  console.log(data);
  const navigateToHome = () => {
    navigate("/home");
  };

  const usernameRef = useRef();
  const passwordRef = useRef();
  let salt = "";

  const hashPassword = (passwordPlainText) => {
    var plainText = passwordPlainText;
    salt = randomString();
    let hash = sha256.hmac(salt, plainText);
    passwordRef.current.value = hash;
  };

  const randomString = () => {
    let length = 100;
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (usernameRef.current.value === "" && passwordRef.current.value === "") {
      setEmptyUsername(true);
      setEmptyPass(true);
    } else {
      if (usernameRef.current.value === "") {
        setEmptyUsername(true);
        setEmptyPass(false);
      } else if (passwordRef.current.value === "") {
        setEmptyPass(true);
        setEmptyUsername(false);
      }
    }

    if (usernameRef.current.value !== "" && passwordRef.current.value !== "") {
      hashPassword(passwordRef.current.value);
      let request = {
        username: usernameRef.current.value,
        password: passwordRef.current.value.trim(),
        password2: salt,
      };
      setEmptyPass(false);
      setEmptyUsername(false);
      dispatch(loginUser(request, successCb));
    }
  };

  const successCb = (response) => {
    console.log("Inside successCB");
    try {
      if (
        response.data.status === true ||
        response.data.statusCode === "200" ||
        response.data.status === "SUCCESS"
      ) {
        showSnackbar("Login Successful", "success");
        navigate("/home");
      } else if (
        response.data.statusCode === 400 ||
        response.data.status === false
      ) {
        showSnackbar(response.data.message, "error");
        navigate("/");
      } else {
        showSnackbar("Opps, something went wrong", "error");
        navigate("/");
      }
    } catch (error) {
      showSnackbar("Opps, something went wrong", "error");
      console.log(error.message);
      navigate("/");
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: `url(${blue_bg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={4} // Add padding
          width={{ xs: "90%", sm: "70%", md: "50%" }} // Set dynamic width
          height="auto" // Set dynamic height
          bgcolor="background.paper" // Set background color
          borderRadius={8} // Add border radius for rounded corners
        >
          <Grid container>
            <Grid item xs={12} md={12}>
              <Typography
                variant="body1"
                my={2}
                fontWeight={500}
                fontFamily="Lato, sans-serif"
              >
                ADMIN
              </Typography>
              <TextField
                id="outlined-basic"
                placeholder="User Id"
                variant="outlined"
                fullWidth
                inputRef={usernameRef}
                sx={{
                  border: "1px solid #EAEDF1",
                  borderRadius: "5px",
                }}
                size="small"
                error={emptyUsername}
                helperText={emptyUsername ? "User Id is required" : null}
              />
              <TextField
                id="outlined-basic"
                placeholder="Password"
                variant="outlined"
                type="password"
                fullWidth
                inputRef={passwordRef}
                sx={{
                  border: "1px solid #EAEDF1",
                  borderRadius: "5px",
                  mt: 1,
                }}
                size="small"
                error={emptyPass}
                helperText={emptyPass ? "Password is required" : null}
              />
              <Grid container display="flex" justifyContent="right" mt={1}>
                <Link
                  style={{ textDecoration: "none", cursor: "pointer" }}
                  onClick={() => {
                    navigate("/forgotpassword");
                  }}
                >
                  Forgot Password?
                </Link>
              </Grid>
              <Grid container display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: "#2169B2",
                    padding: "12px 51px",
                    borderRadius: "5px",
                  }}
                >
                  LOGIN
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer position="fixed">
        <Typography noWrap component="div">
          &copy; Site maintained by KPMG Advisory Services Pvt. Ltd. The
          contents are owned by Govt. Of AP , India.
        </Typography>
      </Footer>
    </>
  );
}
