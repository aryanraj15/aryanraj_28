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











import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DateCalendar from '@mui/lab/DateRangePicker';
import { Skeleton } from '@mui/material';

const DateCalendarServerRequest = ({ rqstFromDate, rqstToDate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);

  const requestAbortController = React.useRef(null);

  const fetchHighlightedDays = async (date) => {
    requestAbortController.current = new AbortController();

    try {
      setIsLoading(true);
      // Fetch highlighted days from the API endpoint
      const response = await fetch('http://141.148.194.18:8052/leavemanagement/get-leave-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromDate: date.format('YYYY-MM-DD'),
          toDate: date.endOf('month').format('YYYY-MM-DD'),
        }),
        signal: requestAbortController.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch highlighted days');
      }

      const data = await response.json();
      // Extract rqstFromDate and rqstToTime from the API response
      const { rqstFromDate, rqstToTime } = data.result;
      // Convert rqstFromDate and rqstToTime to dayjs objects
      const startDate = dayjs(rqstFromDate);
      const endDate = dayjs(rqstToTime, 'HH:mm:ss');

      // Update the highlightedDays state to an array containing the start date and end date
      setHighlightedDays([{ start: startDate, end: endDate }]);
    } catch (error) {
      console.error('Error fetching highlighted days:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlightedDays(dayjs(rqstFromDate));

    return () => {
      if (requestAbortController.current) {
        requestAbortController.current.abort();
      }
    };
  }, [rqstFromDate]);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={[dayjs(rqstFromDate), dayjs(rqstToDate)]}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <Skeleton animation="wave" variant="rectangular" width={300} height={300} />}
        // Customize the slots and slotProps as needed
        renderInput={(startProps, endProps) => (
          <>
            <input {...startProps.inputProps} value={rqstFromDate} />
            <input {...endProps.inputProps} value={rqstToTime} />
          </>
        )}
      />
    </LocalizationProvider>
  );
};

export default DateCalendarServerRequest;
