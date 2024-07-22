{
    "status": true,
    "message": "Educational Details fetched successfully",
    "result": [
        {
            "eduId": 28,
            "empId": 66,
            "qualificationId": {
                "id": 267,
                "label": "Graduation"
            },
            "instituteName": "KL",
            "boardOrUniversity": "Deemed",
            "course": "CSE",
            "marksCgpaId": {
                "id": 270,
                "label": "CGPA"
            },
            "marksSecured": null,
            "totalMarks": null,
            "cgpa": 9,
            "admissionDate": "19-07-2019",
            "completionDate": "17-07-2024",
            "filePath": null,
            "fileName": null,
            "crtBy": {
                "id": 1,
                "label": "raj18"
            },
            "crtOn": "18-07-2024 05:04 PM",
            "updBy": null,
            "updOn": "18-07-2024 05:04 PM"
        }
    ],
    "statusCode": 200
}





import CachedIcon from '@mui/icons-material/Cached';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';
import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Slide,
  TextField
} from "@mui/material";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from 'axios';
import dayjs from "dayjs";
import { useFormik } from 'formik';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
import * as Yup from 'yup';
import SearchTable from "../../components/SearchTableAlt";
import { useSnackbar } from "../../components/Snackbar";
import { H3 } from "../../components/Typography";
function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}
const QualifiactionDetails = ({ formData, setFormData, prevData, onButtonClick, view }) => {
  const validationSchema = Yup.object().shape({
    QualifiactionTypes: Yup.string().required("Qualification Type is required").nullable(),
    institute: Yup.string().required("Institute Name is required").nullable(),
    course: Yup.string().required("Course is required").nullable(),
    Board: Yup.string().required("Board is required").nullable(),
    marksCgpa: Yup.string().required("Marks/Cgpa is required").nullable(),
    marks: Yup.string().when("marksCgpa", {
      is: (value) => value === '269',
      then: Yup.string().required("Marks secured is required").nullable(),
    }).nullable(),
    totalMarks: Yup.string().when("marksCgpa", {
      is: (value) => value === '269',
      then: Yup.string().required("Total Marks is required").nullable(),
    }).nullable(),
    gpa: Yup.string().when("marksCgpa", {
      is: (value) => value === '270',
      then: Yup.string().required("Cgpa is required").nullable(),
    }).nullable(),
    admissionDate: Yup.string().required("Admission Date is required").nullable(),
    completionDate: Yup.string().required("Completion Date is required").nullable()
  })
  const formik = useFormik({
    initialValues: {
      QualifiactionTypes: null,
      degree: null,
      courseType: null,
      institute: '',
      course: '',
      Board: '',
      Duration: '',
      marksCgpa: null,
      marks: '',
      totalMarks: '',
      gpa: '',
      passingYear: '',
      admissionDate: null,
      completionDate: null
    },
    validationSchema: validationSchema,
  });
  const tomorrow = dayjs().add(0, 'day');
  const [qualificationList, setQualificationList] = useState([]);
  const [degreeList, setDegreeList] = useState([])
  const [courseList, setCourseList] = useState([])
  const [marksCgpaList, setMarksCgpaList] = useState([])
  const [rows, setRows] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("info");
  const { showSnackbar } = useSnackbar();
  const [showNext, setShowNext] = useState(view);
  const getValueFromList = (List, value) => {
    return List.find((option) => option.id === value) ?? null;
  };
  useEffect(() => {
    axios.get(`http://141.148.194.18:8052/payroll/employee/educational-details/dropdown-init`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`
      }
    }).then(response => {
      // let sortedData = response.data.map((value) => {
      //      value.label = value.label
      //      return value;
      //  })
      //  console.log(sortedData);
      if (response.status === 200) {
        setQualificationList(response.data.qualification);
        //setDegreeList(response.data.relationship);
        setMarksCgpaList(response.data.marksCgpa);
      }
      console.log(response);
    })
      .catch(error => {
        console.log(error);
      });
  }, [])


  useEffect(() => {
    if (view) {
      fetchData();
    }
  }, [view]);


  const fetchData = () => {
    axios.get(`http://141.148.194.18:8052/payroll/employee/educational-details/${formData.empRefNo}`, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
        }
    }).then(response => {

      const result = response.data.result;
      

    })
}
  const columns = [
    {
      field: "id",
      headerClassName: "super-app-theme--header",
      headerName: "S No.",
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hide: true
    },
    {
      width: 250,
      headerName: "Qualification Type",
      field: "qualificationId",
      headerClassName: "super-app-theme--header",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          getValueFromList(qualificationList, params.row.qualificationId).label
        )
      }
    },
    {
      width: 200,
      headerName: "Board/University",
      field: "boardOrUniversity",
      headerClassName: "super-app-theme--header",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    // {
    //   width: 200,
    //   headerName: "courseType",
    //   field: "CourseType",
    //   headerClassName: "super-app-theme--header",
    //   sortable: false,
    //   filterable: false,
    //   disableColumnMenu: true,
    // },
    {
      width: 200,
      headerName: "Institute Name",
      field: "instituteName",
      headerClassName: "super-app-theme--header",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      width: 200,
      headerName: "Course",
      field: "course",
      headerClassName: "super-app-theme--header",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    
    {
      field: "marksCgpaId",
      headerName: "Marks/Cgpa",
      width: 140,
      headerClassName: "super-app-theme--header",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          getValueFromList(marksCgpaList, params.row.marksCgpaId).label
        )
      }
    },
    {
      field: "marksSecured",
      headerName: "Marks Obtained",
      width: 140,
      headerClassName: "super-app-theme--header",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: "totalMarks",
      headerName: "Total Marks",
      width: 140,
      headerClassName: "super-app-theme--header",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      width: 200,
      headerName: "CGPA",
      field: "cgpa",
      headerClassName: "super-app-theme--header",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      width: 200,
      headerName: "Admission Date",
      field: "admissionDate",
      headerClassName: "super-app-theme--header",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          dayjs(params.row.admissionDate).format("DD-MM-YYYY")
        )
      }
    },
    {
      width: 200,
      headerName: "Completion Date",
      field: "completionDate",
      headerClassName: "super-app-theme--header",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          dayjs(params.row.completionDate).format("DD-MM-YYYY")
        )
      }
    },
    {
      field: "actiondelete",
      headerName: "Action",
      width: 140,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return (
          <Button
            variant="outlined"
            color="error"
            sx={{ mb: 1 }}
            // value={params.value}
            onClick={() => handleDeleteRow(params.row.id)}
          >
            Delete
          </Button>
        );
      },
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ];
  const addRow = () => {
    formik
      .validateForm()
      .then((formErrors) => {
        if (Object.keys(formErrors).length > 0) {
          console.log(Object.keys(formErrors))
          //alert(Object.keys(formErrors))
          setToastMessage("Please fill all the required * fields")
          setToastSeverity("error");
          setOpenToast(true);
        }
        else {
          const newRow = {
            id: rows.length + 1,
            qualificationId: formik.values.QualifiactionTypes,
            instituteName: formik.values.institute,
            boardOrUniversity: formik.values.Board,
            course: formik.values.course,
            marksCgpaId: formik.values.marksCgpa,
            marksSecured: formik.values.marks,
            totalMarks: formik.values.totalMarks,
            cgpa: formik.values.gpa,
            admissionDate: formik.values.admissionDate,
            completionDate: formik.values.completionDate,
            //filePath: null,
            actiondelete: ''
          };
          let temp = [...rows]
          temp.push(newRow)
          setRows(temp);
          formik.resetForm()
        }
      })
      .catch((err) => {
        formik.setSubmitting(false);
      });
  };
  console.log(rows);
  const handleFileUpload = (response, type) => {
    if (type === "upload") {
      formik.setFieldValue("filePath", { ...formik.values.docs, ...response });
    } else if (type === "delete") {
      formik.setFieldValue("filePath", response);
    }
  };
  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((row) => row.id !== index);
    const updatedRowsWithId = updatedRows.map((row, index) => ({
      ...row,
      id: index + 1,
    }));
    setRows(updatedRowsWithId);
  };
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
      SaveQualificationDetails();
    }
  };
  const SaveQualificationDetails = async () => {
    try {
      let arr = [];
      let obj = {}
      rows.map((it) => {
        obj = {
          "qualificationId": it.qualificationId,
          "instituteName": it.instituteName,
          "boardOrUniversity": it.boardOrUniversity,
          "course": it.course,
          "marksCgpaId": it.marksCgpaId,
          "marksSecured": it.marksSecured,
          "totalMarks": it.totalMarks,
          "cgpa": it.cgpa,
          "admissionDate": it.admissionDate,
          "completionDate": it.completionDate,
          "filePath": null
        }
        arr.push(obj)
      })
      let body = {
        // "refNo": "BRD0000000000027",
        "refNo": localStorage.getItem("refNo"),
        "educationalDetailsList": arr
      }
      const res = await axios.post(
        `${process.env.REACT_APP_PAYROLL_API_URL}/employee/educational-details`,
        body,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        }
      );
      console.log("the saved details  areeeeee", res);
      if (res.data.statusCode === 200) {
        showSnackbar(res.data.message, "success");
        setShowNext(true)
        onButtonClick("pagethree");
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };
  return (
    <Card>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf", marginBottom: "20px" }}>
          <SchoolIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
          <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Qualification Details</H3>
        </div>
        <Divider />
        {view !== true && (
          <Grid
            container
            direction="row"
            rowSpacing={0}
            columnSpacing={2}
            justify="flex-end"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Autocomplete
                disablePortal
                margin="normal"
                size="small"
                id="QualifiactionTypes"
                name="QualifiactionTypes"
                options={qualificationList}
                value={qualificationList.find(
                  (option) => option.id === formik.values.QualifiactionTypes
                ) || null}
                onChange={(e, value) => {
                  if (value === null) {
                    formik.setFieldValue("QualifiactionTypes", null)
                  }
                  else
                    formik.setFieldValue("QualifiactionTypes", value.id)
                }}
                getOptionLabel={(value) => value.label}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params}
                    label="Qualification Type"
                    required
                    onBlur={formik.handleBlur}
                    helperText={formik.errors.QualifiactionTypes ? formik.errors.QualifiactionTypes : null}
                    error={formik.errors.QualifiactionTypes ? true : false}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <TextField
                label="Board/University"
                required
                fullWidth
                name="Board"
                id="Board"
                size="small"
                value={formik.values.Board}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.errors.Board ? formik.errors.Board : null}
                error={formik.errors.Board ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <TextField
                label="Institute Name"
                required
                name="institute"
                id="institute"
                fullWidth
                size="small"
                value={formik.values.institute}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.errors.institute ? formik.errors.institute : null}
                error={formik.errors.institute ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <TextField
                label="Course"
                required
                name="course"
                id="course"
                fullWidth
                size="small"
                value={formik.values.course}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.errors.course ? formik.errors.course : null}
                error={formik.errors.course ? true : false}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Autocomplete
                disablePortal
                margin="normal"
                size="small"
                id="marksCgpa"
                name="marksCgpa"
                options={marksCgpaList}
                value={marksCgpaList.find(
                  (option) => option.id === formik.values.marksCgpa
                ) || null}
                onChange={(e, value) => {
                  if (value === null) {
                    formik.setFieldValue("marksCgpa", null)
                  }
                  else
                    formik.setFieldValue("marksCgpa", value.id)
                }}
                getOptionLabel={(value) => value.label}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params}
                    label="Marks/Cgpa"
                    required
                    onBlur={formik.handleBlur}
                    helperText={formik.errors.marksCgpa ? formik.errors.marksCgpa : null}
                    error={formik.errors.marksCgpa ? true : false}
                  />
                )}
              />
            </Grid>
            {formik.values.marksCgpa === 269 && (
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <TextField
                  label="Marks Obtained"
                  required
                  fullWidth
                  size="small"
                  name="marks"
                  id='marks'
                  value={formik.values.marks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={formik.errors.marks ? formik.errors.marks : null}
                  error={formik.errors.marks ? true : false}
                />
              </Grid>
            )}
            {formik.values.marksCgpa === 269 && (
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <TextField
                  label="Total Marks"
                  required
                  fullWidth
                  size="small"
                  name="totalMarks"
                  id='totalMarks'
                  value={formik.values.totalMarks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={formik.errors.totalMarks ? formik.errors.totalMarks : null}
                  error={formik.errors.totalMarks ? true : false}
                />
              </Grid>
            )}
            {formik.values.marksCgpa === 270 && (
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <TextField
                  label="CGPA"
                  name="gpa"
                  id='gpa'
                  required
                  fullWidth
                  size="small"
                  value={formik.values.gpa}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={formik.errors.gpa ? formik.errors.gpa : null}
                  error={formik.errors.gpa ? true : false}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={"en-gb"}
                >
                  <DatePicker
                    label="Admission Date"
                    format="DD-MM-YYYY"
                    maxDate={tomorrow}
                    slotProps={{ textField: { size: "small" } }}
                    sx={{ width: "100%", mt: 2 }}
                    id="admissionDate"
                    name="admissionDate"
                    size="small"
                    value={formik.values.admissionDate}
                    onChange={(value) => { if (value === null) { formik.setFieldValue("admissionDate", "") } else { formik.setFieldValue("admissionDate", dayjs(value).format('YYYY-MM-DD')) } }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        name="admissionDate"
                        required
                        {...params}
                        // error={formik.touched.admissionDate && Boolean(formik.errors.admissionDate)}
                        // helperText={formik.touched.admissionDate && formik.errors.admissionDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        helperText={formik.errors.admissionDate && formik.touched.admissionDate ? formik.errors.admissionDate : null}
                        error={formik.errors.admissionDate && formik.touched.admissionDate ? true : false}
                      />
                    )}
                  />
                  <p style={{ color: '#d42d2d', fontSize: "10px" }}>
                    {formik.errors.admissionDate ? formik.errors.admissionDate : null}
                  </p>
                </LocalizationProvider>
              </>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={"en-gb"}
                >
                  <DatePicker
                    label="Completion Date"
                    format="DD-MM-YYYY"
                    maxDate={tomorrow}
                    id="completionDate"
                    name="completionDate"
                    slotProps={{ textField: { size: "small" } }}
                    sx={{ width: "100%", mt: 2 }}
                    value={formik.values.completionDate}
                    onChange={(value) => { if (value === null) { formik.setFieldValue("completionDate", "") } else { formik.setFieldValue("completionDate", dayjs(value).format('YYYY-MM-DD')) } }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        fullWidth
                        margin="normal"
                        name="completionDate"
                        required
                        {...params}
                        error={formik.touched.completionDate && Boolean(formik.errors.completionDate)}
                        helperText={formik.touched.completionDate && formik.errors.completionDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    )}
                  />
                  <p style={{ color: '#d42d2d', fontSize: "10px" }}>
                    {formik.errors.completionDate ? formik.errors.completionDate : null}
                  </p>
                </LocalizationProvider>
              </>
            </Grid>
            
          </Grid>
        )}
        {view !== true && (
          <Box
            spacing={2}
            sx={{ mt: 1, textAlign: 'right' }}
          >
            <Button
              sx={{
                minWidth: 100,
                ml: 1,
              }}
              variant="contained"
              type="submit"
              onClick={() => {
                addRow()
              }}
            >
              <SaveIcon /> &nbsp; ADD
            </Button>
            <Button
              type="button"
              sx={{ minWidth: 100, ml: 1, mt: { xs: 1, md: 0 } }}
              onClick={() => {
                formik.resetForm()
              }}
              variant="outlined"
            >
              <CachedIcon />&nbsp;RESET
            </Button>
          </Box>
        )}
        {rows.length > 0 && (
          <Box component={"div"} >
            <SearchTable
              columns={columns}
              // data={rowss}
              data={rows}
              isCheckbox={false}
              isHideDensity={false}
              isHideExport={true}
              isHideFilter={true}
              isHideColumn={true}
              isHidePaging={false}
              name="villageName"
              id="villageName"
            />
          </Box>
        )}
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
          
          {view !== true && (
            <Button
              sx={{
                minWidth: 100,
                ml: 1,
                mt: { xs: 1, md: 0 },
              }}
              variant="contained"
              type="submit"
              // disabled={submitDisable}
              onClick={() => {
                // SaveQualificationDetails()
                if (rows.length > 0) {
                  callConfirmDialog();
                }
                else {
                  showSnackbar("Please add Qualification Details", "error");
                  return;
                }
                // checkValid();
                // setFormData((prevFormData) => ({
                //     ...prevFormData,
                //     pageone: { formik: formik.values }
                // }));
              }}
            >
              SUBMIT&nbsp;
              <SaveIcon></SaveIcon>
            </Button>
          )}
          <Button
            sx={{
              minWidth: 100, ml: 1, mt: { xs: 1, md: 0 }
            }}
            variant="outlined"
            //type="submit"
            disabled={!showNext}
            onClick={() => {
              onButtonClick("pagethree")
            }
            }
          >
            NEXT &nbsp;
            <NavigateNextIcon />
          </Button>
        </Box>
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
      </CardContent>
    </Card>
  )
}
export default QualifiactionDetails
