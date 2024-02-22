\onSubmit: (values) => {
  // Handle form submission or API integration here
  // Set boolean value based on ApplyingDueToAnyEmergency value
  const isEmergency = values.ApplyingDueToAnyEmergency === 1;
  formik.setFieldValue("ApplyingDueToAnyEmergency", isEmergency);

  // Alternatively, you can use a ternary operator for conciseness
  // formik.setFieldValue("ApplyingDueToAnyEmergency", values.ApplyingDueToAnyEmergency === 1);

  // Rest of your onSubmit logic

  // If you also want to handle the case when ApplyingDueToAnyEmergency is 2
  if (values.ApplyingDueToAnyEmergency === 2) {
    formik.setFieldValue("ApplyingDueToAnyEmergency", false);
  }

  handleRedirect();
},
