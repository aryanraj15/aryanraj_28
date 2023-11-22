const saveEducationalDetails = async (data) => {

        try {
            let body = {
                educationalDetailsList: [],
                employeeCertificationsList: []
            }

            rows.map((row) => {
                let eduobj = {
                    userId: user.data.userdetails.user.userId,
                    qualification: row["qualification"].id,
                    instituteName: row["institute"],
                    apmcNo: apmcNo,
                    technicalOrNonTechnical:hasphysicalHand,
                    filePath: row["attachments"],
                    boardOfStudy: row["board"],
                    percentage: row["percentage"],
                    admissionDate: row["admissionDate"],
                    completionDate: row["completionDate"],
                    crtBy: user.data.userdetails.user.userId,
                    updBy: user.data.userdetails.user.userId
                }
                body["educationalDetailsList"].push(eduobj)
            })

            rows2.map((row) => {


                let certobj = {
                    userId: user.data.userdetails.user.userId,
                    certificationName: row["nameoftheCourse"].id,
                    filePath: row["certificates"],
                    courseStartDate: row["startDate"],
                    courseEndDate: row["endDate"],
                    crtBy: user.data.userdetails.user.userId,
                    updBy: user.data.userdetails.user.userId
                };



                body["employeeCertificationsList"].push(certobj);
               
            });
            // let body = {
            // educationalDetailsList: [
            //     {
            //         userId: user.data.userdetails.user.userId,
            //         qualification: formik.values.data.qualification,
            //         instituteName: formik.values.data.instituteName,
            //         apmcNo: formik.values.apmcNo,
            //         technicalOrNonTechnical: 0,
            //         filePath: "string",
            //         boardOfStudy: "string",
            //         percentage: 0,
            //         admissionDate: formik.values.data.admissionDate,
            //         completionDate: "2023-11-20T01:18:12.396Z",
            //         crtBy: user.data.userdetails.user.userId,
            //         updBy: user.data.userdetails.user.userId
            //     }
            // ],
            //     employeeCertificationsList: [
            //         {
            //           userId: user.data.userdetails.user.userId,
            //           certificationName: "string",
            //           filePath: "string",
            //           courseStartDate: "2023-11-21T10:13:47.494Z",
            //           courseEndDate: "2023-11-21T10:13:47.494Z",
            //           crtBy: user.data.userdetails.user.userId,
            //           updBy: user.data.userdetails.user.userId
            //         }
            //       ]
            // }

            const res = await axios.post(
                "http://10.48.158.197:8099/usermanagementapi/employee-enrollment/educationalDetails",
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
    }
    
