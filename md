<React.Fragment>
                                                    {disabilities.map((disability, index) => (
                                                        <Grid
                                                            container
                                                            direction="row"
                                                            rowSpacing={0}
                                                            columnSpacing={2}
                                                            justify="flex-end"
                                                            alignItems="center"
                                                            key={index}
                                                        >
                                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                <Autocomplete
                                                                    disablePortal
                                                                    margin="normal"
                                                                    size="small"
                                                                    id={`disabilityType-${index}`}
                                                                    name={`disabilityType-${index}`}
                                                                    options={availableDisabilities}
                                                                    value={availableDisabilities.find(option => option.id === disability.type) || null}
                                                                    onChange={(e, value) => handleDisabilityChange(index, value)}
                                                                    getOptionLabel={(option) => option.name}
                                                                    renderInput={(params) => <TextField {...params} label="Type of Disability" />}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                <TextField
                                                                    fullWidth
                                                                    id={`disabilityPercentage-${index}`}
                                                                    name={`disabilityPercentage-${index}`}
                                                                    label="Disability Percentage"
                                                                    type="number"
                                                                    InputLabelProps={{ shrink: true }}
                                                                    value={disability.percentage}
                                                                    onChange={(e) => handlePercentageChange(index, e.target.value)}
                                                                    error={formik.touched[`disabilityPercentage-${index}`] && Boolean(formik.errors[`disabilityPercentage-${index}`])}
                                                                    helperText={formik.touched[`disabilityPercentage-${index}`] && formik.errors[`disabilityPercentage-${index}`]}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                <IconButton onClick={() => handleRemoveDisability(index)} aria-label="delete" className={classes.buttonIcon} disabled={disabilities.length === 1}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <IconButton onClick={handleAddDisability} aria-label="add" className={classes.buttonIcon}>
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </React.Fragment>

import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';

import axios from 'axios';
import dayjs from "dayjs";
import { useFormik } from 'formik';
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import { useSnackbar } from "../../components/Snackbar";


const validationSchema = Yup.object().shape({
    prefix: Yup.string().required("Prefix is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    gender: Yup.string().required("Gender is required").nullable(),
    dob: Yup.string().required("Date of Birth is required").nullable(),
    height: Yup.string().required("Height is required").nullable(),
 
    currentOffice: Yup.string().required('Current Office is required'),

    // apcosId: Yup.string().required('Apcos Id is required'),
    // id: Yup.string().required('id is required'),
});
const SavePersonalDetails = ({ formData, setFormData, prevData, onButtonClick }) => {
    const classes = useAlertSaveStyles();
    const user = useSelector((state) => state.loginReducer);
   
    const [currentOffice, setCurrentOffice] = useState('');
    const [disabilities, setDisabilities] = useState([]);
    const [disabilityList, setTypeofDisabilityList] = useState([]);
    const [availableDisabilities, setAvailableDisabilities] = useState([]); // Initialize as empty array

    useEffect(() => {
        axios.get(`http://141.148.194.18:8052/payroll/employee/dropdown/state`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        }).then(response => {
            console.log(response)
            if (response.status === 200) {
                setStatelist(response.data);
            }
            console.log(response);
        })
        .catch(error => {
            setStatelist([]);
            console.log(error);
        });

        axios.get(`http://141.148.194.18:8052/payroll/employee/dropdown-init`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        }).then(response => {
            if (response.status === 200) {
                setCategoryList(response.data.socialCategory);
                setTypeofDisabilityList(response.data.typesOfDisability);
                setDepartmentList(response.data.department);
                setGpfPranList(response.data.gpfPranType)
                setSrcOfRecruitmentList(response.data.sourceOfRecruitment);
                setHeightList(response.data.heightCmFeet)
                setPayslipAuthorityList(response.data.payslipAuthority)
                setQuarterTypelist(response.data.quarterType)
                setJoiningTimeList(response.data.joiningTime)
                // Initialize available disabilities here initially
                setAvailableDisabilities(response.data.typesOfDisability || []);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            physicallyHandicapped: 'false',
            disabilityType: '',
            disabilityPercentage: null,
            currentOffice: currentOffice,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            savePersonalDetails();
            setFormData((prevFormData) => ({
                ...prevFormData,
                pageone: { formik: formik.values, familyDetailsFormik: familyDetailsFormik.values, image: imageUploadedFile, disable: disableoption, disableOtp: isOtpButtonDisabled, Next: showNext }
            }));
        },
    });

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setCurrentOffice('');
        formik.setFieldValue('currentOffice', '');
    };

    const handleOfficeSelect = (officeName) => {
        setCurrentOffice(officeName);
        formik.setFieldValue('currentOffice', officeName);
    };

    useEffect(() => {
        if (formik.values.physicallyHandicapped === 'true' && disabilities.length === 0) {
            handleAddDisability();
        }
    }, [formik.values.physicallyHandicapped]);

    const handleAddDisability = () => {
        setDisabilities([...disabilities, { type: '', percentage: '' }]);
    };

    const handleRemoveDisability = (index) => {
        if (index === 0) return; // Prevent removing the first row
        const updatedDisabilities = [...disabilities];
        updatedDisabilities.splice(index, 1);
        setDisabilities(updatedDisabilities);
        // Add removed disability back to availableDisabilities
        if (disabilities[index]?.type) {
            setAvailableDisabilities([...availableDisabilities, disabilities[index].type]);
        }
    };

    const handleDisabilityChange = (index, value) => {
        const updatedDisabilities = [...disabilities];
        updatedDisabilities[index].type = value ? value.id : '';
        setDisabilities(updatedDisabilities);
        setAvailableDisabilities(availableDisabilities.filter(dis => dis !== value.id));
    };

    const handlePercentageChange = (index, value) => {
        const updatedDisabilities = [...disabilities];
        updatedDisabilities[index].percentage = value;
        setDisabilities(updatedDisabilities);
    };

    const savePersonalDetails = async () => {
        try {
            let body = {
                "isDisabled": formik.values.physicallyHandicapped,
                "appointOrdNo": 'ORD123',
                "appointOrdDate": formik.values.appointmentOrdDate,
                "distId": formik.values.distIdcommunication,
                "pincode": formik.values.pincodecomm,
                "disabilityDetails": formik.values.physicallyHandicapped === "true" ? disabilities.map(disability => ({
                    "disabilityType": disability.type,
                    "disabilityPercent": disability.percentage
                })) : []
            };
            const res = await axios.post(
                `${process.env.REACT_APP_PAYROLL_API_URL}/employee/personal-details`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`
                    }
                }
            );
            console.log("the saved details are", res);
            if (res.data.statusCode === 200) {
                showSnackbar(res.data.message + " " + res.data.result, "success");
            }
        } catch (error) {
            showSnackbar("Data has not saved", "error");
            console.log(error.message);
        }
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <form onSubmit={formik.handleSubmit}>
                                <Card sx={{ boxShadow: "none" }}>
                                    <CardContent>
                                        <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf", marginBottom: "20px" }}>
                                            <PersonIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
                                            <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Employee Personal Details</H3>
                                        </div>
                                        <Divider />
                                        <Grid
                                            container
                                            direction="row"
                                            rowSpacing={0}
                                            columnSpacing={2}
                                            justify="flex-end"
                                            alignItems="center"
                                            sx={{ mb: 1 }}
                                        >
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <FormControl>
                                                    <FormLabel id="demo-row-radio-buttons-group-label">
                                                        Disability (yes/no)
                                                    </FormLabel>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                                        name="physicallyHandicapped"
                                                        value={formik.values.physicallyHandicapped}
                                                        onChange={(e) => {
                                                            formik.setFieldValue("physicallyHandicapped", e.target.value);
                                                            if (e.target.value === 'false') {
                                                                setDisabilities([]);
                                                                setAvailableDisabilities(disabilityList.map(dis => dis.id)); // Reset available disabilities
                                                            }
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            value="true"
                                                            control={<Radio />}
                                                            label="Yes"
                                                        />
                                                        <FormControlLabel
                                                            value="false"
                                                            control={<Radio />}
                                                            label="No"
                                                        />
                                                    </RadioGroup>
                                                    {formik.touched.physicallyHandicapped &&
                                                        formik.errors.physicallyHandicapped && (
                                                            <FormHelperText error>
                                                                {formik.errors.physicallyHandicapped}
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            {formik.values.physicallyHandicapped === 'true' && (
                                                <React.Fragment>
                                                    {disabilities.map((disability, index) => (
                                                        <Grid
                                                            container
                                                            direction="row"
                                                            rowSpacing={0}
                                                            columnSpacing={2}
                                                            justify="flex-end"
                                                            alignItems="center"
                                                            key={index}
                                                        >
                                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                <Autocomplete
                                                                    disablePortal
                                                                    margin="normal"
                                                                    size="small"
                                                                    id={`disabilityType-${index}`}
                                                                    name={`disabilityType-${index}`}
                                                                    options={disabilityList.filter(dis => availableDisabilities.includes(dis.id))}
                                                                    value={disabilityList.find(option => option.id === disability.type) || null}
                                                                    onChange={(e, value) => handleDisabilityChange(index, value)}
                                                                    getOptionLabel={(value) => value.label}
                                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Type of Disability"
                                                                            onBlur={formik.handleBlur}
                                                                            InputLabelProps={{ shrink: true }}
                                                                            helperText={formik.errors[`disabilityType-${index}`] || ''}
                                                                            error={!!formik.errors[`disabilityType-${index}`]}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                <TextField
                                                                    margin="normal"
                                                                    fullWidth
                                                                    type="number"
                                                                    id={`disabilityPercentage-${index}`}
                                                                    name={`disabilityPercentage-${index}`}
                                                                    label="Percentage of Disability"
                                                                    size="small"
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onChange={(e) => handlePercentageChange(index, e.target.value)}
                                                                    onBlur={formik.handleBlur}
                                                                    value={disability.percentage}
                                                                    error={!!formik.errors[`disabilityPercentage-${index}`]}
                                                                    helperText={formik.errors[`disabilityPercentage-${index}`] || ''}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                <IconButton onClick={() => handleRemoveDisability(index)} color="error" disabled={index === 0}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                                <IconButton onClick={handleAddDisability} color="primary">
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                </React.Fragment>
                                            )}

                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    id="officialEmail"
                                                    name="officialEmail"
                                                    label="Official Email Id"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.officialEmail}
                                                    error={formik.touched.officialEmail && !!formik.errors.officialEmail}
                                                    helperText={formik.touched.officialEmail && formik.errors.officialEmail}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    id="officialMobile"
                                                    name="officialMobile"
                                                    label="Official Mobile Number"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.officialMobile}
                                                    error={formik.touched.officialMobile && !!formik.errors.officialMobile}
                                                    helperText={formik.touched.officialMobile && formik.errors.officialMobile}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <Autocomplete
                                                    disablePortal
                                                    margin="normal"
                                                    size="small"
                                                    id="nationality"
                                                    name="nationality"
                                                    options={nationalityList}
                                                    value={
                                                        nationalityList.find(
                                                            (option) =>
                                                                option.id ===
                                                                formik.values.nationality
                                                        ) || null
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value === null) {
                                                            formik.setFieldValue("nationality", null);
                                                        } else formik.setFieldValue("nationality", value.id);
                                                    }}
                                                    getOptionLabel={(value) => value.label}
                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Nationality"
                                                            required
                                                            onBlur={formik.handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            helperText={
                                                                formik.errors.nationality &&
                                                                    formik.touched.nationality
                                                                    ? formik.errors.nationality
                                                                    : null
                                                            }
                                                            error={
                                                                formik.errors.nationality &&
                                                                    formik.touched.nationality
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <Autocomplete
                                                    disablePortal
                                                    margin="normal"
                                                    size="small"
                                                    id="religion"
                                                    name="religion"
                                                    options={religionList}
                                                    value={
                                                        religionList.find(
                                                            (option) =>
                                                                option.id ===
                                                                formik.values.religion
                                                        ) || null
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value === null) {
                                                            formik.setFieldValue("religion", null);
                                                        } else formik.setFieldValue("religion", value.id);
                                                    }}
                                                    getOptionLabel={(value) => value.label}
                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Religion"
                                                            required
                                                            onBlur={formik.handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            helperText={
                                                                formik.errors.religion &&
                                                                    formik.touched.religion
                                                                    ? formik.errors.religion
                                                                    : null
                                                            }
                                                            error={
                                                                formik.errors.religion &&
                                                                    formik.touched.religion
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <Button
                                        sx={{
                                            minWidth: 100,
                                            ml: 1,
                                            mt: 2,
                                        }}
                                        variant="contained"
                                        type="submit"
                                        disabled={submitDisable}
                                        onClick={() => {
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                pageone: { formik: formik.values, familyDetailsFormik: familyDetailsFormik.values, image: imageUploadedFile, disable: disableoption, disableOtp: isOtpButtonDisabled, Next: showNext }
                                            }));
                                        }}
                                    >
                                        SUBMIT&nbsp;
                                        <SaveIcon></SaveIcon>
                                    </Button>
                                    <Button
                                        sx={{
                                            minWidth: 100, ml: 1, mt: 2
                                        }}
                                        variant="outlined"
                                        onClick={() => {
                                            onButtonClick("pagetwo")
                                        }}
                                    >
                                        NEXT &nbsp;
                                        <NavigateNextIcon />
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {openModal && (
                <SearchModal
                    closeModal={handleCloseModal}
                    onOfficeSelect={handleOfficeSelect}
                />
            )}
        </>
    );
};

export default SavePersonalDetails;












import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FeedIcon from '@mui/icons-material/Feed';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PersonIcon from '@mui/icons-material/Person';
import PinDropTwoToneIcon from "@mui/icons-material/PinDropTwoTone";
import PostAddIcon from '@mui/icons-material/PostAdd';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Slide,
    TextField,
    // Modal,
    Tooltip,
    Typography
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { makeStyles } from "@mui/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from 'axios';
import dayjs from "dayjs";
import { useFormik } from 'formik';
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import { useSnackbar } from "../../components/Snackbar";
import { H3 } from "../../components/Typography";
import ImageUploadCard from "./ImageUploadCard";
import SearchModal from "./SearchModal";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

const validationSchema = Yup.object().shape({
    prefix: Yup.string().required("Prefix is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    gender: Yup.string().required("Gender is required").nullable(),
    dob: Yup.string().required("Date of Birth is required").nullable(),
    height: Yup.string().required("Height is required").nullable(),
    heightText: Yup.string().when("height", {
        is: (value) => value === '144',
        then: Yup.string().required("Specify height").nullable(),
    }).nullable(),
    heightInFeet: Yup.string().when("height", {
        is: (value) => value === '145',
        then: Yup.string().required("Specify height in Feet").nullable(),
    }).nullable(),
    identificationMarks: Yup.string()
        .matches(
            /^[a-zA-Z\s]+$/,
            "Only Alphabetical characters are allowed"
        )
        .required("Identification Marks is required")
        .min(5, "Identification Mark must contain at least 5 characters"),
    fatherName: Yup.string().required("Father Name is required"),
    motherName: Yup.string().required("Mother Name is required"),
    employeeType: Yup.string().required("Employee Type is required"),
    maritalStatus: Yup.string().required('Marital Status is required').nullable(),
    spouseName: Yup.string().when("maritalStatus", {
        is: (value) => (value === '149' || value === '148' || value === '151'),
        then: Yup.string().required("Spouse Name is required").nullable(),
    }).nullable(),
    physicallyHandicapped: Yup.string().required("Physically Handicapped is required").nullable(),
    disabilityPercentage: Yup.string().when("physicallyHandicapped", {
        is: (value) => value === "true",
        then: Yup.string()
            .matches(/^[0-9]+$/, "Invalid Percentage")
            .required("Disability Percentage is required")
            .nullable(),
    }).nullable(),
    disabilityType: Yup.string()
        .when("physicallyHandicapped", {
            is: (value) => value === "true",
            then: Yup.string().required("Disability Type is required").nullable(),
        })
        .nullable(),
    bloodGrp: Yup.string().required('Blood Group is required').nullable(),
    personalemail: Yup.string()
        .email("Enter a valid email address")
        .required("Personal Email ID is required"),
    personalMobile: Yup.string("Enter a valid Contact Number")
        .matches(/^[0-9]+$/, "Invalid Contact number")
        .required("Personal Mobile Number is required")
        .min(10, "Mobile Number Must be 10 digits")
        .max(10, "Mobile Number must not exceed 10 digits")
        .nullable(),
    officialEmail: Yup.string()
        .email("Enter a valid email address")
        .required("Official Email ID is required"),
    officialMobile: Yup.string("Enter a valid Contact Number")
        .matches(/^[0-9]+$/, "Invalid Contact number")
        .required("Official Mobile Number is required")
        .min(10, "Mobile Number Must be 10 digits")
        .max(10, "Mobile Number must not exceed 10 digits")
        .nullable(),
    nationality: Yup.string().required('Nationality is required').nullable(),
    socialCategory: Yup.string().required('Social Category is required').nullable(),
    religion: Yup.string().required('Religion is required').nullable(),
    pancard: Yup.string()
        .matches(/^[A-Z]{5}\d{4}[A-Z]$/, 'Enter a valid PAN number')
        .required('PAN number is required'),
    Aadhaar: Yup.string()
        .matches(/^\d{12}$/, "Enter a valid Aadhaar number")
        .required('Aadhaar Card is required'),
    employeeType: Yup.string().required('Employee Type is required').nullable(),
    currentDept: Yup.string().required('Current Department is required').nullable(),
    //currentDesgn: Yup.string().required('Current Designation is required').nullable(),
    appointmentOrdDate: Yup.string().required("Appointment Order Date is required").nullable(),
    joiningDate: Yup.string().required("Joining Date is required").nullable(),
    confirmationDate: Yup.string().required("Confirmation Date is required").nullable(),
    superannuationDate: Yup.string().required("superannuation Date is required").nullable(),
    houseNumberComm: Yup.string().required("House No. is required"),
    streetcomm: Yup.string().required("Street is required"),
    pincodecomm: Yup.string().required("Pincode is required"),

    currentOffice: Yup.string().required('Current Office is required'),

    // apcosId: Yup.string().required('Apcos Id is required'),
    // id: Yup.string().required('id is required'),
});
const SavePersonalDetails = ({ formData, setFormData, prevData, onButtonClick }) => {
    const classes = useAlertSaveStyles();
    const user = useSelector((state) => state.loginReducer);
    // console.log(user)
   
    const [currentOffice, setCurrentOffice] = useState('');
    const [disabilities, setDisabilities] = useState([]);
    const [disabilityList, setTypeofDisabilityList] = useState([]);
    const [availableDisabilities, setAvailableDisabilities] = useState(disabilityList);

    useEffect(() => {

        axios.get(`http://141.148.194.18:8052/payroll/employee/dropdown/state`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        }).then(response => {
            console.log(response)
            if (response.status === 200) {
                setStatelist(response.data);
                // setIsServiceType(false);
            }
            console.log(response);
        })
            .catch(error => {
                setStatelist([]);
                console.log(error);
            });





        axios.get(`http://141.148.194.18:8052/payroll/employee/dropdown-init`, {
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
                setPrefixList(response.data.prefix);
                setNationalityList(response.data.nationality);
                setGenderList(response.data.gender);
                setCasteList(response.data.caste);
                setRelationList(response.data.relationship);
                setReligionList(response.data.religion)
                setMaritalStatusList(response.data.maritalStatus);
                setEmployeeList(response.data.employeeType);
                setBloodgroupList(response.data.bloodGroup);
                setCategoryList(response.data.socialCategory);
                setTypeofDisabilityList(response.data.typesOfDisability);
                setDepartmentList(response.data.department);
                setGpfPranList(response.data.gpfPranType)
                setSrcOfRecruitmentList(response.data.sourceOfRecruitment);
                setHeightList(response.data.heightCmFeet)
                setPayslipAuthorityList(response.data.payslipAuthority)
                setQuarterTypelist(response.data.quarterType)
                setJoiningTimeList(response.data.joiningTime)

            }
            console.log(response.data.typesOfDisability);
        })
            .catch(error => {
                console.log(error);
            });
    }, [])

    const formik = useFormik({
        initialValues: {

            physicallyHandicapped: 'false',
            disabilityType: '',
            disabilityPercentage: null,
            currentOffice: currentOffice,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            savePersonalDetails()
            // Handle form submission or API integration here
            setFormData((prevFormData) => ({
                ...prevFormData,
                pageone: { formik: formik.values, familyDetailsFormik: familyDetailsFormik.values, image: imageUploadedFile, disable: disableoption, disableOtp: isOtpButtonDisabled, Next: showNext }
            }));
        },
    });

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setCurrentOffice('');
        formik.setFieldValue('currentOffice', '');
    };

    const handleOfficeSelect = (officeName) => {
        setCurrentOffice(officeName);
        formik.setFieldValue('currentOffice', officeName);
    };
    useEffect(() => {
        if (formik.values.physicallyHandicapped === 'true' && disabilities.length === 0) {
            handleAddDisability();
        }
    }, [formik.values.physicallyHandicapped]);

    const handleAddDisability = () => {
        setDisabilities([...disabilities, { type: '', percentage: '' }]);
    };

    const handleRemoveDisability = (index) => {
        if (index === 0) return; // Prevent removing the first row
        const updatedDisabilities = [...disabilities];
        const removed = updatedDisabilities.splice(index, 1);
        setDisabilities(updatedDisabilities);
        setAvailableDisabilities([...availableDisabilities, removed[0]]);
    };

    const handleDisabilityChange = (index, value) => {
        const updatedDisabilities = [...disabilities];
        updatedDisabilities[index].type = value ? value.id : '';
        setDisabilities(updatedDisabilities);
        setAvailableDisabilities(disabilityList.filter(dis => !updatedDisabilities.some(d => d.type === dis.id)));
    };

    const handlePercentageChange = (index, value) => {
        const updatedDisabilities = [...disabilities];
        updatedDisabilities[index].percentage = value;
        setDisabilities(updatedDisabilities);
    };

    const savePersonalDetails = async (data) => {
        try {
            // let obj;
            // if(formik.values.physicallyHandicapped==="true"){
            //     obj={
            //         "disabilityType": formik.values.disabilityType,
            //         "disabilityPercent": formik.values.disabilityPercentage
            //     }
            // }
            let body = {
                
                "isDisabled": formik.values.physicallyHandicapped,
               
                "appointOrdNo": 'ORD123',
                "appointOrdDate": formik.values.appointmentOrdDate,
                "distId": formik.values.distIdcommunication,
                "pincode": formik.values.pincodecomm,
                "disabilityDetails": formik.values.physicallyHandicapped === "true" ? [
                    {
                        "disabilityType": formik.values.disabilityType,
                        "disabilityPercent": formik.values.disabilityPercentage
                    }
                ] : []
            };
            const res = await axios.post(
                `${process.env.REACT_APP_PAYROLL_API_URL}/employee/personal-details`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`
                    }
                }
            );
            console.log("the saved details  areeeeee", res);
            if (res.data.statusCode === 200) {
                showSnackbar(res.data.message + " " + res.data.result, "success");
            }
        } catch (error) {
            alert("Data has not saved", error);
            console.log(error.message);
        }
    };
    return (
        <>
                   
            <Grid container>
                <Grid item xs={12}>
                    <Card >
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
                                <Card sx={{ boxShadow: "none" }}>
                                    <CardContent>
                                        <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf", marginBottom: "20px" }}>
                                            <PersonIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
                                            <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Employee Personal Details</H3>
                                        </div>
                                        <Divider />
                                        <Grid
                                            container
                                            direction="row"
                                            rowSpacing={0}
                                            columnSpacing={2}
                                            justify="flex-end"
                                            alignItems="center"
                                            sx={{ mb: 1 }}
                                        >
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <FormControl>
                                                    <FormLabel id="demo-row-radio-buttons-group-label">
                                                        Disability (yes/no)
                                                    </FormLabel>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                                        name="physicallyHandicapped"
                                                        value={formik.values.physicallyHandicapped}
                                                        onChange={(e) => {
                                                            formik.setFieldValue("physicallyHandicapped", e.target.value);
                                                            if (e.target.value === 'false') {
                                                                setDisabilities([{ type: '', percentage: '' }]);
                                                                setAvailableDisabilities(disabilityList);
                                                            }
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            value="true"
                                                            control={<Radio />}
                                                            label="Yes" />
                                                        <FormControlLabel
                                                            value="false"
                                                            control={<Radio />}
                                                            label="No" />
                                                    </RadioGroup>
                                                    {formik.touched.physicallyHandicapped &&
                                                        formik.errors.physicallyHandicapped && (
                                                            <FormHelperText error>
                                                                {formik.errors.physicallyHandicapped}
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>
                                            {formik.values.physicallyHandicapped === 'true' && (
                                                <React.Fragment>
                                                    {disabilities.map((disability, index) => (
                                                        <React.Fragment key={index}>
                                                            <Grid
                                                                container
                                                                direction="row"
                                                                rowSpacing={0}
                                                                columnSpacing={2}
                                                                justify="flex-end"
                                                                alignItems="center"

                                                            >
                                                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                    <Autocomplete
                                                                        disablePortal
                                                                        margin="normal"
                                                                        size="small"
                                                                        id={`disabilityType-${index}`}
                                                                        name={`disabilityType-${index}`}
                                                                        options={availableDisabilities}
                                                                        value={disabilityList.find(option => option.id === disability.type) || null}
                                                                        onChange={(e, value) => handleDisabilityChange(index, value)}
                                                                        getOptionLabel={(value) => value.label}
                                                                        sx={{ width: "100%", mt: 2, mb: 1 }}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="Type of Disability"
                                                                                onBlur={formik.handleBlur}
                                                                                InputLabelProps={{ shrink: true }}
                                                                                helperText={formik.errors[`disabilityType-${index}`] || ''}
                                                                                error={!!formik.errors[`disabilityType-${index}`]}
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                    <TextField
                                                                        margin="normal"
                                                                        fullWidth
                                                                        type="number"
                                                                        id={`disabilityPercentage-${index}`}
                                                                        name={`disabilityPercentage-${index}`}
                                                                        label="Percentage of Disability"
                                                                        size="small"
                                                                        InputLabelProps={{ shrink: true }}
                                                                        onChange={(e) => handlePercentageChange(index, e.target.value)}
                                                                        onBlur={formik.handleBlur}
                                                                        value={disability.percentage}
                                                                        error={!!formik.errors[`disabilityPercentage-${index}`]}
                                                                        helperText={formik.errors[`disabilityPercentage-${index}`] || ''}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                    <IconButton onClick={() => handleRemoveDisability(index)} color="error" disabled={index === 0}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                    <IconButton onClick={handleAddDisability} color="primary">
                                                                        <AddIcon />
                                                                    </IconButton>
                                                                </Grid>
                                                            </Grid>
                                                        </React.Fragment>
                                                    ))}

                                                </React.Fragment>
                                            )}
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <Autocomplete
                                                    disablePortal
                                                    margin="normal"
                                                    size="small"
                                                    id="bloodGrp"
                                                    name="bloodGrp"
                                                    options={bloodList}
                                                    value={
                                                        bloodList.find(
                                                            (option) =>
                                                                option.id ===
                                                                formik.values.bloodGrp
                                                        ) || null
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value === null) {
                                                            formik.setFieldValue("bloodGrp", null);
                                                        } else formik.setFieldValue("bloodGrp", value.id);
                                                    }}
                                                    getOptionLabel={(value) => value.label}
                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Blood Group"
                                                            required
                                                            onBlur={formik.handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            helperText={
                                                                formik.errors.bloodGrp &&
                                                                    formik.touched.bloodGrp
                                                                    ? formik.errors.bloodGrp
                                                                    : null
                                                            }
                                                            error={
                                                                formik.errors.bloodGrp &&
                                                                    formik.touched.bloodGrp
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    id="personalMobile"
                                                    name="personalMobile"
                                                    label="Personal Mobile Number"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.personalMobile}
                                                    error={formik.touched.personalMobile && !!formik.errors.personalMobile}
                                                    helperText={formik.touched.personalMobile && formik.errors.personalMobile}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    id="officialEmail"
                                                    name="officialEmail"
                                                    label="Official Email Id"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.officialEmail}
                                                    error={formik.touched.officialEmail && !!formik.errors.officialEmail}
                                                    helperText={formik.touched.officialEmail && formik.errors.officialEmail}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    id="officialMobile"
                                                    name="officialMobile"
                                                    label="Official Mobile Number"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.officialMobile}
                                                    error={formik.touched.officialMobile && !!formik.errors.officialMobile}
                                                    helperText={formik.touched.officialMobile && formik.errors.officialMobile}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <Autocomplete
                                                    disablePortal
                                                    margin="normal"
                                                    size="small"
                                                    id="nationality"
                                                    name="nationality"
                                                    options={nationalityList}
                                                    value={
                                                        nationalityList.find(
                                                            (option) =>
                                                                option.id ===
                                                                formik.values.nationality
                                                        ) || null
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value === null) {
                                                            formik.setFieldValue("nationality", null);
                                                        } else formik.setFieldValue("nationality", value.id);
                                                    }}
                                                    getOptionLabel={(value) => value.label}
                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Nationality"
                                                            required
                                                            onBlur={formik.handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            helperText={
                                                                formik.errors.nationality &&
                                                                    formik.touched.nationality
                                                                    ? formik.errors.nationality
                                                                    : null
                                                            }
                                                            error={
                                                                formik.errors.nationality &&
                                                                    formik.touched.nationality
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <Autocomplete
                                                    disablePortal
                                                    margin="normal"
                                                    size="small"
                                                    id="religion"
                                                    name="religion"
                                                    options={religionList}
                                                    value={
                                                        religionList.find(
                                                            (option) =>
                                                                option.id ===
                                                                formik.values.religion
                                                        ) || null
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value === null) {
                                                            formik.setFieldValue("religion", null);
                                                        } else formik.setFieldValue("religion", value.id);
                                                    }}
                                                    getOptionLabel={(value) => value.label}
                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Religion"
                                                            required
                                                            onBlur={formik.handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            helperText={
                                                                formik.errors.religion &&
                                                                    formik.touched.religion
                                                                    ? formik.errors.religion
                                                                    : null
                                                            }
                                                            error={
                                                                formik.errors.religion &&
                                                                    formik.touched.religion
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        
                                            
                                        
                                           
                                        </Grid>

                                    </CardContent>
                                </Card>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <Button
                                        sx={{
                                            minWidth: 100,
                                            ml: 1,
                                            mt: 2,
                                        }}
                                        variant="contained"
                                        type="submit"
                                        disabled={submitDisable}
                                        onClick={() => {
                                            // checkValid();
                                            //  savePersonalDetails()
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                pageone: { formik: formik.values, familyDetailsFormik: familyDetailsFormik.values, image: imageUploadedFile, disable: disableoption, disableOtp: isOtpButtonDisabled, Next: showNext }
                                            }));
                                        }}
                                    >
                                        SUBMIT&nbsp;
                                        <SaveIcon></SaveIcon>
                                    </Button>
                                    <Button
                                        sx={{
                                            minWidth: 100, ml: 1, mt: 2
                                        }}
                                        variant="outlined"
                                        //type="submit"
                                        //disabled={!showNext}
                                        onClick={() => {
                                            onButtonClick("pagetwo")
                                        }
                                        }
                                    >
                                        NEXT &nbsp;
                                        <NavigateNextIcon />
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            {openModal && (
                <SearchModal
                    closeModal={handleCloseModal}
                    onOfficeSelect={handleOfficeSelect}
                />
            )}
        </>
    );
};
export default SavePersonalDetails;
