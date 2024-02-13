import React from "react";
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
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { green, pink } from '@mui/material/colors';
import PageviewIcon from '@mui/icons-material/Pageview';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import moment from 'moment';



const today = dayjs();
const isWeekend = (date) => {
  const day = date.day();

  return day === 0 || day === 6;
};
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

  const validationSchema = Yup.object().shape({
    Leave: Yup.string().required("Leave is Required").nullable(),
    ApplyingDueToAnyEmergency: Yup.string().required("Applying Due To Any Emergency is Required").nullable(),
    StationLeave: Yup.string().required("Station Leave is required").nullable(),
    LeaveStartDate: Yup.string().required("Leave Start Date is required").nullable(),
    LeavestartTime: Yup.string().required("Leave Start Time is required").nullable(),
    LeaveEndDate: Yup.string().required("Leave End Date is required").nullable(),
    LeaveEndTime: Yup.string().required("Leave End Time is required").nullable(),
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
      LeavestartTime: '',
      LeaveEndDate: '',
      LeaveEndTime: '',
      Prefix: '',
      Suffix: '',
      ReportingDesignation: '',
      Description: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle form submission or API integration here
      handleRedirect();
    },
  });
  console.log(formik.values.LeaveStartDate);
  console.log(formik.values.LeaveEndDate);

  function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}
console.log(getNumberOfDays(formik.values.LeaveStartDate, formik.values.LeaveEndDate ))

  const values = [
    {
      id: 1,
      label: "Sick Leave",
    },
    {
      id: 2,
      label: " Normal Leave",
    },
  ];
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
  const values1 = [
    {
      id: 1,
      label: "Yes",
    },
    {
      id: 2,
      label: "NO",
    },
  ];
  const values2 = [
    {
      id: 1,
      label: "Somu",
    },
    {
      id: 2,
      label: "Sudha",
    },
  ];
  const values3 = [
    {
      id: 1,
      label: "Mandatory",
    },
    {
      id: 2,
      label: "Official Work",
    },
  ];
  const values4 = [
    {
      id: 1,
      label: "YES",
    },
    {
      id: 2,
      label: "NO",
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
                        2  DAYS
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
                        1 DAYS
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
          <Box
            component={"form"}
            onSubmit={formik.handleSubmit}
            noValidate >
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
                  options={values}
                  sx={{ width: "100%" }}
                  required
                  fullWidth
                  renderInput={(params) => <TextField
                    {...params} label="Leave" required />}
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
                  options={values4}
                  sx={{ width: "100%" }}
                  required
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Applying due to any emergency?" required />}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Autocomplete
                  margin="0"
                  id="StationLeave"
                  name="StationLeave"
                  options={values1}
                  sx={{ width: "100%" }}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} margin="0" label="Station Leave" required />
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
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
 
                  <DatePicker
                    margin="0"
                    id="LeaveStartDate"
                    name="LeaveStartDate"
                    minDate={today}
                    // shouldDisableDate={isWeekend}
                    label="Leave Start Date"
                  //  value={formik.values.LeaveStartDate}
                    sx={{ width: "100%" }}
                    // maxDate={new Date()}
                    inputFormat="DD/MM/YYYY"
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
                    margin="0"
                    id="LeaveStartDate"
                    name="LeaveStartDate"
                    minDate={today}
                    label="Leave Start Date"
                    sx={{ width: "100%" }}
                    inputFormat="DD/MM/YYYY"
                    value={formik.values.LeaveStartDate} // Set the value from Formik
                    onChange={(date) => {
                      const formattedDate = moment(date).format('DD/MM/YYYY');
                      formik.setFieldValue("LeaveStartDate", formattedDate)} }// Handle date change and update Formik values
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
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Autocomplete
                  margin="0"
                  id="LeavestartTime"
                  name="LeavestartTime"

                  options={time}
                  sx={{ width: "100%" }}
                  required
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Time" required />}
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
                    // shouldDisableDate={isWeekend}
                    label="Leave End Date"
                    sx={{ width: "100%" }}
                    // maxDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    value={formik.values.LeaveEndDate} // Set the value from Formik
                    onChange={(date1) => formik.setFieldValue("LeaveEndDate", moment(date1).format('DD/MM/YYYY'))}
                    renderInput={(params) => (
                      <TextField
                        margin="0"
                        required

                        {...params}
                       
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Autocomplete
                  margin="0"
                  id="LeaveEndTime"
                  name="LeaveEndTime"
                  options={time}
                  sx={{ width: "100%" }}
                  required
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Time" required />}
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    margin="0"
                    id="Prefix"
                    name="Prefix"
                    label="Prefix"
                    // maxDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField
                        margin="0"
                        required
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>


              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    margin="0"
                    id="Suffix"
                    name="Suffix"
                    label="Suffix"
                    // maxDate={new Date()}
                    sx={{ width: "100%" }}
                    inputFormat="DD/MM/YYYY"
                    renderInput={(params) => (
                      <TextField
                        margin="0"
                        required
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Autocomplete
                  margin="0"
                  id="ReportingDesignation"
                  name="ReportingDesignation"
                  options={values2}
                  sx={{ width: "100%" }}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="Reporting Designation" required />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={8}>
                <TextField
                  margin="0"
                  id="Description"
                  name="Description"
                  sx={{ width: "100%" }}
                  required
                  multiline
                  rows={4}
                  label="Reason/Description"
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4} sx={{ mb: '15px' }}>
                <input type="file" />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} sx={{ width: '100%' }}>
                <Button type="submit" variant="contained" sx={{ float: 'right', borderRadius: '4px' }} onClick={handleRedirect}>Submit</Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default Leave;
