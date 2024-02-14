console.log(formik.values.LeaveStartDate);
console.log(formik.values.LeaveEndDate);

const numberofDays = getNumberOfDays(formik.values.LeaveStartDate, formik.values.LeaveEndDate);

function getNumberOfDays(start, end) {
  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Check if the dates are the same
  if (date1.toDateString() === date2.toDateString()) {
    // If the dates are the same, return 1 day
    return 1;
  } else {
    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    // Return the calculated difference plus 1
    return diffInDays + 1;
  }
}

console.log(numberofDays);
