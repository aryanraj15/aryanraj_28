console.log(formik.values.LeaveStartDate);
  console.log(formik.values.LeaveEndDate);

  const numberofDays = getNumberOfDays(formik.values.LeaveStartDate, formik.values.LeaveEndDate);

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
  console.log(numberofDays)
