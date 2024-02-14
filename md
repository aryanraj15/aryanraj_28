import React, { useState } from "react";
// other imports...

const Leave = () => {
  const [selectedLeaveStartDate, setSelectedLeaveStartDate] = useState(null);
  // ... rest of your code

  return (
    <>
      {/* ... your existing code ... */}
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
            value={formik.values.LeaveStartDate}
            onChange={(date) => {
              const formattedDate = dayjs(date).format("MM-DD-YYYY");
              formik.setFieldValue("LeaveStartDate", formattedDate);
              setSelectedLeaveStartDate(date);
            }}
            renderInput={(params) => (
              <TextField fullWidth margin="0" required {...params} />
            )}
          />
        </LocalizationProvider>
      </Grid>
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
            inputFormat="DD/MM/YYYY"
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
      {/* ... rest of your code ... */}
    </>
  );
};

export default Leave;
