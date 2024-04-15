import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { H3 } from '../../../components/Typography';
import DateCalendarServerRequest from './DateCalendarServerRequest'; // Import DateCalendarServerRequest component

const LeaveRequestDetails = () => {
  // Your existing code...

  return (
    <>
      <Card>
        {/* Your existing code for leave balance details */}
      </Card>
      <Card>
        {/* Your existing code for leave request details */}
      </Card>
      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf", marginTop: '30px' }}>
            <ReceiptLongIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
            <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Leave Approve</H3>
          </div>
          <Box sx={{ flexGrow: 1, mt: 2, elevation: "0" }}>
            <Grid
              container
              spacing={2}
              direction="row"
              alignItems="center"
            >
              {/* Integrate DateCalendarServerRequest component */}
              <Grid item xs={12}>
                <DateCalendarServerRequest rqstFromDate={startDate} rqstToDate={endDate} />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default LeaveRequestDetails;












// Your existing imports...

const DateCalendarServerRequest = ({ rqstFromDate, rqstToDate }) => {
  // Your existing code...

  // Set initial value based on rqstFromDate
  const initialValue = dayjs(rqstFromDate);

  // Fetch highlighted days based on rqstFromDate
  React.useEffect(() => {
    fetchHighlightedDays(dayjs(rqstFromDate));
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, [rqstFromDate]);

  // Handle month change based on rqstFromDate
  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default DateCalendarServerRequest;
