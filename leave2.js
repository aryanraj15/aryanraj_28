
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import SearchTable from "../../../components/SearchTableAlt";
import { useNavigate, useLocation } from "react-router";
import {
    Card,
    CardContent,
    TextField,
    Autocomplete,
    Grid,
    Box,
    Button,
    Stack,
    Checkbox,
    Link,
    Dialog, DialogContent
} from "@mui/material";
import swal from "sweetalert";
import { useFormik } from "formik";
import CachedIcon from "@mui/icons-material/Cached";
import SearchIcon from "@mui/icons-material/Search";
import useTitle from '../../../hooks/useTitle';
import PageTitle from '../../../layouts/PageTitle';
import FaceBookCircularProgress from "../../../components/FaceBookCircularProgress";
import { useSnackbar } from "../../../components/Snackbar";
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import TrackManageLeaveStatus from "./TrackManageLeaveStatus";
export const initValues = {
    rqstId: null,
    userName: "",
    rqstStatus: "",
    rqstFrom: null,
    rqstTo: null,

};

const SearchApplication = () => {

    const title = "Search Parameters";
    const title1 = "Leave Details";
    const title2 = `Manage Leave Request`;
    useTitle(title2);
    const { showSnackbar } = useSnackbar();
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [selectAllApplications, setSelectAllApplications] = useState(false);
    const [actionForIds, setActionForIds] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [searchedValues, setSearchedValues] = useState(
        location.state?.searchValues ? location.state?.searchValues : initValues
    );
    const [userNamelist, setUserNamelist] = useState([]);
    const [empCode, setEmpCode] = useState([]);
    const [Enrollstatus, setEnrollstatus] = useState([]);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [requestStatus, setRequestStatus] = useState(null);
    const [reqRemarks, setReqRemarks] = useState(null);


    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    // useEffect(() => {


    //     axios.get(`${process.env.REACT_APP_MASTER_API_URL}/employee-enrollment/emp-code-dropdown`, {
    //         headers: {
    //             Authorization: `Bearer ${Cookies.get("token")}`
    //         }
    //     }).then(response => {
    //         let sortedEmpCode = response.data.result.map((value) => {
    //             value = value
    //             return value;

    //         })
    //         console.log(sortedEmpCode);
    //         setEmpCode(sortedEmpCode)

    //     })
    //         .catch(error => {
    //             setEmpCode([]);
    //             console.log(error);
    //         });


    //     axios
    //         .get(
    //             `${process.env.REACT_APP_MASTER_API_URL}/employee-enrollment/enrollment-status-dropdown`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${Cookies.get("token")}`
    //                 },

    //             }
    //         )
    //         .then((response) => {
    //             let sortedEnrollmentStatus;
    //             if (
    //                 Object.keys(response.data).includes("result") &&
    //                 Array.isArray(response.data.result)
    //             ) {
    //                 sortedEnrollmentStatus = response.data.result.map((value) => ({
    //                     label: value.label,
    //                     id: value.id,
    //                 }));
    //                 setEnrollstatus(sortedEnrollmentStatus);
    //             }
    //             console.log("Status List: ", sortedEnrollmentStatus);
    //         })
    //         .catch((error) => {
    //             setEnrollstatus([]);
    //             console.log(error);
    //         });


    // }, []);

    useEffect(() => {
        handleFetchApplicants(formik.values, false);
    }, []);

    // const handleFetchApplicants = async (values, reset) => {

    //     setLoading(true);
    //     try {
    //         console.log("Fetching applicants details for:", values);
    //         const payload = {

    //             rqstId: values.rqstId,
    //             userName: values.userName,
    //             rqstStatus: values.rqstStatus,
    //             rqstFrom: values.rqstFrom,
    //             rqstTo: values.rqstTo,

    //         };
    //         console.log("Payload for fetching applicants:", payload);

    //         const response = await axios.post(
    //             `http://141.148.194.18:8052/leavemanagement/manage-leave-search`,
    //             payload,

    //         );
    //         console.log("Applicants data:", response.data.result);
    //         console.log("API Response:", response);
    //         console.log("Type of API Response:", typeof response.data.statusCode);

    //         setLoading(false);
    //         if (response.data.status && response.data.result.length > 0) {

    //             setRows(
    //                 response.data.result.map((item, index) =>
    //                     createData(
    //                         // false,
    //                         index + 1,
    //                         item.rqstId,
    //                         item.userName,
    //                         item.empCode,
    //                         item.leaveTypeDesc,
    //                         item.daysOfLeave,
    //                         item.rqstFromDate,
    //                         item.rqstToDate,
    //                         item.rqstFromTime,
    //                         item.rqstToTime,
    //                         item.rqstStatusDesc

    //                     )


    //                 )
    //             );

    //             if (reset) {
    //                 showSnackbar("Reset successful", "info");
    //             } else {
    //                 showSnackbar("Data fetched successfully", "success");
    //             }
    //         } else if (response.data.statusCode === 404) {
    //             setRows([]);
    //             if (reset) {
    //                 showSnackbar("Form reset successful,no data found", "info");
    //             } else {
    //                 showSnackbar("No data found", "info");
    //             }
    //         } else {
    //             setRows([]);
    //             showSnackbar("An error occurred", "error");
    //         }
    //     } catch (error) {
    //         console.error("An error occurred:", error);
    //         setRows([]);
    //         setLoading(false);
    //         if (error.response.data.statusCode === 404) {

    //             if (reset) {
    //                 showSnackbar("Form reset successful,no data found", "info");
    //             } else {
    //                 showSnackbar("No data found", "error");
    //             }
    //         }
    //         else { showSnackbar("Oops, something went wrong", "error"); }

    //     }
    // };



    const handleFetchApplicants = async (values, reset) => {
        setLoading(true);
        try {
            // Fetch applicants details
            const payload = {
                rqstId: values.rqstId,
                userName: values.userName,
                rqstStatus: values.rqstStatus,
                rqstFrom: values.rqstFrom,
                rqstTo: values.rqstTo,
            };

            const response = await axios.post(
                "http://141.148.194.18:8052/leavemanagement/manage-leave-search",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`
                    }
                }

            );

            setLoading(false);
            console.log(response.data.result.searchResult);
            if (response.data.statusCode > 0) {
                console.log("formattedData");
                setUserNamelist(response.data.result.nameList);
                setEnrollstatus(response.data.result.statusDropdown);

                const formattedData = response.data.result.searchResult.map((item, index) => {
                    const fromDate = item.rqstFromDate + " : " + item.rqstFromTime;
                    const ToDate = item.rqstToDate + " : " + item.rqstToTime;
                    return createData(
                        index + 1,
                        item.rqstId,
                        item.userName,
                        item.empCode,
                        item.leaveTypeDesc,
                        item.daysOfLeave,
                        fromDate, // Concatenated Start Date
                        ToDate,
                        item.rqstStatusDesc
                    );
                });
                setRows(formattedData);
                console.log(formattedData);

                if (reset) {
                    showSnackbar("Reset successful", "info");
                } else {
                    showSnackbar("Data fetched successfully", "success");
                }
            } else if (response.data.statusCode === 404) {
                setRows([]);
                if (reset) {
                    showSnackbar("Form reset successful, no data found", "info");
                } else {
                    showSnackbar("No data found", "info");
                }
            } else {
                setRows([]);
                showSnackbar("An error occurred", "error");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setRows([]);
            setLoading(false);
            if (error.response.data.statusCode === 404) {
                if (reset) {
                    showSnackbar("Form reset successful, no data found", "info");
                } else {
                    showSnackbar("No data found", "error");
                }
            } else {
                showSnackbar("Oops, something went wrong", "error");
            }
        }
    };

    // For table
    function createData(
        index,
        rqstId,
        userName,
        empCode,
        leaveTypeDesc,
        daysOfLeave,
        fromDate,
        ToDate,
        rqstStatusDesc,


    ) {
        return {
            index,
            rqstId,
            userName,
            empCode,
            leaveTypeDesc,
            daysOfLeave,
            fromDate,
            ToDate,
            rqstStatusDesc,

        };
    }
    const columns = [

        {
            field: "index",
            headerName: "S.No",
            flex: 0.1,
            minWidth: 60,
            headerClassName: "super-app-theme--header",
            renderCell: (params) => params.row.index + ")",
        },
        {
            field: "rqstId",
            headerName: "Leave ID",
            flex: 0.2,
            minWidth: 100,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "userName",
            headerName: "User Name",
            flex: 0.2,
            minWidth: 120,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "empCode",
            headerName: "Emp Code",
            flex: 0.1,
            minWidth: 100,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "leaveTypeDesc",
            headerName: "Leave Type Desc.",
            flex: 0.2,
            minWidth: 180,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "daysOfLeave",
            headerName: "Days Of Leave",
            flex: 0.1,
            minWidth: 120,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "fromDate",
            headerName: "Leave Start",
            flex: 0.1,
            minWidth: 180,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "ToDate",
            headerName: "Leave End",
            flex: 0.1,
            minWidth: 180,
            headerClassName: "super-app-theme--header",
        },

        {
            field: "rqstStatusDesc",
            headerName: "Leave Current Status",
            flex: 0.1,
            minWidth: 220,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "requestStatus",
            headerName: "Track Status",
            flex: 0.3,
            minWidth: 100,
            headerClassName: "super-app-theme--header",
            renderCell: (params) => (
                <Link onClick={() => { setReqRemarks(params.row.remarks); setRequestStatus(params.value); handleClickOpen(); }}>
                    <LocationSearchingIcon color='primary' />
                </Link>
            )
        },

    ];

    const formik = useFormik({
        initialValues: searchedValues,
        enableReinitialize: false,
        validateOnChange: true,
        //validateOnBlur: true,

        onSubmit: (values) => {
            console.log("onSubmit Start");
            handleFetchApplicants(values, false);
            setSearchedValues(values);
            //navigate(location.pathname, { state: { searchValues: values } });
        },
    });

    const handleResetForm = () => {
        swal({
            title: "Do you want to reset the search?",
            buttons: { cancel: "Cancel", confirm: "Confirm" },

        }).then((userClickedConfirm) => {
            if (userClickedConfirm) {
                formik.setFieldValue("userName", null);
                setSelectAllApplications(false);

                const updatedValues = { ...initValues, status: null };
                formik.resetForm({ values: updatedValues });
                handleFetchApplicants(updatedValues, true);
                navigate(location.pathname, {});
            }
        });
    };

    //

    return (
        <>
            <Card sx={{ mx: 5, my: 2 }}>
                <CardContent>
                    <PageTitle name={title} />
                    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                        {/* <form onSubmit={formik.handleSubmit}> */}
                        <Grid
                            container
                            //rowSpacing={1}
                            columnSpacing={2}
                        >

                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                <TextField
                                    id="rqstId"
                                    name="rqstId"
                                    label="Leave ID"
                                    size="small"
                                    fullWidth
                                    value={formik.values.rqstId}
                                    onChange={formik.handleChange}

                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4}>


                                <Autocomplete
                                    freeSolo
                                    id="userName"
                                    name="userName"
                                    size="small"
                                    options={userNamelist.map((option) => option)}
                                    value={formik.values.userName}
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue("userName", newValue ?? "");
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            {...params}
                                            label="User Name"
                                            InputProps={{
                                                ...params.InputProps,
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* <Grid item xs={12} sm={4} md={3} lg={3}>
                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    id="employeeCode"
                                    options={empCode}
                                    value={formik.values.empCode}
                                    onChange={(e, value) => {
                                        formik.setFieldValue("empCode", value ?? null);
                                    }}
                                    getOptionLabel={(value) => value}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Employee Code"
                                            name="empCode"
                                            InputProps={{
                                                ...params.InputProps,
                                                inputProps: {
                                                    ...params.inputProps,
                                                    maxLength: 50,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid> */}



                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    id="rqstStatus"
                                    options={Enrollstatus}
                                    value={
                                        Enrollstatus.find(
                                            (option) => option.typeId === formik.values.rqstStatus
                                        ) || null
                                    }
                                    onChange={(e, value) => {
                                        formik.setFieldValue("rqstStatus", value?.typeId ?? null);
                                    }}
                                    getOptionLabel={(value) => value.typeName}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Leave Status"
                                            name="rqstStatus"
                                            InputProps={{
                                                ...params.InputProps,
                                                inputProps: {
                                                    ...params.inputProps,
                                                    maxLength: 50,
                                                },
                                            }}

                                        />
                                    )}
                                />
                            </Grid>



                        </Grid>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        //mt={2}
                        >
                            <Button
                                variant="contained"
                                //onClick={handleFetchApplicants}
                                type="submit"
                            >
                                <SearchIcon />
                                &nbsp;SEARCH
                            </Button>
                            <Button
                                variant="outlined"

                                onClick={handleResetForm}
                            >
                                <CachedIcon />
                                &nbsp;RESET
                            </Button>
                        </Stack>
                        {/* </form> */}
                    </Box>
                </CardContent>
            </Card>

            {Array.isArray(rows) && rows.length >= 1 && (
                <Card sx={{ mx: 5 }} elevation={3}>
                    <CardContent>
                        <PageTitle name={title1} />
                        <Box component={"div"}>

                            <SearchTable
                                initialNoOfRows={10}
                                // disablePrint={rows.length > 100 ? true : false}
                                disablePrint={true}
                                //columns={isAtleastOneIsSubmitted ? columns : updatedColumns}
                                columns={columns}
                                data={rows}
                                isCheckbox={false}
                                isHideDensity={false}
                                isHideExport={true}
                                isHideFilter={true}
                                isHideColumn={true}
                                isHidePaging={false}
                                //selectRowsOption={true}
                                //handleApplications={handleApplications}
                                name="manageLeave"
                                id="manageLeave"
                            />
                        </Box>
                    </CardContent>
                </Card>

            )}
            <Dialog
                fullWidth
                maxWidth={'md'}
                open={open}
                onClose={handleClose}
            >
                <DialogContent >
                    <TrackManageLeaveStatus />
                </DialogContent>
            </Dialog>

            {loading && <FaceBookCircularProgress />}
        </>
    );
};

export default SearchApplication;
