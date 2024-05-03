import { Button, Card, CardContent, Grid, TextField, Typography, Box, Slide,Tooltip } from '@mui/material'
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import SearchIcon from '@mui/icons-material/Search';
import { H3 } from '../../../components/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import SearchTable from "../../../components/SearchTableAlt";
import * as Yup from 'yup';
import Loader from '../../../components/Loader';
import LeadgerCard from './LedgerCard';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import swal from "sweetalert";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}
const AdminLedger = () => {

    const validationSchema = Yup.object().shape({
        department: Yup.string().required("Department is Required").nullable(),
        userName: Yup.string().required("Name is Required").nullable(),
    });

    const formik = useFormik({
        initialValues: {
            department: '',
            userName: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values)
            // handleRedirect();
        },
    });

    const checkValid = () => {
        formik
            .validateForm()
            .then((formErrors) => {
                if (Object.keys(formErrors).length > 0) {

                    console.log(Object.keys(formErrors))
                    //alert(Object.keys(formErrors))
                    // alert("Please fill all the required * fields");
                    setToastMessage("Please fill all the required * fields");
                    setToastSeverity("error");
                    setOpenToast(true);
                } else {
                    handleSearch();

                }
            })
            .catch((err) => {
                // formik.setSubmitting(false);
            });
    };

    const [userNamelist, setUserNamelist] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [departmentList, setDepartmentList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const resetCheck = useRef();
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("info");
    const [isuserDisabled, setIsUserDisabled] = useState(true);

    const [leaveBalance, setLeaveBalalnce] = useState([]);


    useEffect(() => {

        axios.get(`http://141.148.194.18:8052/leavemanagement/department-dropdown`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        }).then(response => {
            let sortedDepartment = response.data.result.map((value) => {
                value = value
                return value;

            })
            console.log(sortedDepartment);
            setDepartmentList(sortedDepartment);
            setIsUserDisabled(false);
        })
            .catch(error => {
                setDepartmentList([]);
                console.log(error);
            });

    }, []);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenToast(false);
    };

    const handleFetchData = async () => {
        try {
            const payload = {
                userId: formik.values.userName,
            }
            const response = await axios.post("http://141.148.194.18:8052/leavemanagement/user-leave-ledger", payload, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
            });
            const formattedData = response.data.result.map((item, index) => ({
                ...item,
                index: index + 1,


            }));

            setTableData(formattedData);
            console.log('kp-tableDataResponse', response.data);

            // setTableData(response.data.result);
            if (response.status === true) {
                console.log('kp-tableData1', tableData);
                console.log('kp-tableData2', tableData);


            }
        } catch (error) {

            console.error(error);
        }
        finally {
            setIsLoading(false);
        }

    }
    const fetchDataOnLeaveBalance = async () => {
        try {
            const payload = {
                userId: resetCheck.current ? null : formik.values.userName,

            }

            const response = await axios.post(`http://141.148.194.18:8052/leavemanagement/leave-balance-dropdown`, payload, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
            });
            let sortedLeaveBallenceData = response.data.result.map((value) => {
                return value;
            })

            setLeaveBalalnce(sortedLeaveBallenceData);
            console.log(sortedLeaveBallenceData);

        } catch (error) {
            console.error(error)
        }

    }

    const columns = [

        {
            field: "index",
            headerName: "S.No",
            flex: 0.1,
            minWidth: 60,
            headerClassName: "super-app-theme--header",

        },

        {
            field: "leaveTypeDesc",
            headerName: "Leave Type",
            flex: 0.2,
            minWidth: 150,
            headerClassName: "super-app-theme--header",
        },

        {
            field: "date",
            headerName: "Date",
            flex: 0.2,
            minWidth: 100,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "reason",
            headerName: "Reason",
            flex: 0.1,
            minWidth: 180,
            headerClassName: "super-app-theme--header",
        },

        {
            field: "initialBalance",
            headerName: "Initial Balance(Days)",
            flex: 0.1,
            minWidth: 150,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "creditLeave",
            headerName: "Credit(Days)",
            flex: 0.1,
            minWidth: 120,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "debitLeave",
            headerName: "Debit(Days)",
            flex: 0.1,
            minWidth: 120,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "openingBalance",
            headerName: "Net Balance(Days)",
            flex: 0.1,
            minWidth: 150,
            headerClassName: "super-app-theme--header",
        },

    ];

    const handleSearch = () => {
        setShowTable(true);
        fetchDataOnLeaveBalance();
        handleFetchData();
    }

    const handleResetForm = () => {
        swal({
            title: "Do you want to reset the search?",
            buttons: { cancel: "Cancel", confirm: "Confirm" },

        }).then((userClickedConfirm) => {
            if (userClickedConfirm) {
                setShowTable(false);

                formik.setFieldValue("userName", null);
                formik.setFieldValue("department", null);
                resetCheck.current = true
                
                // setSelectAllApplications(false);
                // const updatedValues = { ...initValues, status: null };
                // formik.resetForm({ values: updatedValues });
                // handleFetchApplicants(updatedValues, true);
                // navigate(location.pathname, {});
            }
        });
    };
    // const data = [{ index: 1, loginName: 'Shiv Shankar', username: 'abc', enrollmentStatus: 'True', dob: '24/05/2000', empCode: '#ABC123', emailId: 'abc@gmail.com' }]

    return (
        <div>
            <Card>
                <CardContent>
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <Snackbar
                                open={openToast}
                                autoHideDuration={6000}
                                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                onClose={handleClose}
                                TransitionComponent={TransitionLeft}
                            >
                                <Alert onClose={handleClose} severity={toastSeverity}
                                    sx={{
                                        width: '100%',
                                        padding: { sm: '15px', xs: '10px' },
                                        borderRadius: '15px',
                                        fontSize: { sm: '16px', xs: '14px' },
                                        boxShadow: "0 0 10px #999",
                                        marginTop: { sm: '25px', xs: '20px' }
                                    }}>
                                    {toastMessage}
                                </Alert>
                            </Snackbar>
                        </div>
                        <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf", marginBottom: "20px" }}>
                            <SearchIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
                            <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Search Parameters</H3>
                        </div>
                        <Grid container columnSpacing={2}>

                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    id="department"
                                    sx={{ width: '100%' }}
                                    options={departmentList}
                                    value={
                                        departmentList.find(
                                            (option) => option.typeId === formik.values.department
                                        ) || null
                                    }
                                    onChange={(e, value) => {
                                        // formik.setFieldValue("department", "")

                                        if (value === null) {
                                            formik.setFieldValue("department", null)
                                            formik.setFieldValue("userName", null);

                                        }
                                        else {
                                            formik.setFieldValue("department", value.typeId);

                                            const body = {
                                                deptId: value.typeId,
                                            };
                                            axios.post(`http://141.148.194.18:8052/leavemanagement/name-list-department`, body, {
                                                headers: {
                                                    Authorization: `Bearer ${Cookies.get("token")}`
                                                }
                                            }).then(response => {
                                                let sortedNamelist = response.data.result.map((value) => {
                                                    value = value
                                                    return value;
                                                })
                                                setUserNamelist(sortedNamelist);
                                                console.log(sortedNamelist);
                                            })
                                                .catch(error => {
                                                    setUserNamelist([]);
                                                    console.log(error);
                                                });

                                        }
                                    }}
                                    getOptionLabel={(value) => value.typeName}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Department"
                                            required

                                            onBlur={formik.handleBlur}
                                            helperText={formik.errors.department && formik.touched.department ? formik.errors.department : null}
                                            error={formik.errors.department && formik.touched.department ? true : false}

                                        />
                                    )}
                                />
                            </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4}>
                            <Tooltip title={isuserDisabled ? "Please select Department first" : ""} arrow>
                                    <Autocomplete
                                        size="small"
                                        id="userName"
                                        name="userName"
                                        sx={{ width: '100%' }}
                                        options={userNamelist.map((option) => option)}
                                        value={
                                            userNamelist.find(
                                                (option) => option.userId === formik.values.userName
                                            ) || null
                                        }

                                        onChange={(e, value) => {
                                            if (value === null) {
                                                formik.setFieldValue("userName", null);
                                            } else {
                                                formik.setFieldValue("userName", value.userId);
                                            }
                                        }}
                                        getOptionLabel={(value) => value.fullName}
                                        renderInput={(params) => (

                                            <TextField
                                                {...params}
                                                label="Employee Name"
                                                required

                                                onBlur={formik.handleBlur}
                                                helperText={formik.errors.userName && formik.touched.userName ? formik.errors.userName : null}
                                                error={formik.errors.userName && formik.touched.userName ? true : false}

                                            />
                                        )}
                                    />
                            </Tooltip>
                                </Grid>

                            <Grid item xs={12} sm={4} md={4} lg={2}>
                                <Button variant='outlined' sx={{ borderRadius: '4px', width: "100%" }} onClick={handleResetForm}>Reset</Button>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={2}>
                                <Button
                                    type="submit"
                                    variant='contained'
                                    sx={{ borderRadius: '4px', width: "100%" }}
                                    // onClick={handleSearch}
                                    onClick={() => {

                                        checkValid();
                                    }}
                                >Search</Button>
                            </Grid>




                        </Grid>

                    </form>
                </CardContent>
            </Card>

            {showTable && (

                <>
                    {
                        isLoading && <Loader />
                    }

                    <Card sx={{ my: 2 }} elevation={3}>
                        <CardContent>
                            <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf" }}>
                                <EventBusyIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
                                <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Leave Ledger</H3>
                            </div>
                            <Card >
                                <Box sx={{ flexGrow: 1, mt: 2, elevation: "0" }}>

                                    <Grid container spacing={2} columns={16}>
                                        {leaveBalance.map((value, index) => (<LeadgerCard resData={value} key={index} />))}

                                    </Grid>
                                </Box>
                            </Card>
                            <Box component={"div"} sx={{ mt: 8 }} >
                                <SearchTable
                                    columns={columns}
                                    data={tableData}
                                    isCheckbox={false}
                                    isHideDensity={false}
                                    isHideExport={true}
                                    isHideFilter={true}
                                    isHideColumn={true}
                                    isHidePaging={false}
                                    name="leaveLedgers"
                                    id="leaveLedgers"
                                />
                            </Box>
                        </CardContent>
                    </Card>

                </>
            )}
        </div>
    )
}

export default AdminLedger
