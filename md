import React, { useState, useEffect } from "react";
// ... (your other imports)

function Leave() {
  const [numberOfDays, setNumberOfDays] = useState(0);

  // ... (rest of your code)

  useEffect(() => {
    // Calculate the difference in days when dates change
    const startDate = dayjs(formik.values.LeaveStartDate, "DD/MM/YYYY");
    const endDate = dayjs(formik.values.LeaveEndDate, "DD/MM/YYYY");

    const daysDifference = endDate.diff(startDate, "day");
    setNumberOfDays(daysDifference);
  }, [formik.values.LeaveStartDate, formik.values.LeaveEndDate]);

  // ... (rest of your code)

  return (
    <>
      {/* ... (rest of your code) */}

      <Grid item xs={12} sm={4} md={4} lg={4}>
        <TextField
          margin="0"
          id="NumberOfDays"
          name="NumberOfDays"
          label="Number of Days"
          value={numberOfDays}
          disabled
          sx={{ width: "100%" }}
        />
      </Grid>

      {/* ... (rest of your code) */}
    </>
  );
}

export default Leave;
