import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Card, CardContent, Typography, Slide } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import FaceIcon from "@mui/icons-material/Face";
import useTitle from "../../../hooks/useTitle";
import PageTitle from "../../../layouts/PageTitle";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { useLocation, useNavigate } from "react-router-dom";
import { H3 } from "../../../components/Typography";
import AlertConfirm from "react-alert-confirm";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useSnackbar } from "../../../components/Snackbar";
import "react-alert-confirm/lib/style.css";
import dayjs, { Dayjs } from "dayjs";
import LeadgerCard from "./LedgerCard";
import { useSelector } from "react-redux";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Cookies from "js-cookie";

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}
const today = dayjs();

const LeaveRequestDetails = () => {
  const [leaveBalance, setLeaveBalalnce] = useState([]);
  const [selectedLeaveStartDate, setSelectedLeaveStartDate] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [clicked, setClicked] = useState(false);
  const [startTimeList, setStartTimeList] = useState([]);
  const [endTimeList, setEndTimeList] = useState([]);
  const remarksMaxLength = 300;
  const location = useLocation();
  const data = location?.state?.requestId;
  const [leaveTypeDesc, setLeaveTypeDesc] = useState();
  const [reason, setReason] = useState();
  const [preffix, setPreffix] = useState();
  const [suffix, setSuffix] = useState();

  const [leaveDuration, setLeaveDuration] = useState();
  const [userName, setUserName] = useState();
  const [managerName, setManagerName] = useState();
  const [fetchData, setFetchData] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [fetchuserId, setFetchuserId] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [emergencydisplay, setEmergencydisplay] = useState();
  const [stationLeave, setStationLeave] = useState();
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [isactive, setIsActive] = useState(true);
  const [stepId, setStepId] = useState({});
  const [requestStartDate, setRequestStartDate] = useState("");
  const [requestEndDate, setRequestEndDate] = useState("");
  const [requestStartTime, setRequestStartTime] = useState("");
  const [requestEndTime, setRequestEndTime] = useState("");
  const [trackData, setTrackData] = useState([]);
  const [trackhide, setTrackhide] = useState(false);
  const [rqstFromTimeId, setRqstFromTimeId] = useState();
  const [rqstToTimeId, setRqstToTimeId] = useState();
  const [approvedToDate, setApprovedToDate] = useState();
  const [approvedFromDate, setApprovedFromDate] = useState();
  const [approveFromTimeId, setApproveFromTimeId] = useState();
  const [approveToTimeId, setApproveToTimeId] = useState();

  console.log(approvedToDate);
  console.log(approvedFromDate);



  const user = useSelector((state) => state.loginReducer);

  const validationSchema = Yup.object().shape({

    remarks: Yup.string()
      .required("Remarks is required")
      .nullable()
      .test(
        "word-count",
        "Your word length is greater than 200 words",
        (value) => {
          if (!value) return true; // Skip validation if the value is empty or null
          const wordCount = value.trim().split(/\s+/).length;
          return wordCount <= 200;
        }
      ),
  });

  useEffect(() => {
    formik.setValues({
      ...formik.values,
      LeavestartTime: (
        (approvedToDate === null && approvedFromDate === null)
          ? (
            rqstFromTimeId === 154 ? startTimeList[0]?.typeId :
              rqstFromTimeId === 155 ? startTimeList[1]?.typeId :
                formik.values.LeavestartTime
          )
          : (
            approveFromTimeId === 154 ? startTimeList[0]?.typeId :
              approveFromTimeId === 155 ? startTimeList[1]?.typeId :
                formik.values.LeavestartTime
          )
      ),
      LeaveEndTime: (
        (approvedToDate === null && approvedFromDate === null)
          ? (
            rqstToTimeId === 156 ? endTimeList[0]?.typeId :
              rqstToTimeId === 157 ? endTimeList[1]?.typeId :
                formik.values.LeaveEndTime
          )
          : (
            approveToTimeId === 156 ? endTimeList[0]?.typeId :
              approveToTimeId === 157 ? endTimeList[1]?.typeId :
                formik.values.LeaveEndTime
          )
      )
    });
  }, [rqstFromTimeId, rqstToTimeId, approveFromTimeId, approveToTimeId, startTimeList, endTimeList]);

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      LeaveStartDate: null,
      LeavestartTime: "", // Leave it empty initially
      LeaveEndDate: null,
      LeaveEndTime: "",
      remarks: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });



  useEffect(() => {
    if (fetchuserId) {
      fetchDataOnLeaveBalance();
    }
  }, [fetchuserId]);

  useEffect(() => {
    fetchDataOnLeaveId();
    fetchButtonDetails();
    statusTracker();
    axios
      .get(`http://141.148.194.18:8052/leavemanagement/leave-from-dropdown`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then((response) => {
        let sortedDropdownfromData = response.data.result.map((value) => {
          value.label = value.label;
          return value;
        });
        setStartTimeList(sortedDropdownfromData);
        console.log(sortedDropdownfromData);
      })
      .catch((error) => {
        setStartTimeList([]);
        console.log(error);
      });

    axios
      .get(`http://141.148.194.18:8052/leavemanagement/leave-to-dropdown`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then((response) => {
        let sortedDropdowntoData = response.data.result.map((value) => {
          value.label = value.label;
          return value;
        });

        setEndTimeList(sortedDropdowntoData);
        console.log(sortedDropdowntoData);
      })
      .catch((error) => {
        setEndTimeList([]);
        console.log(error);
      });
  }, []);

  const fetchDataOnLeaveId = async () => {
    try {
      const payload = {
        rqstId: data,
      };

      const response = await axios.post(
        `http://141.148.194.18:8052/leavemanagement/get-leave-detail`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      console.log(response.status);
      console.log(response.data.result);

      if (response.status === 200) {
        const exact3 = response.data.result.isEmergencyLeave;
        const exact4 = response.data.result.isStationLeave;

        if (exact3 === true) {
          setEmergencydisplay("YES");
        } else {
          setEmergencydisplay("NO");
        }

        if (exact4 === true) {
          setStationLeave("YES");
        } else {
          setStationLeave("NO");
        }
        if (response.status === 200) {
          setFetchData(response.data.result);
          setStartDate(response.data.result.rqstFromDate);
          setEndDate(response.data.result.rqstToDate);
          setStartTime(response.data.result.rqstFromTime);
          setEndTime(response.data.result.rqstToTime);
          setLeaveTypeDesc(response.data.result.leaveTypeDesc);
          setPreffix(response.data.result.preffix);
          setSuffix(response.data.result.suffix);
          setManagerName(response.data.result.managerName);
          setReason(response.data.result.reason);
          setIsActive(response.data.result.isActive);
          setFetchuserId(response.data.result.userId);
          setRqstToTimeId(response.data.result.rqstToTimeId);
          setRqstFromTimeId(response.data.result.rqstFromTimeId);
          setApproveFromTimeId(response.data.result.approveFromTimeId);
          setApproveToTimeId(response.data.result.approveToTimeId);
          setUserName(response.data.result.userName);
          setLeaveDuration(response.data.result.leaveDuration);

          console.log(response.data.result.rqstToTimeId);
          console.log(response.data.result.approvedToDate);


          var inputDate1 = response.data.result.rqstFromDate;
          var inputDate2 = response.data.result.rqstToDate;
          var inputDate3 = response.data.result.approvedFromDate;
          var inputDate4 = response.data.result.approvedToDate;


          function convertDateFormat(inputDate) {
            // Check if inputDate is null or undefined before splitting
            if (inputDate) {
              // Split the date string into day, month, and year
              var parts = inputDate.split('/');
              var day = parts[0];
              var month = parts[1];
              var year = parts[2];

              // Rearrange the parts to the yyyy-mm-dd format
              return year + '-' + month + '-' + day;
            }
            else {
              return null;
            }
          }

          setRequestStartDate(convertDateFormat(inputDate1));
          setRequestEndDate(convertDateFormat(inputDate2));
          setApprovedFromDate(convertDateFormat(inputDate3));
          setApprovedToDate(convertDateFormat(inputDate4));

        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setIsLoading(false);
    }
  };

  const statusTracker = async () => {
    try {
      const body = {
        rqstId: data,

      };

      console.log("Status Tracker", body);
      const res = await axios.post(
        `http://141.148.194.18:8052/leavemanagement/track-approve-table`,
        body,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        }

      );
      console.log("Status Tracker", res);
      if (res.data.result.length > 0) {
        console.log("the result ", res.data.result);
        setTrackData(res.data.result);
        setTrackhide(true);

      }
    } catch (error) {
      alert("No data found", error);
      console.log(error.message);
    }
  };

  const fetchButtonDetails = async () => {
    try {
      const payload = {
        rqstId: data,
      };

      const response = await axios.post(
        `http://141.148.194.18:8052/leavemanagement/step-action`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      console.log(response.status);
      console.log(response.data.result);

      if (response.status === 200) {
        // Extract stepId for Approve and Reject actions
        const approveAction = response.data.result.find(
          (action) => action.action === "Approve"
        );
        const rejectAction = response.data.result.find(
          (action) => action.action === "Reject"
        );

        if (approveAction && rejectAction) {
          // Set stepId for Approve and Reject buttons
          setStepId({
            approve: approveAction.stepId,
            reject: rejectAction.stepId,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(formik.values.remarks);


  const saveLeaveApproveDetails = async (prop) => {
 
    let formattedStartDate = null;
    let formattedEndDate = null;


    if (approvedToDate === null && approvedFromDate === null) {

      if (!formik.values.LeaveStartDate || !formik.values.LeaveEndDate) {

        formattedStartDate = requestStartDate;
        formattedEndDate = requestEndDate;

        dayjs(requestEndDate).format(
          "YYYY-MM-DD"
        );

      }
      else {
        formattedStartDate = dayjs(formik.values.LeaveStartDate).format(
          "YYYY-MM-DD"
        );
        formattedEndDate = dayjs(formik.values.LeaveEndDate).format(
          "YYYY-MM-DD"
        );
      }

    }
    else {
      if (!formik.values.LeaveStartDate || !formik.values.LeaveEndDate) {
        formattedStartDate = approvedFromDate;
        formattedEndDate = approvedToDate;


      }
      else {
        formattedStartDate = dayjs(formik.values.LeaveStartDate).format(
          "YYYY-MM-DD"
        );
        formattedEndDate = dayjs(formik.values.LeaveEndDate).format(
          "YYYY-MM-DD"
        );
      }

    }


    if (formik.values.LeaveEndDate) {
      formattedEndDate = dayjs(formik.values.LeaveEndDate).format("YYYY-MM-DD");
    }

    let approvedTimeTo = null;
    if (!formik.values.LeaveEndTime) {
      approvedTimeTo = rqstToTimeId;
    } else {
      approvedTimeTo = formik.values.LeaveEndTime;
    }

    let approvedTimeFrom = null;
    if (!formik.values.LeavestartTime) {
      approvedTimeFrom = rqstFromTimeId;
    } else {
      approvedTimeFrom = formik.values.LeavestartTime;
    }



    try {
      const body = {
        rqstId: data,
        approvedFrom: formattedStartDate,
        approvedTimeFrom: approvedTimeFrom,
        approvedTo: formattedEndDate,
        approvedTimeTo: approvedTimeTo,
        updBy: user.data.userdetails.user.userId,
        status: prop === "Approve" ? stepId.approve : stepId.reject,
        finalRemarks: formik.values.remarks,
      };

      console.log("the saved details  body", body);
      const res = await axios.post(
        `http://141.148.194.18:8052/leavemanagement/update-status`,
        body,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      console.log("the saved details  areeeeee", res);
      if (res.data.statusCode === 200) {
        console.log("the result ", res.data.result);

        setOpenToast(true);
        showSnackbar("Saved Successfully", "success");
        navigate("/leave-account");
      } else if (res.data.statusCode === 204) {
        setToastMessage(res.data.message)
        setToastSeverity("error");
        setOpenToast(true);
      }
    } catch (error) {

      alert("Data has not saved", error);
      console.log(error.message);
    }
  };

  const fetchDataOnLeaveBalance = async () => {
    try {
      const payload = {
        userId: fetchuserId,
      };

      const response = await axios.post(
        `http://141.148.194.18:8052/leavemanagement/leave-balance-dropdown`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      let sortedLeaveBallenceData = response.data.result.map((value) => {
        return value;
      });

      setLeaveBalalnce(sortedLeaveBallenceData);
      console.log(sortedLeaveBallenceData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenToast(false);
  };



  const filterEndTimeValues = (startTimeId) => {
    if (
      startTimeId === 155 &&
      formik.values.LeaveStartDate === formik.values.LeaveEndDate
    ) {
      // If starttimeId is 2, filter out the value with id 2 from time2
      return endTimeList.filter((value) => value.typeId !== 156);
    }
    return endTimeList; // Otherwise, return the original time2 array
  };

  const title = "Leave Request Form";
  useTitle(title);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = (prop) => {
    if (formik.values.remarks.length === 0) {
      showSnackbar("Please fill remarks", "error");
      return;
    }
    if (prop === "Approve") {
      callConfirmDialog(prop);
    }
    if (prop === "Reject") {
      callConfirmDialog(prop);
    }
    // console.log('Step ID', stepID[prop]);
  };


  const callConfirmDialog = async (prop) => {
    console.log("kp-confirm");
    const [action] = await AlertConfirm({
      title: "Confirm",
      desc: `Are you sure, you want to ${prop}?`,
    });

    AlertConfirm.config({
      okText: "Submit",
      cancelText: "Cancel",
    });

    if (action) {
      console.log("kp-saved");
      saveLeaveApproveDetails(prop);

    } else {
      //   setIsSubmit(false);
      showSnackbar("Did not save!", "error");
    }
  };
  return (
    <>

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
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            marginBlock: 15,
            borderBottom: "0.5px solid #d1d1cf",
            marginTop: "30px",
          }}
        >
          <ReceiptLongIcon sx={{ fontSize: "25px", color: "#246cb5" }} />
          <H3
            sx={{ fontSize: "15px", color: "#246cb5" }}
            marginLeft={0.5}
            my={0.5}
            display="flex"
            justifyContent="center"
            alignItems="flex-end"
          >
            Leave Balance Details
          </H3>
        </div>
        <Box sx={{ flexGrow: 1, mt: 2, elevation: "0" }}>
          <Grid container spacing={2} columns={16}>
            {leaveBalance.map((value, index) => (
              <LeadgerCard resData={value} key={index} />
            ))}
          </Grid>
        </Box>
      </Card>
      <Card>
        <CardContent>
          {/* <PageTitle name={"Apply for a purchase"} />
           */}
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              marginBlock: 15,
              borderBottom: "0.5px solid #d1d1cf",
              marginTop: "30px",
            }}
          >
            <FaceIcon sx={{ fontSize: "25px", color: "#246cb5" }} />
            <H3
              sx={{ fontSize: "15px", color: "#246cb5" }}
              marginLeft={0.5}
              my={0.5}
              display="flex"
              justifyContent="center"
              alignItems="flex-end"
            >
              Leave Request Details
            </H3>
          </div>
          <Box component={"form"} onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={2} direction="row" alignItems="center">
              <Grid item xs={12} sm={4} md={4} lg={4}>

            </Grid>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              marginBlock: 15,
              borderBottom: "0.5px solid #d1d1cf",
              marginTop: "30px",
            }}
          >
            <AssignmentTurnedInIcon
              sx={{ fontSize: "25px", color: "#246cb5" }}
            />
            <H3
              sx={{ fontSize: "15px", color: "#246cb5" }}
              marginLeft={0.5}
              my={0.5}
              display="flex"
              justifyContent="center"
              alignItems="flex-end"
            >
              Leave Approve
            </H3>
          </div>

          <Card sx={{ my: 2 }} >
            <CardContent>
             



                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  sx={{ width: "100%", columnGap: "20px" }}
                >
                  {stepId.approve && (
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ float: "right", borderRadius: "4px" }}
                        onClick={() => handleSubmit("Approve")}
                      >
                        Approve
                      </Button>
                    </Grid>
                  )}
                  {stepId.reject && (
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          float: "right",
                          marginRight: "12px",
                          borderRadius: "4px",
                        }}
                        onClick={() => handleSubmit("Reject")}
                      >
                        Reject
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </>
  );
};

export default LeaveRequestDetails;
