import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Snackbar from '@mui/material/Snackbar';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Card, CardContent, Link, Slide } from "@mui/material";
import useTitle from "../../../hooks/useTitle";
import PageTitle from "../../../layouts/PageTitle";
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { H3 } from "../../../components/Typography";
import AlertConfirm from "react-alert-confirm";
import { useSnackbar } from "../../../components/Snackbar";
import "react-alert-confirm/lib/style.css";
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useSelector } from "react-redux";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconButton from '@mui/material/IconButton';
import AlarmIcon from '@mui/icons-material/Alarm';
import DateRangeIcon from '@mui/icons-material/DateRange';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}
const today = dayjs();

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: 3,
  borderRadius: "10px",
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Leave = () => {
  const [selectedLeaveStartDate, setSelectedLeaveStartDate] = useState(null);
  const [leavelist, setLeaveList] = useState([]);
  const [emergencyList, setEmergencyList] = useState([]);
  const [stationlist, setStationList] = useState([]);
  const [startTimeList, setStartTimeList] = useState([]);
  const [endTimeList, setEndTimeList] = useState([]);
  const [mangerName, setMangeName] = useState([]);
  const [passbookUploadedFile, setLeaveDocument] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("info");
  const [showLink, setShowLink] = useState(true);
  const user = useSelector((state) => state.loginReducer);

  const [allowedFile, setAllowedFile] = useState('');

  const fileInputRef = useRef(null)
  const handleButtonClick = () => {
    fileInputRef.current.click();
  }
  let selectedFile = []
  const handleFileChange = (event) => {

    const File = event.target.files[0];

    if (!File) {
      return;
    }

    const fileSizeKB = File.size / 1024;

    if (fileSizeKB > 300) {
      console.error("File size exceeded");
      alert("Attachment should be less than 200KB");
      setLeaveDocument(null);
      return;
    }

    const allowedFormats = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedFormats.includes(File.type)) {
      console.log(File.type);
      console.error("Invalid file format");
      alert("Invalid file format. Please choose JPG, PNG, or PDF.");
      setLeaveDocument(null);
      return;
    }

    console.log(File.name)
    //  setSelectedFile(File)

    selectedFile = event.target.files[0];
    setLeaveDocument(selectedFile)
    if (selectedFile) {

      uploadFile()
    }
  }

  const AbsenceBalance = 2.5;

  const validationSchema = Yup.object().shape({
    Leave: Yup.string().required("Leave is Required").nullable(),
    ApplyingDueToAnyEmergency: Yup.string().required("Applying Due To Any Emergency is Required").nullable(),
    StationLeave: Yup.string().required("Station Leave is required").nullable(),
    LeaveStartDate: Yup.string().required("Leave Start Date is required").nullable(),
    LeavestartTime: Yup.string().required("Leave Start Time is required").nullable(),
    LeaveEndDate: Yup.string().required("Leave End Date is required").nullable(),
    LeaveEndTime: Yup.string().required("Leave End Time is required").nullable(),

    Description: Yup.string()
      .required("Description is required")
      .nullable()
      .test('word-count', 'Your word length is greater than 200 words', (value) => {
        if (!value) return true; // Skip validation if the value is empty or null
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount <= 200;
      }),
  });

  const formik = useFormik({
    initialValues: {
      Leave: '',
      ApplyingDueToAnyEmergency: '',
      StationLeave: '',
      LeaveStartDate: null,
      LeavestartTime: "",
      LeaveEndDate: null,
      LeaveEndTime: '',
      Prefix: '',
      Suffix: '',
      ReportingDesignation: '',
      Description: '',
      LeaveVirtualPath: '',
      LeaveFile: '',
      LeaveFileName: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values)
      // handleRedirect();
    },
  });

  const checkValid = () => {
    formik
      .validateForm()
      .then((formErrors) => {
        if (Object.keys(formErrors).length > 0) {

          console.log(Object.keys(formErrors))
          //alert(Object.keys(formErrors))
          // alert("Please fill all the required * fields");
          setToastMessage("Please fill all the required * fields");
          setToastSeverity("error");
          setOpenToast(true);
        } else {
          handleRedirect();
        }
      })
      .catch((err) => {
        // formik.setSubmitting(false);
      });
  };


  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const numberofDays = getNumberOfDays(formik.values.LeaveStartDate, formik.values.LeaveEndDate, formik.values.LeavestartTime, formik.values.LeaveEndTime);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenToast(false);
  };

  useEffect(() => {

    axios.get(`http://129.154.229.83:8095/leavemanagement/leave-from-dropdown`, {
    }).then(response => {
      let sortedStartTimeData = response.data.result.map((value) => {
        return value;
      })
      setStartTimeList(sortedStartTimeData);
      console.log(sortedStartTimeData);
    })
      .catch(error => {
        setStartTimeList([]);
        console.log(error);
      });

    axios.get(`http://129.154.229.83:8095/leavemanagement/leave-to-dropdown`, {
    }).then(response => {
      let sortedEndTimeData = response.data.result.map((value) => {
        return value;
      })
      setEndTimeList(sortedEndTimeData);
      console.log(sortedEndTimeData);
    })
      .catch(error => {
        setEndTimeList([]);
        console.log(error);
      });


    axios.get(`http://129.154.229.83:8095/leavemanagement/leave-type-dropdown`, {
    }).then(response => {
      let sortedLeaveData = response.data.result.map((value) => {
        return value;
      })
      setLeaveList(sortedLeaveData);
      console.log(sortedLeaveData);
    })
      .catch(error => {
        setLeaveList([]);
        console.log(error);
      });

    axios.get(`http://129.154.229.83:8095/leavemanagement/emergency-dropdown`, {
    }).then(response => {
      let sortedEmergencyData = response.data.result.map((value) => {
        return value;
      })
      setEmergencyList(sortedEmergencyData);
      console.log(sortedEmergencyData);
    })
      .catch(error => {
        setEmergencyList([]);
        console.log(error);
      });

    axios.get(`http://129.154.229.83:8095/leavemanagement/station-dropdown`, {
    }).then(response => {
      let sortedStationData = response.data.result.map((value) => {
        return value;
      })
      setStationList(sortedStationData);
      console.log(sortedStationData);
    })
      .catch(error => {
        setStationList([]);
        console.log(error);
      });

    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://129.154.229.83:8095/leavemanagement/get-user-details",
          {
            userId: user.data.userdetails.user.userId,
          }
        );
        // Handle the response data as needed
        console.log(response.data.result.managerName);
        if (response.data.statusCode === 200) {
          setMangeName(response.data.result.managerName)

        }

      } catch (error) {
        // Handle errors
        console.error("Error fetching user details:", error);
      }
    };

    // Call the function when the component is mounted
    fetchData();

  }, [])

  const saveLeaveDetails = async (data) => {

    try {
      const formattedStartDate = dayjs(formik.values.LeaveStartDate).format("YYYY-MM-DD");
      const formattedEndDate = dayjs(formik.values.LeaveEndDate).format("YYYY-MM-DD");

      console.log(formattedStartDate)

      const body = {
        userId: user.data.userdetails.user.userId,
        leaveTypeId: formik.values.Leave,
        rqstFrom: formattedStartDate,
        rqstTimeFrom: formik.values.LeavestartTime,
        rqstTo: formattedEndDate,
        rqstTimeTo: formik.values.LeaveEndTime,
        preffix: "2024-03-21",
        suffix: "2024-03-23",
        isEmergencyLeave: formik.values.ApplyingDueToAnyEmergency,
        isStationLeave: formik.values.StationLeave,
        reason: formik.values.Description,
        filePath: formik.values.LeaveVirtualPath,
        rqstStatus: 67,
      };

      console.log("the saved details  body", body);
      const res = await axios.post(
        `http://129.154.229.83:8095/leavemanagement/new-leave-submit`,
        body

      );
      console.log("the saved details  areeeeee", res);
      if (res.data.statusCode == 200) {
        console.log("the result ", res.data.result);
        // setToastMessage(res.data.message)
        // setToastSeverity("success");
        setOpenToast(true);

        showSnackbar("Saved Successfully", 'success');
        navigate('/viewleave')
        // alert(res.data.message);
        // navigate('/Submitted')
        // navigate('/BasicEmploymentFormPreview')
      }
    } catch (error) {
      alert("Data has not saved", error);
      console.log(error.message);
    }
  };

  const sendpreffixAndsuffix = async (data) => {

    try {
      const formattedStartDate = dayjs(formik.values.LeaveStartDate).format("YYYY-MM-DD");
      const formattedEndDate = dayjs(formik.values.LeaveEndDate).format("YYYY-MM-DD");

      console.log(formattedStartDate)

      const body = {
        userId: user.data.userdetails.user.userId,
        rqstFrom: formattedStartDate,
        rqstTimeFrom: formik.values.LeavestartTime,
        rqstTo: formattedEndDate,
        rqstTimeTo: formik.values.LeaveEndTime,

      };

      console.log("the saved details  body", body);
      const res = await axios.post(
        `http://129.154.229.83:8095/leavemanagement/`,
        body

      );
      console.log("the saved details  areeeeee", res);
      if (res.data.statusCode == 200) {
        console.log("the result ", res.data.result);

        setOpenToast(true);
        showSnackbar("Preffix and suffix Successfully", 'success');

      }
    } catch (error) {
      alert("No data found", error);
      console.log(error.message);
    }
  };

  const uploadFile = async () => {
    var bodyFormData = new FormData();
    console.log(selectedFile)
    bodyFormData.append("file", selectedFile);

    try {
      const res = await axios.post(
        `http://129.154.229.83:8095/leavemanagement/uploadAttachment`,
        bodyFormData,
      );

      if (res.data.statusCode === 200) {
        formik.setFieldValue("LeaveFile", selectedFile);
        formik.setFieldValue("LeaveFileName", selectedFile.name);
        formik.setFieldValue("LeaveVirtualPath", res.data.result[0].virtualPath);
        console.log(res.data)
        setToastMessage(res.data.message)
        setToastSeverity("success");
        setOpenToast(true);
      } else {
        console.log('bad request');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log('kp-UploadedFile Type', formik.values.LeaveFile);
  useEffect(() => {
    if (formik.values.LeaveFile.type === "application/pdf") {
      setAllowedFile('application/pdf');
    }
    else if (formik.values.LeaveFile.type === "image/jpeg") {
      setAllowedFile('image/jpeg');
    }
    else if (formik.values.LeaveFile.type === "image/png") {
      setAllowedFile('image/png')
    }
    else {
      setAllowedFile('');
    }
  }, [formik.values.LeaveFile])
  const showFile = (attachment) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const blob = new Blob([data], { type: allowedFile });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank')
    }
    reader.readAsArrayBuffer(attachment);
  }
  const handleViewDocument = () => {

    if (formik.values.LeaveFile) {
      console.log(formik.values.LeaveFile);
      showFile(formik.values.LeaveFile)
    }
  }

  const filterEndTimeValues = (startTimeId) => {
    if (startTimeId === 155) {
      // If starttimeId is 2, filter out the value with id 2 from time2
      return endTimeList.filter((value) => value.typeId !== 156);
    }
    return endTimeList; // Otherwise, return the original time2 array
  };


  function getNumberOfDays(start, end, startTimeId, endTimeId) {
    if (!start || !end) {
      return 0;
    }

    const date1 = new Date(start);
    const date2 = new Date(end);
    const oneDay = 1000 * 60 * 60 * 24;

    const diffInTime = date2.getTime() - date1.getTime();
    let diffInDays = Math.round(diffInTime / oneDay);


    if (startTimeId === 154 && endTimeId === 156) {
      diffInDays -= 0.5;
    }
    if (startTimeId === 155 && !endTimeId || startTimeId === 155 && endTimeId === 157) {
      diffInDays -= 0.5;
    }

    return diffInDays + 1;
  }

  console.log(numberofDays)
  const title = "Leave Application Form";
  useTitle(title);

  const navigate = useNavigate();

  const handleRedirect = () => {
    callConfirmDialog();
  }

  const { showSnackbar } = useSnackbar();

  const callConfirmDialog = async () => {
    console.log('kp-confirm');
    const [action] = await AlertConfirm({
      title: "Confirm",
      desc: "Are you sure, you want to submit?",
    });
    AlertConfirm.config({
      okText: "Submit",
      cancelText: "Cancel",
    });
    if (action) {
      console.log('kp-saved');

      saveLeaveDetails();
    }

  };
  return (
    <>

      <Box sx={{ flexGrow: 1 }}>
        <Stack sx={{ width: '100%' }} spacing={0}>
          {numberofDays > AbsenceBalance && (
            <Alert severity="warning">You have only {AbsenceBalance} Days leave. A loss of Pay for {numberofDays - AbsenceBalance} days will be deducted from your Salary Balance</Alert>
          )}
        </Stack>
      </Box>

      <Box>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <Snackbar
              open={openToast}
              autoHideDuration={6000}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={handleClose}
              TransitionComponent={TransitionLeft}
            >
              <Alert onClose={handleClose} severity={toastSeverity}
                sx={{
                  width: '100%',
                  padding: { sm: '15px', xs: '10px' },
                  borderRadius: '15px',
                  fontSize: { sm: '16px', xs: '14px' },
                  boxShadow: "0 0 10px #999",
                  marginTop: { sm: '25px', xs: '20px' }
                }}>
                {toastMessage}
              </Alert>
            </Snackbar>
          </div>
          <Card>
            <CardContent>
              <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf", marginBottom: "20px" }}>
                <EventBusyIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
                <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Apply Leave</H3>
              </div>
              <Grid item xs={12} sm={4} md={6} lg={6} >
                <Autocomplete
                  margin="0"
                  id="Leave"
                  name="Leave"
                  options={leavelist}
                  sx={{ width: "100%" }}
                  required
                  fullWidth
                  value={leavelist.find(
                    (option) => option.typeId === formik.values.Leave
                  ) || null}
                  onChange={(e, value) => {
                    if (value === null) {
                      formik.setFieldValue("Leave", null)
                    }
                    else

                      formik.setFieldValue("Leave", value.typeId)
                  }}
                  getOptionLabel={(value) => value.typeName}
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      label="Leave Type"
                      required
                      size="small"
                      onBlur={formik.handleBlur}
                      helperText={formik.errors.Leave && formik.touched.Leave ? formik.errors.Leave : null}
                      error={formik.errors.Leave && formik.touched.Leave ? true : false}

                    />}
                />

              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <hr
                  style={{
                    background: "#000000",
                    height: "1px",
                    border: "none",
                  }}
                />
                <Stack direction="row" spacing={1} sx={{ float: 'right' }}>
                  <IconButton color="secondary" aria-label="add an alarm">
                    <WorkHistoryIcon />
                    <Typography sx={{ float: 'right', ml: 1 }}> Absence Balance {AbsenceBalance} DAYS.</Typography>
                  </IconButton>
                </Stack>


              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Grid
                container
                spacing={2}
                direction="row"
                alignItems="center"
              // justifyContent="center"
              // sx={{}}
              >
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
                    <DatePicker
                      id="LeaveStartDate"
                      name="LeaveStartDate"
                      minDate={today}
                      format="DD/MM/YYYY"
                      label="Leave Start Date"
                      slotProps={{ textField: { size: 'small' } }}
                      sx={{ width: "100%" }}
                      // inputFormat="DD/MM/YYYY"
                      value={formik.values.LeaveStartDate}
                      onChange={(date) => {
                        const formattedDate = dayjs(date).format("MM-DD-YYYY");
                        formik.setFieldValue("LeaveStartDate", formattedDate);
                        setSelectedLeaveStartDate(date);
                      }}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          fullWidth
                          margin="0"
                          required
                          {...params}
                          error={formik.touched.LeaveStartDate && Boolean(formik.errors.LeaveStartDate)}
                          helperText={formik.touched.LeaveStartDate && formik.errors.LeaveStartDate}
                          onBlur={formik.handleBlur}

                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} >
                  <Autocomplete
                    margin="0"
                    id="LeavestartTime"
                    name="LeavestartTime"
                    options={startTimeList}
                    sx={{ width: "100%" }}
                    fullWidth

                    value={startTimeList.find(
                      (option) => option.typeId === formik.values.LeavestartTime
                    ) || null}
                    onChange={(e, value) => {
                      if (value === null) {
                        formik.setFieldValue("LeavestartTime", null)
                      }
                      else

                        formik.setFieldValue("LeavestartTime", value.typeId);
                      formik.setFieldValue("LeaveEndTime", null)

                    }}
                    getOptionLabel={(value) => value.typeName}
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="Time"
                        size="small"
                        required
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.LeavestartTime && formik.touched.LeavestartTime ? formik.errors.LeavestartTime : null}
                        error={formik.errors.LeavestartTime && formik.touched.LeavestartTime ? true : false}

                      />}
                  />
                </Grid>

              </Grid>
              <Grid
                container
                spacing={2}
                direction="row"
                alignItems="center"
              // justifyContent="center"
              // sx={{}}
              >
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
                    <DatePicker
                      margin="0"
                      id="LeaveEndDate"
                      name="LeaveEndDate"
                      minDate={today}
                      slotProps={{ textField: { size: 'small' } }}
                      shouldDisableDate={(date) =>
                        selectedLeaveStartDate ? date < selectedLeaveStartDate : false
                      }
                      label="Leave End Date"
                      sx={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      value={formik.values.LeaveEndDate}
                      onChange={(date) => {
                        const formattedDate = dayjs(date).format("MM-DD-YYYY");
                        formik.setFieldValue("LeaveEndDate", formattedDate);
                      }}
                      renderInput={(params) => (
                        <TextField margin="0"
                          required
                          {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4} >
                  <Autocomplete
                    margin="0"
                    id="LeaveEndTime"
                    name="LeaveEndTime"
                    options={filterEndTimeValues(formik.values.LeavestartTime)} // Use the filtered values
                    sx={{ width: "100%" }}
                    fullWidth

                    value={endTimeList.find(
                      (option) => option.typeId === formik.values.LeaveEndTime
                    ) || null}
                    onChange={(e, value) => {
                      if (value === null) {
                        formik.setFieldValue("LeaveEndTime", null)
                      }
                      else
                        formik.setFieldValue("LeaveEndTime", value.typeId)
                    }}
                    getOptionLabel={(value) => value.typeName}
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="Time"
                        size="small"
                        required
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.LeaveEndTime && formik.touched.LeaveEndTime ? formik.errors.LeaveEndTime : null}
                        error={formik.errors.LeaveEndTime && formik.touched.LeaveEndTime ? true : false}
                      />}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}
                direction="row"
                alignItems="center"
              // justifyContent="center"
              // sx={{}}
              >

                <Grid item xs={12} sm={12} md={12} lg={12} >
                  <Stack direction="row" spacing={1} sx={{ float: 'right' }}>
                    <IconButton color="secondary" aria-label="add an alarm">
                      <DateRangeIcon />
                      <Typography sx={{ float: 'right', ml: 1 }}> Absence Duration {numberofDays} DAYS.</Typography>
                    </IconButton>

                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <hr
                    style={{

                      background: "#000000",
                      height: "1px",
                      border: "none",
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={4} lg={4}>

                  <TextField
                    margin="0"
                    fullWidth
                    id="Prefix"
                    label="Prefix"
                    name="Prefix"
                    disabled
                    size="small"
                  />

                </Grid>


                <Grid item xs={12} sm={4} md={4} lg={4}>

                  <TextField
                    margin="0"
                    fullWidth
                    id="Suffix"
                    label="Suffix"
                    name="Suffix"
                    disabled
                    size="small"
                  />

                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4} sx={{ mb: 2 }}>

                  <Button variant="outlined" color="primary" sx={{ borderRadius: '4px' }}
                  >
                    Calculate preffix & Suffix</Button>

                </Grid>

              </Grid>

              <Grid
                container
                spacing={2}
                direction="row"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Autocomplete
                    margin="0"
                    id="ApplyingDueToAnyEmergency"
                    name="ApplyingDueToAnyEmergency"
                    options={emergencyList}
                    sx={{ width: "100%" }}
                    required
                    fullWidth
                    value={emergencyList.find(
                      (option) => option.typeValue === formik.values.ApplyingDueToAnyEmergency
                    ) || null}
                    onChange={(e, value) => {
                      if (value === null) {
                        formik.setFieldValue("ApplyingDueToAnyEmergency", null)
                      }
                      else
                        formik.setFieldValue("ApplyingDueToAnyEmergency", value.typeValue)
                    }}
                    getOptionLabel={(value) => value.typeName}
                    renderInput={(params) =>
                      <TextField {...params}
                        label="Applying due to any emergency?"
                        required
                        size="small"
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.ApplyingDueToAnyEmergency && formik.touched.ApplyingDueToAnyEmergency ? formik.errors.ApplyingDueToAnyEmergency : null}
                        error={formik.errors.ApplyingDueToAnyEmergency && formik.touched.ApplyingDueToAnyEmergency ? true : false}
                      />}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Autocomplete
                    margin="0"
                    id="StationLeave"
                    name="StationLeave"
                    options={stationlist}
                    sx={{ width: "100%" }}
                    fullWidth
                    value={stationlist.find(
                      (option) => option.typeValue === formik.values.StationLeave
                    ) || null}
                    onChange={(e, value) => {
                      if (value === null) {
                        formik.setFieldValue("StationLeave", null)
                      }
                      else

                        formik.setFieldValue("StationLeave", value.typeValue)
                    }}
                    getOptionLabel={(value) => value.typeName}
                    renderInput={(params) => (
                      <TextField {...params}
                        margin="0"
                        label="Station Leave"
                        required
                        size="small"
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.StationLeave && formik.touched.StationLeave ? formik.errors.StationLeave : null}
                        error={formik.errors.StationLeave && formik.touched.StationLeave ? true : false}

                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>

                  <TextField
                    margin="0"
                    fullWidth
                    id="ReportingDesignation"
                    label="Reporting User"
                    name="ReportingDesignation"
                    value={mangerName}
                    disabled

                    size="small"
                  />

                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                direction="row"
                alignItems="center"

              >
                <Grid item xs={12} sm={4} md={4} lg={8}>
                  <TextField
                    margin="0"
                    required
                    fullWidth
                    multiline
                    rows={4}
                    id="Description"
                    label="Reason/Description"
                    name="Description"
                    value={formik.values.Description || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.Description &&
                      Boolean(formik.errors.Description)
                    }
                    helperText={
                      formik.touched.Description &&
                      formik.errors.Description
                    }

                  />

                </Grid>


                <Grid item xs={12} sm={6} md={6} lg={6} sx={{ mb: '15px' }}>

                  <Button
                    sx={{ borderRadius: '4px' }}
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    onClick={handleButtonClick}
                  >
                    Upload Document
                    {/* <VisuallyHiddenInput type="file" /> */}
                  </Button>

                  <VisuallyHiddenInput
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                  />
                  <Button variant="outlined" sx={{ borderRadius: '4px', marginLeft: '8px' }} component="label" disabled={!formik.values.LeaveFile ?? true} onClick={handleViewDocument}>
                    View Document
                  </Button>
                  {formik.values.LeaveFile && (
                    <>
                      {showLink === true ? (

                        <Typography>Uploaded File: {formik.values.LeaveFileName}</Typography>

                      ) : (
                        <Typography sx={{ color: 'green', fontSize: '12px' }}>
                          Uploaded File: {formik.values.LeaveFileName}
                        </Typography>
                      )}
                    </>
                  )}

                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ width: '100%' }}>
                  <Button type="submit" variant="contained" sx={{ float: 'right', borderRadius: '4px' }}
                    // onClick={handleRedirect}
                    onClick={() => {
                      // saveLeaveDetails();
                      checkValid();
                    }}

                  >
                    Submit</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Box>

    </>
  );
}

export default Leave;
