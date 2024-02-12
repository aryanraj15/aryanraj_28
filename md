import React, { useState } from "react";
// ... (other imports)

function Leave() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(null);

  // ... (rest of the component)

  const handleStartDateChange = (date) => {
    setStartDate(date);
    calculateNumberOfDays(date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    calculateNumberOfDays(startDate, date);
  };

  const calculateNumberOfDays = (start, end) => {
    if (start && end) {
      const diffInMilliseconds = Math.abs(end - start);
      const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
      setNumberOfDays(diffInDays);
    }
  };

  // ... (rest of the component)

  return (
    <>
      <Card>
        <CardContent>
          {/* ... (your existing code) */}
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                inputFormat="DD/MM/YYYY"
                renderInput={(params) => (
                  <TextField
                    size="small"
                    sx={{ width: "100%" }}
                    required
                    {...params}
                    onChange={(e) => handleStartDateChange(e)}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                inputFormat="DD/MM/YYYY"
                renderInput={(params) => (
                  <TextField
                    size="small"
                    sx={{ width: "100%" }}
                    required
                    {...params}
                    onChange={(e) => handleEndDateChange(e)}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <TextField
              size="small"
              sx={{ width: "100%" }}
              required
              label="Number of Days"
              value={numberOfDays}
              disabled
            />
          </Grid>
          {/* ... (rest of the code) */}
        </CardContent>
      </Card>
    </>
  );
}

export default Leave;
