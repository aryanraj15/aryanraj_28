// ... (your existing imports)

const Leave = () => {
  // ... (your existing code)

  const handleDateChange = (field, date) => {
    formik.setFieldValue(field, date);

    // Calculate the difference between LeaveStartDate and LeaveEndDate
    const startDate = formik.values.LeaveStartDate;
    const endDate = formik.values.LeaveEndDate;

    if (startDate && endDate) {
      const daysDifference = dayjs(endDate).diff(startDate, 'day');
      formik.setFieldValue('NumberOfDays', daysDifference + 1); // Adding 1 to include both start and end dates
    }
  };

  // ... (your existing code)

  return (
    // ... (your existing JSX)
    <Grid container spacing={2} direction="row" alignItems="center">
      {/* ... (your existing code) */}
      <Grid item xs={12} sm={4} md={4} lg={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            margin="0"
            id="LeaveStartDate"
            name="LeaveStartDate"
            minDate={today}
            label="Leave Start Date"
            sx={{ width: "100%" }}
            inputFormat="DD/MM/YYYY"
            renderInput={(params) => (
              <TextField
                fullWidth
                margin="0"
                required
                {...params}
                onChange={(e) => handleDateChange('LeaveStartDate', e)}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} sm={4} md={4} lg={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            margin="0"
            id="LeaveEndDate"
            name="LeaveEndDate"
            minDate={today}
            label="Leave End Date"
            sx={{ width: "100%" }}
            inputFormat="DD/MM/YYYY"
            renderInput={(params) => (
              <TextField
                margin="0"
                required
                {...params}
                onChange={(e) => handleDateChange('LeaveEndDate', e)}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} sm={4} md={4} lg={4}>
        <TextField
          margin="0"
          id="NumberOfDays"
          name="NumberOfDays"
          label="Number of Days"
          value={formik.values.NumberOfDays}
          disabled
          sx={{ width: "100%" }}
        />
      </Grid>
      {/* ... (your existing code) */}
    </Grid>
    // ... (your existing JSX)
  );
};

export default Leave;
