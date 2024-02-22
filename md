import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Card, CardContent } from "@mui/material";
import useTitle from "../../../hooks/useTitle";
import PageTitle from "../../../layouts/PageTitle";
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { H3 } from "../../../components/Typography";
import AlertConfirm from "react-alert-confirm";
import { useSnackbar } from "../../../components/Snackbar";
import "react-alert-confirm/lib/style.css";
import Calendar from '@mui/icons-material/Event';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { green, pink } from '@mui/material/colors';
import PageviewIcon from '@mui/icons-material/Pageview';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import moment from 'moment';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useSelector } from "react-redux";
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
  const user = useSelector((state) => state.loginReducer);

  const AbsenceBance = 2.5;


  const validationSchema = Yup.object().shape({
    Leave: Yup.string().required("Leave is Required").nullable(),
    ApplyingDueToAnyEmergency: Yup.string().required("Applying Due To Any Emergency is Required").nullable(),
    StationLeave: Yup.string().required("Station Leave is required").nullable(),
    LeaveStartDate: Yup.string().required("Leave Start Date is required").nullable(),
    // LeavestartTime: Yup.string().required("Leave Start Time is required").nullable(),
    LeaveEndDate: Yup.string().required("Leave End Date is required").nullable(),
    // LeaveEndTime: Yup.string().required("Leave End Time is required").nullable(),
    Prefix: Yup.string().required("Prefix is required").nullable(),
    Suffix: Yup.string().required("Suffix is required").nullable(),
    ReportingDesignation: Yup.string().required("Reporting Designation is required").nullable(),
    Description: Yup.string().required("Description is required").nullable(),
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
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const isEmergency = values.ApplyingDueToAnyEmergency === 1;
      formik.setFieldValue("ApplyingDueToAnyEmergency", isEmergency);
      if (values.ApplyingDueToAnyEmergency === 2) {
        formik.setFieldValue("ApplyingDueToAnyEmergency", false);
      }
      handleRedirect();
    },
  });
  
  console.log(user);
  console.log(formik.values.Leave);
  console.log(formik.values.LeaveStartDate);
  console.log(formik.values.LeaveEndDate);
  console.log(formik.values.LeavestartTime);
  console.log(formik.values.LeaveEndTime);
  console.log(formik.values.ApplyingDueToAnyEmergency);
  console.log(formik.values.StationLeave);
  const numberofDays = getNumberOfDays(formik.values.LeaveStartDate, formik.values.LeaveEndDate, formik.values.LeavestartTime, formik.values.LeaveEndTime);

  useEffect(() => {

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


  }, [])

   
  const filterEndTimeValues = (startTimeId) => {
    if (startTimeId === 2) {
      // If starttimeId is 2, filter out the value with id 2 from time2
      return time2.filter((value) => value.id !== 2);
    }
    return time2; // Otherwise, return the original time2 array
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


    if (startTimeId === 1 && endTimeId === 2) {
      diffInDays -= 0.5;
    }
    if (startTimeId === 2 && !endTimeId || startTimeId === 2 && endTimeId === 3) {
      diffInDays -= 0.5;
    }
    // if(startTimeId ===2){
    //   formik.setFieldValue("LeaveEndTime", null);
    // }

    return diffInDays + 1;
  }

  console.log(numberofDays)

  const time = [
    {
      id: 1,
      label: "10 AM",
    },
    {
      id: 2,
      label: " 1 PM",
    },
  ];
  const time2 = [
    {
      id: 2,
      label: "1 PM",
    },
    {
      id: 3,
      label: " 6 PM",
    },
  ];

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
      showSnackbar("Saved Successfully", 'success');
      navigate('/viewleave')
      // submitDetails(values, resetForm);
    } else {
      //   setIsSubmit(false);
      showSnackbar('Did not save!', 'error')
    }
  };
  return (
    <>

      <Box sx={{ flexGrow: 1 }}>
        <Stack sx={{ width: '100%' }} spacing={0}>
          {numberofDays > AbsenceBance && (
            <Alert severity="warning">You have only {AbsenceBance} Days leave. A loss of Pay for {numberofDays - AbsenceBance} days will be deducted from your Salary Balance</Alert>
          )}
        </Stack>
      </Box>

      <Box sx={{ flexGrow: 1, mt: 2 }}>
        <Grid container spacing={2} columns={16}>
          <Grid item xs={8}>
            <Item>
              <Grid container spacing={2}>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="h4" component="div">
                        Absence Type Balance
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {AbsenceBance}  DAYS
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ cursor: 'pointer' }} variant="body2">
                        Check here!
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Avatar sx={{ bgcolor: green[500] }}>
                      <AssignmentIcon />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
            </Item>
          </Grid>
          <Grid item xs={8}>
            <Item>
              <Grid container spacing={2}>

                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="h4" component="div">
                        Absence Duration
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {numberofDays} DAYS
                      </Typography>

                    </Grid>
                    <Grid item>
                      <Typography sx={{ cursor: 'pointer' }} variant="body2">
                        Check here!
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Avatar sx={{ bgcolor: pink[500] }}>
                      <HourglassBottomIcon />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
            </Item>
          </Grid>
        </Grid>
      </Box>


      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf" }}>
            <EventBusyIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
            <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Apply Leave</H3>
          </div>
          <Box>
            <form onSubmit={formik.handleSubmit}>
              <Grid
                container
                spacing={2}
                direction="row"
                alignItems="center"
              // justifyContent="center"
              // sx={{}}
              >
                <Grid item xs={12} sm={4} md={4} lg={4}>
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
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.Leave && formik.touched.Leave ? formik.errors.Leave : null}
                        error={formik.errors.Leave && formik.touched.Leave ? true : false}

                      />}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={4} md={4} lg={3}>
              <p></p>
            </Grid> */}
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
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.StationLeave && formik.touched.StationLeave ? formik.errors.StationLeave : null}
                        error={formik.errors.StationLeave && formik.touched.StationLeave ? true : false}

                      />
                    )}
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
                {/* <Grid item xs={12} sm={4} md={4} lg={4}>
 
              </Grid> */}
                {/* <Grid item xs={12} sm={4} md={4} lg={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
                  <DatePicker
                    margin="0"
                    id="LeaveStartDate"
                    name="LeaveStartDate"
                    minDate={today}
                    label="Leave Start Date"
                    sx={{ width: "100%" }}
                    inputFormat="DD/MM/YYYY"
                    value={formik.values.LeaveStartDate}
                    onChange={(date) => {
                      const formattedDate = (dayjs(date).format("MM-DD-YYYY"));
                      formik.setFieldValue("LeaveStartDate", formattedDate)
                    }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        margin="0"
                        required
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid> */}
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
                    <DatePicker
                      id="LeaveStartDate"
                      name="LeaveStartDate"
                      minDate={today}
                      format="DD/MM/YYYY"
                      label="Leave Start Date"
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

                <Grid item xs={12} sm={4} md={4} lg={4} >
                  <Autocomplete
                    margin="0"
                    id="LeavestartTime"
                    name="LeavestartTime"
                    options={time}
                    sx={{ width: "100%" }}

                    fullWidth
                    value={time.find(
                      (option) => option.id === formik.values.LeavestartTime
                    ) || null}
                    onChange={(e, value) => {
                      if (value === null) {
                        formik.setFieldValue("LeavestartTime", null)
                      }
                      else

                        formik.setFieldValue("LeavestartTime", value.id)
                    }}
                    getOptionLabel={(value) => value.label}
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="Time"
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

                {/* <Grid item xs={12} sm={4} md={4} lg={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
                  <DatePicker
                    margin="0"
                    id="LeaveEndDate"
                    name="LeaveEndDate"
                    // minDate={formik.values.LeaveStartDate}
                    shouldDisableDate={(day) =>{
                      return dayjs(day).isBefore(formik.values.LeaveStartDate,'day');
                    }}
                    // shouldDisableDate={isWeekend}
                    label="Leave End Date"
                    sx={{ width: "100%" }}
                    // maxDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    value={formik.values.LeaveEndDate}
                    onChange={(date) => {
                      const formatDate = (dayjs(date).format("MM-DD-YYYY"));
                      formik.setFieldValue("LeaveEndDate", formatDate)
                    }}
                    renderInput={(params) => (
                      <TextField
                        margin="0"
                        required

                        {...params}

                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid> */}
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
                    <DatePicker
                      margin="0"
                      id="LeaveEndDate"
                      name="LeaveEndDate"
                      minDate={today}
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
                        <TextField margin="0" required {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                {/* <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Autocomplete
                    margin="0"
                    id="LeaveEndTime"
                    name="LeaveEndTime"
                    options={time2}
                    sx={{ width: "100%" }}
                    required
                    fullWidth
                    value={time2.find(
                      (option) => option.id === formik.values.LeaveEndTime
                    ) || null}
                    onChange={(e, value) => {
                      if (value === null) {
                        formik.setFieldValue("LeaveEndTime", null)
                      }
                      else

                        formik.setFieldValue("LeaveEndTime", value.id)
                    }}
                    getOptionLabel={(value) => value.label}
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="Time"
                        required
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.LeaveEndTime && formik.touched.LeaveEndTime ? formik.errors.LeaveEndTime : null}
                        error={formik.errors.LeaveEndTime && formik.touched.LeaveEndTime ? true : false}

                      />}
                  />
                </Grid> */}

                <Grid item xs={12} sm={4} md={4} lg={4} >
                  <Autocomplete
                    margin="0"
                    id="LeaveEndTime"
                    name="LeaveEndTime"
                    options={filterEndTimeValues(formik.values.LeavestartTime)} // Use the filtered values
                    sx={{ width: "100%" }}
                    fullWidth
                    value={time2.find(
                      (option) => option.id === formik.values.LeaveEndTime
                    ) || null}
                    onChange={(e, value) => {
                      if (value === null) {
                        formik.setFieldValue("LeaveEndTime", null)
                      }
                      else
                        formik.setFieldValue("LeaveEndTime", value.id)
                    }}
                    getOptionLabel={(value) => value.label}
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="Time"
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

                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <TextField
                    margin="0"
                    fullWidth
                    disabled
                    id="Prefix"
                    label="Prefix"
                    name="Prefix"
                  // value={formik.values.Prefix || ""}
                  // onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  // error={
                  //   formik.touched.Prefix &&
                  //   Boolean(formik.errors.Prefix)
                  // }
                  // helperText={
                  //   formik.touched.Prefix &&
                  //   formik.errors.Prefix
                  // }

                  />

                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>

                  <TextField
                    margin="0"

                    fullWidth
                    disabled
                    id="Suffix"
                    label="Suffix"
                    name="Suffix"
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>

                  <TextField
                    margin="0"
                    fullWidth
                    id="ReportingDesignation"
                    label="Reporting User"
                    name="ReportingDesignation"
                    defaultValue="Sudha"
                    value="Sudha"
                    disabled


                  />

                </Grid>
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


                <Grid item xs={12} sm={4} md={4} lg={4} sx={{ mb: '15px' }}>
                  <input type="file" />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ width: '100%' }}>
                  <Button type="submit" variant="contained" sx={{ float: 'right', borderRadius: '4px' }} onClick={handleRedirect}>Submit</Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default Leave;



{
            "url": "http://129.154.229.83:8095/leavemanagement/get-user-details",
            "method": "POST",
            "body": {
                "userId": 83,
            },
        },
