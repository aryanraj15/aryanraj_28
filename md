 const savePersonalDetails = async (data) => {
  
        try {
          let body = {
            userId:4,
            accNo: formik.values.accountNumber,
            empAccountType: formik.values.AccountTypes.valueId,
            accHolderName: formik.values.accholdername,
            ifscCode: "UBIN0902411",
            crtBy: user.data.userdetails.user.userId,
            updBy: user.data.userdetails.user.userId,
 

          };

       
          console.log("the saved details  body", body);
          const res = await axios.post(
            "http://localhost:8099/usermanagementapi/employee-enrollment/saveBankDetail",
   
            body
          );
          console.log("the saved details  areeeeee", res);
          if (res.data.statusCode == 200) {
            console.log("the result ", res.data.result);
            //setPatientId("The Registered Patient Id is " + res.data.result);
            onButtonClick("pagetwo")
            //handleClickOpen();
            //showSnackbar(res.data.result, "success");
          }
        } catch (error) {
          alert("Data has not saved", error);
          console.log(error.message);
        }
      };

      
