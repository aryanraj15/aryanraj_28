const validationSchema = Yup.object().shape({
  // ... other validations

  LeaveStartDate: Yup.string()
    .required("Leave Start Date is required")
    .nullable()
    .test('start-date', 'Leave End Date must be greater than or equal to Leave Start Date', function (value) {
      const { LeaveEndDate } = this.parent;

      // Check if both dates are not null
      if (value && LeaveEndDate) {
        // Convert the dates to JavaScript Date objects
        const startDate = new Date(value);
        const endDate = new Date(LeaveEndDate);

        // Check if LeaveEndDate is greater than or equal to LeaveStartDate
        if (endDate >= startDate) {
          return true;
        } else {
          return false;
        }
      }

      // If either date is null, return true (validation passes)
      return true;
    }),

  LeaveEndDate: Yup.string()
    .required("Leave End Date is required")
    .nullable(),
});
