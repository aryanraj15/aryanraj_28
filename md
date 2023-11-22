 //   const saveColumn2Data = async () => {
    //     try {
    //       let body = {
 
    //         previousExperienceList: []
    //       };
      
    //       rows2.map((row) => {
    //         let expObj = {
    //             userId: user.data.userdetails.user.userId,
    //             designation:row["Designation"],
    //             filePath:  row["previousAttachments"], 
    //             organization: "OrganizationName",
    //             startDate: row["fromDate"],
    //             endDate: row["toDate"],
    //             crtBy: user.data.userdetails.user.userId,
    //             updBy: user.data.userdetails.user.userId
    //         };
    //         body["previousExperienceList"].push(expObj);
    //       });
      
    //       console.log("The saved column2 data payload:", body);
      
    //       const res = await axios.post(
    //         'http://10.48.158.197:8099/usermanagementapi/employee-enrollment/savePreviousExpDetails',
    //         body
    //       );
      
    //       console.log('Save API Response:', res.data);
      
    //       if (res.data.statusCode === 200) {
    //         // Handle success, e.g., navigate to the next page
    //         onButtonClick('pagefour');
    //       } else {
    //         // Handle the case where the save API returns an error
    //         console.error('Error in save API:', res.data.message);
    //         // You might want to show a notification to the user
    //       }
    //     } catch (error) {
    //       console.error('Error in save API:', error);
    //       // Handle error or display an error notification
    //     }
    //   };
