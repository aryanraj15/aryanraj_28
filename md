import React from 'react'
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Card, CardContent } from "@mui/material";
import useTitle from '../../hooks/useTitle';
import PageTitle from '../../layouts/PageTitle';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useNavigate } from 'react-router-dom';
import { H3 } from '../../components/Typography';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import AlertConfirm from "react-alert-confirm";
import { useSnackbar } from "../../components/Snackbar";
import "react-alert-confirm/lib/style.css";
import LockResetIcon from '@mui/icons-material/LockReset';
import axios from 'axios';
import Cookies from "js-cookie";
const ForgotPassword = () => {
    const { showSnackbar } = useSnackbar();
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("info");
    const [showotherfield, setShowotherfields] = useState(false);
    const [showusernamefield, setUsernamefields] = useState(true);
    const [showsendotpButton, setSendopButton] = useState(true);
    const navigate = useNavigate();
    const title = "Forgot Password";
    useTitle(title);


    const validationSchema = Yup.object().shape({


        userName: Yup.string().required("User Name is required"),
        currentPassword: Yup.string().required("Current Password is required").nullable(),
        newPassword: Yup.string().required("New Password is required"),
        otp: Yup.string().required("Otp Password is required"),


    });

    const formik = useFormik({
        initialValues: {
            userName: null,
            currentPassword: '',
            newPassword: '',
            otp: '',

            // Add initial values for other fields
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // Handle form submission or API integration here
        },
    });

    const handleRedirect = () => {

        callConfirmDialog();
    }
    const handleOtpButton = () => {
        setShowotherfields(true);
        setUsernamefields(false);
        setSendopButton(false);
    }


    const callConfirmDialog = async () => {
        console.log('kp-confirm');
        const [action] = await AlertConfirm({
            title: "Confirm",
            desc: "Are you sure, you want to submit?",
        });
        AlertConfirm.config({
            okText: "Submit",
            cancelText: "Cancel",
        });
        if (action) {
            console.log('kp-saved');
            showSnackbar("Saved Successfully", 'success');

        } else {
            //   setIsSubmit(false);
            showSnackbar('Did not save!', 'error')
        }
    };

    const saveForgotPassword = async (data) => {


        try {
            let body = {

                userName: formik.values.userName,
                currentPassword: formik.values.currentPassword,
                newPassword: formik.values.newPassword,
                otp: formik.values.otp,


            };


            console.log("the saved details  body", body);
            const res = await axios.post(
                `${process.env.REACT_APP_MASTER_API_URL}/employee-enrollment/saveBankDetails`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`
                    }
                }
            );
            console.log("the saved details  areeeeee", res);
            if (res.data.statusCode == 200) {
                console.log("the result ", res.data.result);
                setToastMessage(res.data.message)
                setToastSeverity("success");
                setOpenToast(true);
                navigate('/')
            }
        } catch (error) {
            alert("Data has not saved", error);
            console.log(error.message);
        }
    };

    return (
        <>

            <Box >
                <Grid
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100vh"
                    sx={{ mx: 3 }}
                >
                    <Card
                    >
                        <CardContent>

                            <div >
                                <H3><LockResetIcon />Forgot Password</H3>
                            </div>
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                alignItems="center"
                            >
                                {showusernamefield && (
                                    <Grid item xs={12} sm={6} md={6} lg={12}>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="userName"
                                            label="User Name"
                                            name="userName"
                                            value={formik.values.userName || ""}
                                            size="small"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.userName &&
                                                Boolean(formik.errors.userName)
                                            }
                                            helperText={
                                                formik.touched.userName &&
                                                formik.errors.userName
                                            }

                                        />
                                    </Grid>
                                )}
                                {showotherfield && (
                                    <>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="currentPassword"
                                                label="Current Password"
                                                name="currentPassword"
                                                value={formik.values.currentPassword || ""}
                                                size="small"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched.currentPassword &&
                                                    Boolean(formik.errors.currentPassword)
                                                }
                                                helperText={
                                                    formik.touched.currentPassword &&
                                                    formik.errors.currentPassword
                                                }

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="newPassword"
                                                label="New Password"
                                                name="newPassword"
                                                value={formik.values.newPassword || ""}
                                                size="small"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched.newPassword &&
                                                    Boolean(formik.errors.newPassword)
                                                }
                                                helperText={
                                                    formik.touched.newPassword &&
                                                    formik.errors.newPassword
                                                }

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="otp"
                                                label="OTP"
                                                name="otp"
                                                value={formik.values.otp || ""}
                                                size="small"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched.otp &&
                                                    Boolean(formik.errors.otp)
                                                }
                                                helperText={
                                                    formik.touched.otp &&
                                                    formik.errors.otp
                                                }

                                            />
                                        </Grid>

                                        <Box
                                            spacing={2}
                                            sx={{ margin: 1, textAlign: 'center' }}
                                        >

                                            <Button type="Submit" variant="contained"
                                                sx={{ minWidth: 100, ml: 1, mt: { xs: 1, md: 0 } }}
                                                onClick={handleRedirect}


                                            >SUBMIT</Button>

                                        </Box>
                                    </>
                                )}
                            </Grid>

                            {showsendotpButton && (

                                <Box
                                    spacing={2}
                                    sx={{ margin: 1, textAlign: 'center' }}
                                >

                                    <Button type="Submit" variant="contained"
                                        sx={{ minWidth: 100, ml: 1, mt: { xs: 1, md: 0 } }}
                                        //  onClick={handleRedirect}
                                        onClick={handleOtpButton}

                                    >Send OTP</Button>

                                </Box>
                            )}
                            {/* </Grid> */}
                        </CardContent>
                    </Card>
                </Grid>

            </Box>
        </>
    )
}

export default ForgotPassword;




POST (axios.post):
URL:
https://uat.ysraarogyasri.ap.gov.in/usermanagementapi/user/forget-password/sendotp/{username}
 
Response:
{
    "status": true,
    "message": "OTP Sent to registered Mobile No. - ",
    "result": "XXXXXX340",
    "statusCode": 200
}
 
PUT(axios.put):
URL:
https://uat.ysraarogyasri.ap.gov.in/usermanagementapi/user/forget-password/validateotp
 
Payload:
{
    "username": "chirag",
    "password": "abc123",
    "otp": 123456
}
 
Response:
{
    "status": true,
    "message": "Password Updated Successfully!",
    "result": null,
    "statusCode": 200
}
