{
  "rqstId":130
}


import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Grid, Box, Card, CardContent, IconButton, Stack, Link, Button } from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useNavigate } from 'react-router-dom';
import useTitle from '../../../hooks/useTitle';
import { H3 } from '../../../components/Typography';
import AlertConfirm from "react-alert-confirm";
import { useSnackbar } from "../../../components/Snackbar";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "react-alert-confirm/lib/style.css";

const AssignedLeaves = () => {
  const [trackData, setTrackData] = useState([]);
  const title = 'Track Leave Request';
  useTitle(title);

  const navigate = useNavigate();
  useEffect(() => {
    statusTracker();

  }, []);

  const statusTracker = async (data) => {
    try {
      const body = {
        rqstId: 130

      };

      console.log("Status Tracker", body);
      const res = await axios.post(
        `http://141.148.194.18:8095/leavemanagement/track-status-table`,
        body,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        }

      );
      console.log("Status Tracker", res);
      if (res.data.statusCode == 200) {
        console.log("the result ", res.data.result);
        setTrackData(res.data.result);


      }
    } catch (error) {
      alert("No data found", error);
      console.log(error.message);
    }
  };


  return (
    <>
      <Card sx={{ my: 2 }} elevation={3}>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf", marginTop: '30px' }}>
            <EventBusyIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
            <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Track Leave Request</H3>
          </div>
          <Box component={"div"} >

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell><h7><b>S.NO</b></h7></TableCell>
                    <TableCell><h7><b>Action By</b></h7></TableCell>
                    <TableCell><h7><b>Action On</b></h7></TableCell>
                    <TableCell><h7><b>Remarks</b></h7></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trackData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{row.statusDesc}</TableCell>
                      <TableCell>{row.updOn}</TableCell>
                      <TableCell>{row.remarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>


          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default AssignedLeaves






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
    const [dubby, setDubby] = useState();

    const [departmentList, setDepartmentList] = useState([]);
    const [Leavestatus, setLeavestatus] = useState([]);
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
            setDepartmentList(sortedDepartment)


        })
            .catch(error => {
                setDepartmentList([]);
                console.log(error);
            });





    }, []);

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
                userName: null,
                rqstStatus: values.rqstStatus,
                rqstFrom: values.rqstFrom,
                rqstTo: values.rqstTo,
                userId: values.userName
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
            if (response.data.statusCode === 200) {
                console.log("formattedData");
                setUserNamelist(response.data.result.nameList);
                setLeavestatus(response.data.result.statusDropdown);

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
                console.log(response.data.statusCode);
               
                if (reset) {
                    showSnackbar("Reset successful", "info");
                } else {
                    showSnackbar("Data fetched successfully", "success");
                }
            } else if (response.data.statusCode === 400 ) {
                setRows([]);
                if (reset) {
                    showSnackbar("Form reset successful, no data found", "info");
                } else {
                    showSnackbar("No data found", "info");
                }
            } else if (response.data.statusCode === 204 ) {
                setRows([]);
                if (reset) {
                    showSnackbar("Form reset successful, no data found", "info");
                } else {
                    showSnackbar("No data found", "info");
                }
            }
            
            else {
                setRows([]);
                showSnackbar("An error occurred", "error");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setRows([]);
            setLoading(false);
            // console.log(error.response.status);
            if (error.response.data.status === 400 ) {
                // console.log("hello");
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
                formik.setFieldValue("rqstId", "");
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

                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <TextField
                                    id="rqstId"
                                    name="rqstId"
                                    label="Leave ID"
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                        maxLength: 50,
                                    }}
                                    value={formik.values.rqstId}
                                    onChange={formik.handleChange}

                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={3}>
                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    id="department"
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
                                            name="department"
                                            InputProps={{
                                                ...params.InputProps,
                                                inputProps: {
                                                    ...params.inputProps,

                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Autocomplete

                                    id="userName"
                                    name="userName"
                                    size="small"
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
                                            size="small"
                                            {...params}
                                            label="Name"
                                            InputProps={{
                                                ...params.InputProps,
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    id="rqstStatus"
                                    options={Leavestatus}
                                    value={
                                        Leavestatus.find(
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

