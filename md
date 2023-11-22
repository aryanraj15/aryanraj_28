const saveColumn2Data = async () => {
  try {
    const payloadList = rows2.map(row => ({
      userId: user.userId, // Assuming user is the logged-in user object from Redux
      designation: row.Designation,
      filePath: row.attachments, // Assuming attachments field contains the file path
      organization: row.OrganizationName,
      startDate: dayjs(row.fromDate).format("YYYY-MM-DD"),
      endDate: dayjs(row.toDate).format("YYYY-MM-DD"),
      crtBy: user.userId, // Assuming user is the logged-in user object from Redux
      updBy: user.userId, // Assuming user is the logged-in user object from Redux
    }));

    console.log("The saved column2 data payload:", payloadList);

    const res = await axios.post(
      'http://10.48.158.197:8099/usermanagementapi/employee-enrollment/savePreviousExpDetails',
      payloadList
    );

    console.log('Save API Response:', res.data);

    if (res.data.statusCode === 200) {
      // Handle success, e.g., navigate to the next page
      onButtonClick('pagefour');
    } else {
      // Handle the case where the save API returns an error
      console.error('Error in save API:', res.data.message);
      // You might want to show a notification to the user
    }
  } catch (error) {
    console.error('Error in save API:', error);
    // Handle error or display an error notification
  }
};

