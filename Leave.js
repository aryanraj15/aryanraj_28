import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Card, CardContent } from "@mui/material";
import useTitle from "../../hooks/useTitle";
import PageTitle from "../../layouts/PageTitle";
import { useNavigate } from 'react-router-dom';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { H3 } from "../../components/Typography";
import AlertConfirm from "react-alert-confirm";
import {useSnackbar} from "../../components/Snackbar";
import "react-alert-confirm/lib/style.css";

function Leave() {
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

  const title = "Leave Application Form";
  useTitle(title);
  
  const navigate = useNavigate();
  const handleRedirect =() => {
    callConfirmDialog();
  }

  const {showSnackbar} = useSnackbar();

  const callConfirmDialog =async()=> {
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
    <Card>
      <CardContent>
      <div style={{display:"flex",justifyContent:"left",alignItems:'center', marginBlock:15, borderBottom: "0.5px solid #d1d1cf", marginTop:'30px'}}>
          <EventBusyIcon sx={{fontSize:"25px", color:'#246cb5'}}/>
          <H3 sx={{fontSize: "15px", color:'#246cb5'}} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Apply Leave</H3>
      </div>
      {/* <PageTitle name={"Apply Leave "} /> */}
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
                id="combo-box-demo"
                options={values}
                sx={{}}
                size="small"
                required
                fullWidth
                renderInput={(params) => 
                <TextField 
                {...params} 
                label="Leave" 
                required/>}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  // maxDate={new Date()}
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      sx={{ width: "100%" }}
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
                  label="End Date"
                  // maxDate={new Date()}
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      sx={{ width: "100%" }}
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
                  label="Prefix"
                  // maxDate={new Date()}
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      sx={{ width: "100%" }}
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
                  label="Suffix"
                  // maxDate={new Date()}
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      required
                      sx={{ width: "100%" }}
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Autocomplete
                id="combo-box-demo"
                options={values2}
                sx={{}}
                size="small"
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Reporting Designation" required/>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <TextField
                size="small"
                sx={{ width: "100%" }}
                required
                label="Reason/Description"
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Autocomplete
                id="combo-box-demo"
                options={values1}
                sx={{}}
                size="small"
                fullWidth
                
                renderInput={(params) => (
                  <TextField {...params} label="Station Leave" required/>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} sx={{mb:'15px'}}>
              <input type="file" />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} sx={{width:'100%'}}>
              <Button type="submit" variant="contained" sx={{float:'right', borderRadius:'4px'}} onClick={handleRedirect}>Submit</Button>
            </Grid>
          </Grid>
        </CardContent>  
      </Card>
    </>
  );
}

export default Leave;
