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
import Modal from "./SearchModal";
function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

export const calculateSuperannuationDate = (dob, retirementAge) => {
    const birthDate = new Date(dob);
    const retirementDate = new Date(birthDate);
    retirementDate.setFullYear(retirementDate.getFullYear() + retirementAge);

    if (birthDate.getDate() === 1) {
        retirementDate.setMonth(retirementDate.getMonth());
        retirementDate.setDate(0); // Last day of the previous month
    } else {
        retirementDate.setMonth(retirementDate.getMonth() + 1);
        retirementDate.setDate(0); // Last day of the same month
    }

    return retirementDate;
};

const styleAlertOpenSave = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 600,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    // p: 4,
};
const useAlertSaveStyles = makeStyles({
    cookieAlert: {
        "& .MuiAlert-icon": {
            fontSize: 40
        }
    }
});
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
    // apcosId: Yup.string().required('Apcos Id is required'),
    // id: Yup.string().required('id is required'),
});
const SavePersonalDetails = ({ formData, setFormData, prevData, onButtonClick }) => {
    const classes = useAlertSaveStyles();
    const user = useSelector((state) => state.loginReducer);
    // console.log(user)
    const [value, setValue] = React.useState(dayjs());
    const [age, setAge] = React.useState(calculateAge(value));
    const [checked, setChecked] = React.useState(false);
    const [disableoption, setDisableoption] = useState(false);
    const [genderList, setGenderList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [prefixList, setPrefixList] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [isserviceType, setIsServiceType] = useState(true);
    const [departmentList, setDepartmentList] = useState([]);
    const [perentdepartmentList, setperentDepartmentList] = useState([]);
    const [cradeList, setCradeList] = useState([]);
    const [retirementAgeList, setRetirementAgeList] = useState(0);

    const [gpfPranList, setGpfPranList] = useState([])
    const [srcOfRecruitList, setSrcOfRecruitmentList] = useState([])
    const [payslipAuthorityList, setPayslipAuthorityList] = useState([])
    const [joiningTimeList, setJoiningTimeList] = useState([])
    const [heightList, setHeightList] = useState([])
    const [quarterTypeList, setQuarterTypelist] = useState([])
    const [iscradeType, setIsCradeType] = useState(true);
    const [designation, setDesignation] = useState([]);
    const [isdesignation, setIsDesignation] = useState(true);
    const [relationlist, setRelationList] = useState([]);
    const [religionList, setReligionList] = useState([]);
    const [nationalityList, setNationalityList] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [maritalStatusList, setMaritalStatusList] = useState([]);
    const [bloodList, setBloodgroupList] = useState([]);
    const [disabilityList, setTypeofDisabilityList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [isReadable, setIsReadable] = useState(false);
    const [stateonelist, setstateoneList] = useState([]);
    const [districtoneList, setDistrictoneList] = useState([]);
    const [mandaloneList, setMandaloneList] = useState([]);
    const [villageoneList, setVillageoneList] = useState([]);
    const [casteList, setCasteList] = useState([]);
    const [subcasteList, setSubCasteList] = useState([]);
    const [isVillageDisabled, setIsVillageDisabled] = useState(true);
    const [casteUploadedFile, setCasteUploadedFile] = useState(null)
    const [aadharUploadedFile, setAadharUploadedFile] = useState(null)
    const [panUploadedFile, setPanUploadedFile] = useState(null)
    const [pwdUploadedFile, setPwdUploadedFile] = useState(null)
    // const [imageUploadedFile, setImageUploadedFile] = useState(null)
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("info");
    const [uplodedImage, setUploadedImage] = useState(null);
    // const [attachmentId,setAttachmentId] = useState()
    const [casteVirtualPath, setCasteVirtualPath] = useState(prevData?.formik?.castePath || '');
    const [aadharVirtualPath, setAadharVirtualPath] = useState(prevData?.formik?.aadharPath || '');
    const [panVirtualPath, setPanVirtualPath] = useState(prevData?.formik?.panPath || '');
    const [imageVirtualPath, setImageVirtualPath] = useState(prevData?.formik?.imagePath || '');
    const [pwdVirtualPath, setPwdVirtualPath] = useState(prevData?.formik?.pwdPath || '');
    const [showSubCaste, setShowSubCaste] = useState(false);
    const [employeeType, setEmployeeType] = useState([]);
    const [openAlertSave, setOpenAlertSave] = React.useState(false);
    const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(prevData?.disableOtp || false);
    const [imageUploadedFile, setImageUploadedFile] = useState(prevData?.image || null)
    const [showOtpField, setShowOtpField] = useState(false);
    const [image, setImage] = useState(null);
    const [showNext, setShowNext] = useState(prevData?.Next || false)
    const [flag, setFlag] = useState(false);
    const [flag2, setFlag2] = useState(false);
    const [imageName, setImageName] = useState('')
    const { showSnackbar } = useSnackbar();
    const [showLinkCaste, setShowLinkCaste] = useState(true)
    const [showLinkPwd, setShowLinkPwd] = useState(true)
    const [showLinkAadhar, setShowLinkAadhar] = useState(true)
    const [showLinkPan, setShowLinkPan] = useState(true)
    const [uploadedFiles, setUploadedFiles] = useState([
        {
            id: 1, docName: ''
        },
    ])
    const handleAlertSaveOpen = () => setOpenAlertSave(true);
    const handleAlertSaveClose = () => setOpenAlertSave(false);
    const handleDeleteFile = (index) => {
        // const updatedFiles = [...uploadedFiles];
        // updatedFiles.splice(index, 1);
        // setUploadedFiles(updatedFiles);
    };

    const handleDownloadFile = async (file) => {
        // try {
        //   const formData = new FormData();
        //   formData.append("filePath", file.filePath);
        //   const response = await axios.post(
        //     `${process.env.REACT_APP_PREAUTH_API_URL}/download`,
        //     formData,
        //     {
        //       responseType: "blob",
        //     }
        //   );
        //   const url = window.URL.createObjectURL(new Blob([response.data]));
        //   const link = document.createElement("a");
        //   link.href = url;
        //   link.setAttribute("download", file.fileName);
        //   document.body.appendChild(link);
        //   link.click();
        //   link.remove();
        // } catch (error) {
        //   console.error("Error downloading file:", error);
        // }
    };


    useEffect(() => {
        if (showNext === true && flag2 === true) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                pageone: { formik: formik.values, familyDetailsFormik: familyDetailsFormik.values, image: imageUploadedFile, disable: disableoption, disableOtp: isOtpButtonDisabled, Next: showNext }
            }));
            setFlag(true);
        }
    }, [showNext])
    useEffect(() => {
        if (showNext === true && flag === true) {
            onButtonClick("pagetwo")
        }
    }, [showNext, flag])
    const handleKeyDown = (event) => {
        // Allow space in text fields
        if (event.key === ' ' && event.target.tagName === 'INPUT' && event.target.type === 'text') {
            event.stopPropagation();
        }
        // Allow Ctrl+A
        if (event.ctrlKey && event.key === 'a') {
            event.stopPropagation();
        }
    };
    useEffect(() => {
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
            console.log(response);
        })
            .catch(error => {
                console.log(error);
            });
    }, [])
    const paySlipList = [
        { id: 1, label: 'Yes' },
        { id: 2, label: 'No' },
    ]
    const formik = useFormik({
        initialValues: {
            prefix: '',
            firstName: '',
            middleName: '',
            lastName: '',
            gender: '',
            dob: '',
            height: '',
            heightText: '',
            heightInFeet: '',
            heightInInch: '',
            identificationMarks: '',
            fatherName: '',
            motherName: '',
            maritalStatus: '',
            spouseName: '',
            physicallyHandicapped: '',
            disabilityType: '',
            disabilityPercentage: null,
            bloodGrp: '',
            personalemail: '',
            personalMobile: '',
            officialEmail: "",
            officialMobile: '',
            nationality: '',
            socialCategory: null,
            gpfPranType: null,
            gpfPranId: '',
            religion: '',
            pancard: '',
            Aadhaar: '',
            employeeType: '',
            serviceType: '',
            cadre: '',
            quarterType: null,
            parentDept: '',
            currentDept: '',
            currentDesgn: '',
            currentOffice: null,
            orderIssuingOffice: null,
            appointmentOrdNo: '',
            appointmentOrdDate: '',
            srcOfRecruit: '',
            joiningDate: '',
            confirmationDate: '',
            superannuationDate: '',
            joiningTime: null,
            payRevision: '',
            payScale: '',
            gradePay: '',
            basicPay: '',
            govtOccupied: '',
            paySlip: true,
            payslipAuthority: null,
            aadharDoc: '',
            aadharDocName: '',
            panDoc: '',
            panDocName: '',
            houseNumberComm: '',
            streetcomm: '',
            distIdcommunication: null,
            stateIdcommunication: null,
            mandalIdcommunication: '',
            villageIdcommunication: '',
            pincodecomm: '',
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
    const [submitDisable, setSubmitDisable] = useState(false);
    const [flagproceed, setFlagProceed] = useState(false);
    useEffect(() => {
        if (prevData != undefined && flagproceed === true) {
            onButtonClick("pagetwo")
        }
    }, [flagproceed])

    useEffect(() => {
        if (formik.values.dob && retirementAgeList) {
            const superannuationDate = calculateSuperannuationDate(formik.values.dob, retirementAgeList);
            formik.setFieldValue("superannuationDate", dayjs(superannuationDate).format("YYYY-MM-DD"));
        }
    }, [formik.values.dob, formik.values.cadre]);
    const columns = [
        {
            field: "id",
            headerClassName: "super-app-theme--header",
            headerName: "S No.",
            width: 60,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        },
        {
            width: 250,
            headerName: "Document Name",
            field: "docName",
            headerClassName: "super-app-theme--header",
            renderCell: (params) => {
                return (
                    <TextField
                        margin="normal"
                        fullWidth
                        id="name"
                        sx={{ width: "100%", mt: 2 }}
                        value={params.value}
                        name="name"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                    />
                );
            },
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        },
        // {
        //     field: "fileName",
        //     headerName: "File Name",
        //     width: 140,
        //     headerClassName: "super-app-theme--header",
        //     renderCell: (params) => {
        //         return(
        //             <TextField
        //               fullWidth
        //               type="file"
        //               name="fileName"
        //               size="small"
        //               required
        //               />
        //         );
        //     }
        // },
    ];
    const familyDetailsFormik = useFormik({
        initialValues: {
            tableRows: [{
                id: 1,
                name: '',
                relation: '',
                fdob: null,
                gender: '',
                mobileNo: '',
                famId: null,
            }]
        }
    })
    console.log(familyDetailsFormik.values)
    console.log(dayjs(familyDetailsFormik.values.tableRows.fdob).format("YYYY-MM-DD"))
    const handleAddRow = () => {
        const newRowId = familyDetailsFormik.values.tableRows.length + 1;
        const newRow = [...familyDetailsFormik.values.tableRows,
        {
            id: newRowId,
            name: '',
            relation: '',
            fdob: null,
            gender: '',
            mobileNo: null,
        }]
        familyDetailsFormik.setValues((prevValues) => ({
            ...prevValues,
            tableRows: newRow
        }))
    }
    const handleDeleteRow = (id) => {
        familyDetailsFormik.setValues((prevValues) => {
            const updatedRows = prevValues.tableRows.filter((row) => row.id !== id);
            const updatedRowsWithId = updatedRows.map((row, index) => ({
                ...row,
                id: index + 1,
            }));
            return {
                ...prevValues,
                tableRows: updatedRowsWithId,
            };
        });
    }
    const handleTableChange = (id, field, value) => {
        familyDetailsFormik.setFieldValue(`tableRows[${id - 1}].${field}`, value);
    }
    const [rows, setRows] = useState([
        {
            id: 1,
            name: "",
            relation: "",
            fdob: "",
            gender: "",
            mobileNo: "",
            adddelete: ""
        },
    ]);
    const fetchFamilyData = () => {
        axios.get(`${process.env.REACT_APP_MASTER_API_URL}/employee-enrollment/familyDetails/${user.data.userdetails.user.userId}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        }).then(response => {
            if (response.data.result.length > 0) {
                response.data.result.map((item, index) => {
                    familyDetailsFormik.setFieldValue(`tableRows[${index}].id`, index + 1)
                    familyDetailsFormik.setFieldValue(`tableRows[${index}].famId`, item.empFamId)
                    familyDetailsFormik.setFieldValue(`tableRows[${index}].name`, item.familyMemberName)
                    familyDetailsFormik.setFieldValue(`tableRows[${index}].relation`, item.familyRelation.typeId)
                    familyDetailsFormik.setFieldValue(`tableRows[${index}].gender`, item.familyGender.typeId)
                    familyDetailsFormik.setFieldValue(`tableRows[${index}].fdob`, dayjs(item.familyDob).format("YYYY-MM-DD"))
                    familyDetailsFormik.setFieldValue(`tableRows[${index}].mobileNo`, parseInt(item.familyPhoneNumber))
                })
            }
        })
            .catch(error => {
                console.log(error);
            });
    }
    console.log(familyDetailsFormik.values)
    const checkValid = () => {
        formik
            .validateForm()
            .then((formErrors) => {
                if (Object.keys(formErrors).length > 0) {
                    console.log(Object.keys(formErrors))
                    //alert(Object.keys(formErrors))
                    setToastMessage("Please fill all the required * fields and upload attachments")
                    setToastSeverity("error");
                    setOpenToast(true);
                } else {
                    let isValidate = "Pass"
                    let alertMsg = ""
                    let regex = new RegExp(/(0|91)?[6-9][0-9]{9}/);
                    if (!formik.values.employeeType) {
                        alertMsg = alertMsg + "Please select Employee Type\n";
                        isValidate = "Fail"
                    }
                    if (!aadharVirtualPath) {
                        alertMsg = alertMsg + "Please upload Aadhar attachment\n";
                        isValidate = "Fail"
                    }
                    if (!panVirtualPath) {
                        alertMsg = alertMsg + "Please upload PanCard attachment\n";
                        isValidate = "Fail"
                    }
                    if (!imageVirtualPath) {
                        alertMsg = alertMsg + "Please upload Photo\n";
                        isValidate = "Fail"
                    }
                    if (formik.values.physicallyHandicapped === "true" && pwdVirtualPath === '') {
                        alertMsg = alertMsg + "Please upload Pwd Certificate\n";
                        isValidate = "Fail"
                    }
                    if (formik.values.caste == 67 && formik.values.subcaste === null) {
                        alertMsg = alertMsg + "Please select SubCaste\n";
                        isValidate = "Fail"
                    }
                    if (
                        (formik.values.caste == "67" || formik.values.caste == "68" || formik.values.caste == "69" || formik.values.caste == 67 || formik.values.caste == 68 || formik.values.caste == 69) &&
                        casteVirtualPath === ''
                    ) {
                        alertMsg = alertMsg + "Please upload Caste Certificate\n";
                        isValidate = "Fail"
                    }
                    // if (formik.values.employeeType === "105" && formik.values.apcosId.length == 0) {
                    //     alertMsg = alertMsg + "APCOS Id is required for Employee Type - APCOS!\n";
                    //     isValidate = "Fail"
                    // }
                    if (isOtpButtonDisabled === false) {
                        alertMsg = alertMsg + "Please validate your Contact number"
                        isValidate = "Fail"
                    }
                    familyDetailsFormik.values.tableRows.map((row) => {
                        if (row.name != "" || row.relation != "" || (row.fdob != null && row.fdob != "Invalid Date") || (row.gender != "" && row.gender != null) || row.mobileNo != '') {
                            if (row.name == "" || row.fdob == "" || row.fdob == "Invalid Date" || row.relation == "" || row.gender == "" || row.mobileNo == "") {
                                alertMsg = alertMsg + `In Family Details Row ${row.id} : Please fill all the fields of Family Details If wanted to add. Otherwise please clear the fields left entering completely\n`;
                                isValidate = "Fail"
                            }
                        }
                        if (row.mobileNo != "") {
                            console.log(regex.test(row.mobileNo))
                            console.log(row.mobileNo.length)
                            if (regex.test(row.mobileNo) == false || (row.mobileNo).toString().length != 10) {
                                alertMsg = alertMsg + `In Family Details Row ${row.id} : Mobile Number must be 10 digits starting with 6,7,8 or 9\n`;
                                isValidate = "Fail";
                            }
                        }
                    })
                    if (isValidate === "Pass") {
                        handleAlertSaveOpen();
                    }
                    else {
                        alert(alertMsg);
                    }
                    //savePersonalDetails()
                    //    saveAllAttachment()
                }
            })
            .catch((err) => {
                formik.setSubmitting(false);
            });
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };
    // const handlephysicalhand = (event) => {
    //     setHasphysicalHand(event.target.value);
    // };
    const getFile = async (event, attachment) => {
        event.preventDefault();
        const blobData = new Blob([attachment], { type: attachment?.type });
        //const blobData = new Blob(attachment);
        const blobUrl = URL.createObjectURL(blobData);
        const iframe = document.createElement('iframe')
        iframe.src = blobUrl;
        iframe.width = '100%';
        iframe.height = '500px';
        document.body.appendChild(iframe)
        window.open(blobUrl, '_blank');
    }
    const copyAddress = (e) => {
        setChecked(e.target.checked);
        formik.setFieldValue("isCommAddrsSame", e.target.checked);
        console.log("the chekced value", checked);
        console.log("the chekced value", e.target.checked);
        if (e.target.checked) {
            formik.setFieldValue("houseNumberComm", formik.values.houseNumberCard);
            formik.setFieldValue("streetcomm", formik.values.streetCard);
            formik.setFieldValue("stateIdcommunication", formik.values.stateId);
            formik.setFieldValue("mandalIdcommunication", formik.values.mandalId);
            formik.setFieldValue("villageIdcommunication", formik.values.villageId);
            formik.setFieldValue("distIdcommunication", formik.values.distId);
            formik.setFieldValue("pincodecomm", formik.values.pincodeCard);
            setDisableoption(true);
        } else {
            // setDistrictoneList(districtList)
            // setMandaloneList(mandalList)
            // setVillageoneList(villageList)
            formik.setFieldValue("houseNumberComm", "");
            formik.setFieldValue("streetcomm", "");
            formik.setFieldValue("stateIdcommunication", "");
            formik.setFieldValue("mandalIdcommunication", "");
            formik.setFieldValue("villageIdcommunication", "");
            formik.setFieldValue("distIdcommunication", "");
            formik.setFieldValue("pincodecomm", "");
            setDisableoption(false);
        }
    };
    const CardTitle = styled((props) => (
        <Typography component="span" {...props} />
    ))(() => ({
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
    }));
    const VisuallyHiddenInput = styled('input')({
        display: 'none',
    });
    // Styled components
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#2169b3",
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));
    function calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        let ageString = "";
        if (age > 0) {
            ageString += age === 1 ? "1 year" : `${age} years`;
        }
        if (monthDiff > 0) {
            if (ageString !== "") {
                ageString += ", ";
            }
            ageString += monthDiff === 1 ? "1 month" : `${monthDiff} months`;
        }
        if (dayDiff > 0) {
            if (ageString !== "") {
                ageString += ", ";
            }
            ageString += dayDiff === 1 ? "1 day" : `${dayDiff} days`;
        }
        return {
            years: age,
            months: monthDiff,
            days: dayDiff,
            ageString: ageString,
        };
    }
    const fileInputRef = useRef(null)
    const fileInputRef2 = useRef(null)
    const fileInputRef3 = useRef(null)
    const fileInputRefPwd = useRef(null)
    const fileInputRefImg = useRef(null)
    const handleButtonClick = () => {
        fileInputRef.current.click();
    }
    const handleButtonClick2 = () => {
        fileInputRef2.current.click();
    }
    const handleButtonClick3 = () => {
        fileInputRef3.current.click();
    }
    const handleButtonClickPwd = () => {
        fileInputRefPwd.current.click();
    }
    const handleButtonClickImg = () => {
        fileInputRefImg.current.click();
    }
    // console.log(uplodedImage)
    let selectedFile = null;
    let attachmentId = null;
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const fileSizeKB = file.size / 1024;
        if (fileSizeKB > 200) {
            console.error("File size exceeded");
            alert("Attachment should be less than 200KB");
            setCasteUploadedFile(null);
            return;
        }
        // Check if the file format is allowed (JPG, PNG, or PDF)
        const allowedFormats = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedFormats.includes(file.type)) {
            console.error("Invalid file format");
            alert("Invalid file format. Please choose JPG, PNG, or PDF.");
            setCasteUploadedFile(null);
            return;
        }
        console.log(file.name);
        selectedFile = file;
        // Set the selected file and perform further actions
        attachmentId = 102;
        setCasteUploadedFile(selectedFile);
        // setAttachmentId(102)
        console.log(file);
        if (file) {
            uploadAttachment();
        }
    };
    const handleFileChange2 = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const fileSizeKB = file.size / 1024;
        if (fileSizeKB > 200) {
            console.error("File size exceeded");
            alert("Attachment should be less than 200KB");
            setAadharUploadedFile(null);
            return;
        }
        const allowedFormats = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedFormats.includes(file.type)) {
            console.error("Invalid file format");
            alert("Invalid file format. Please choose JPG, PNG, or PDF.");
            setAadharUploadedFile(null);
            return;
        }
        console.log(file.name);
        selectedFile = file;
        attachmentId = 97;
        setAadharUploadedFile(selectedFile);
        if (selectedFile) {
            uploadAttachment();
        }
    };
    const handleFileChangePwd = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const fileSizeKB = file.size / 1024;
        if (fileSizeKB > 200) {
            console.error("File size exceeded");
            alert("Attachment should be less than 200KB");
            const allowedFormats = ["image/jpeg", "image/png", "application/pdf"];
            if (!allowedFormats.includes(file.type)) {
                console.error("Invalid file format");
                alert("Invalid file format. Please choose JPG, PNG, or PDF.");
                setPwdUploadedFile(null); // Corrected from setCasteUploadedFile(null)
                return;
            }
            setPwdUploadedFile(null);
            return;
        }
        console.log(file.name);
        selectedFile = file;
        attachmentId = 101;
        setPwdUploadedFile(selectedFile);
        if (selectedFile) {
            uploadAttachment();
        }
    };
    const handleFileChange3 = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const fileSizeKB = File.size / 1024;
        if (fileSizeKB > 200) {
            console.error("Fie size exceeded");
            alert("Attachment should be less than 200KB");
            setPanUploadedFile(null);
            return;
        }
        const allowedFormats = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedFormats.includes(file.type)) {
            console.error("Invalid file format");
            alert("Invalid file format. Please choose JPG, PNG, or PDF.");
            setPanUploadedFile(null);
            return;
        }
        console.log(File.name);
        selectedFile = file;
        attachmentId = 98;
        setPanUploadedFile(selectedFile)
        if (selectedFile) {
            uploadAttachment()
        }
    }
    const handleFileChangeImg = (file) => {
        if (!file) {
            return;
        }
        const fileSizeKB = file.size / 1024;
        if (fileSizeKB > 200) {
            console.error("File size exceeded");
            alert("Attachment should be less than 200KB");
            setImageUploadedFile(null);
            return;
        }
        const allowedFormats = ["image/jpeg", "image/png"];
        if (!allowedFormats.includes(file.type)) {
            console.error("Invalid file format");
            alert("Invalid file format. Please choose JPG, PNG");
            setImageUploadedFile(null);
            return;
        }
        console.log(file.name);
        selectedFile = file;
        setImageUploadedFile(selectedFile);
        attachmentId = 96;
        if (selectedFile) {
            uploadAttachment();
        }
    };
    const uploadAttachment = async () => {
        const config = { headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${Cookies.get("token")}` } };
        var bodyFormData = new FormData();
        console.log(selectedFile)
        bodyFormData.append("file", selectedFile);
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_MASTER_API_URL}/employee-enrollment/uploadAttachment`,
                bodyFormData,
                config
            );
            console.log(res);
            console.log(res.data.result[selectedFile.name]);
            if (res.data.statusCode == 200) {
                console.log("uploaded successfully")
                setToastMessage("File Uploaded Successfully")
                setToastSeverity("success");
                setOpenToast(true);
                if (attachmentId === 102) {
                    console.log(102)
                    setCasteVirtualPath(res.data.result[selectedFile.name])
                    formik.setFieldValue("casteDoc", selectedFile)
                    formik.setFieldValue("casteDocName", selectedFile.name)
                    formik.setFieldValue("castePath", res.data.result[selectedFile.name]);
                    setShowLinkCaste(true);
                }
                if (attachmentId === 97) {
                    setAadharVirtualPath(res.data.result[selectedFile.name])
                    formik.setFieldValue("aadharDocName", selectedFile.name)
                    formik.setFieldValue("aadharDoc", selectedFile);
                    formik.setFieldValue("aadharPath", res.data.result[selectedFile.name]);
                    setShowLinkAadhar(true);
                }
                if (attachmentId === 98) {
                    setPanVirtualPath(res.data.result[selectedFile.name])
                    formik.setFieldValue("panDocName", selectedFile.name)
                    formik.setFieldValue("panDoc", selectedFile);
                    formik.setFieldValue("panPath", res.data.result[selectedFile.name]);
                    setShowLinkPan(true);
                }
                if (attachmentId === 96) {
                    setImageVirtualPath(res.data.result[selectedFile.name])
                    formik.setFieldValue("imagePath", res.data.result[selectedFile.name]);
                }
                if (attachmentId === 101) {
                    setPwdVirtualPath(res.data.result[selectedFile.name])
                    formik.setFieldValue("pwdDocName", selectedFile.name)
                    formik.setFieldValue("pwdDoc", selectedFile)
                    formik.setFieldValue("pwdPath", res.data.result[selectedFile.name]);
                    setShowLinkPwd(true);
                }
                // console.log(openToast)
                //   showSnackbar(res.data.message,"success");
                // callConfirmDialogMessage("Uplosded Successfully");
                // alert("successfully uploaded");
                // handleResult("Success");
                // onFileUpload(res.data.result.filePath);
                //onFileUpload(files, uploadedFiles[0].name)
            } else {
                console.log('bad request');
                setToastMessage("File Uploaded Successfully")
            }
        } catch (error) {
            // setLoadingInd(false);
            console.log(error.message);
        }
    };
    const getFilePath = () => {
        axios.get(`${process.env.REACT_APP_MASTER_API_URL}/employee-enrollment/attachmentDetails/${user.data.userdetails.user.userId}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        }).then(response => {
            response.data.result.map((item) => {
                if (item.attachmentId.typeId === 97) {
                    setAadharVirtualPath(item.filePath)
                    formik.setFieldValue("aadharPath", item.filePath)
                }
                if (item.attachmentId.typeId === 98) {
                    setPanVirtualPath(item.filePath)
                    formik.setFieldValue("panPath", item.filePath)
                }
                if (item.attachmentId.typeId === 96) {
                    setImageVirtualPath(item.filePath);
                    formik.setFieldValue("imagePath", item.filePath)
                }
                if (prevData?.formik?.castePath != '' && item.attachmentId.typeId === 102) {
                    setCasteVirtualPath(item.filePath)
                    formik.setFieldValue("castePath", item.filePath)
                }
                if (prevData?.formik?.PwdVirtualPath != '' && item.attachmentId.typeId === 101) {
                    setPwdVirtualPath(item.filePath)
                    formik.setFieldValue("pwdPath", item.filePath)
                }
            })
        })
            .catch(error => {
                console.log(error);
            });
    }
    const ageValidator = (value) => {
        if (value != null || value != NaN) {
            const selectedDate = dayjs(value).format("YYYY-MM-DD");
            console.log(selectedDate);
            const age = calculateAge(value);
            console.log(age);
            let minAge = 18;
            // let maxAge = 50;
            if (
                age &&
                (age.years < minAge)
            ) {
                alert(
                    `Age should be greater than ${minAge}`
                );
                return;
            }
            formik.setFieldValue("dob", selectedDate);
            formik.setFieldValue(
                "age",
                age ? age.ageString : ""
            );
        }
    };
    console.log(casteVirtualPath);
    console.log(panVirtualPath)
    console.log(formik.values.caste?.id)
    const saveAllAttachment = async () => {
        if (!aadharVirtualPath) {
            alert("Please select Aadhar attachment");
            return;
        }
        try {
            let body = {}
            if (formik.values.physicallyHandicapped === "true") {
                if (
                    formik.values.caste?.id == "67" ||
                    formik.values.caste?.id == "68"
                    || formik.values.caste?.id == "69"
                ) {
                    body = {
                        paths: [
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 102,
                                "filePath": casteVirtualPath,
                                //  "crtBy": user.data.userdetails.user.userId,
                                //   "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 97,
                                "filePath": aadharVirtualPath,
                                //   "crtBy": user.data.userdetails.user.userId,
                                //  "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 98,
                                "filePath": panVirtualPath,
                                //   "crtBy": user.data.userdetails.user.userId,
                                //   "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 96,
                                "filePath": imageVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 101,
                                "filePath": pwdVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            }
                        ]
                    }
                }
                else {
                    body = {
                        paths: [
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 97,
                                "filePath": aadharVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 98,
                                "filePath": panVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 96,
                                "filePath": imageVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 101,
                                "filePath": pwdVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            }
                        ]
                    }
                }
            }
            else {
                if (formik.values.caste?.id === 67 || formik.values.caste?.id == "68" || formik.values.caste?.id == "69") {
                    body = {
                        paths: [
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 102,
                                "filePath": casteVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 97,
                                "filePath": aadharVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 98,
                                "filePath": panVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 96,
                                "filePath": imageVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            }
                        ]
                    }
                }
                else {
                    body = {
                        paths: [
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 97,
                                "filePath": aadharVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 98,
                                "filePath": panVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            },
                            {
                                "userId": user.data.userdetails.user.userId,
                                "attachmentId": 96,
                                "filePath": imageVirtualPath,
                                "crtBy": user.data.userdetails.user.userId,
                                "updBy": user.data.userdetails.user.userId
                            }
                        ]
                    }
                }
            }
            const res = await axios.post(
                `${process.env.REACT_APP_MASTER_API_URL}/employee-enrollment/save-allAttachment`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`
                    }
                }
            );
            console.log(res);
            console.log(res.data.result);
            if (res.data.statusCode == 200) {
                console.log("Save all Attachemnt successfully")
                setToastMessage("Uploaded Files Saved Successfully")
                setToastSeverity("success");
                setOpenToast(true);
                // console.log(openToast)
                //   showSnackbar(res.data.message,"success");
                // callConfirmDialogMessage("Uplosded Successfully");
                // alert("successfully uploaded");
                // handleResult("Success");
                // onFileUpload(res.data.result.filePath);
                //onFileUpload(files, uploadedFiles[0].name)
            } else {
                console.log('bad request');
            }
        } catch (error) {
            // setLoadingInd(false);
            console.log(error.message);
        }
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
                "taskTypeId": null,
                "prefix": formik.values.prefix,
                "firstName": formik.values.firstName,
                "middleName": formik.values.middleName,
                "lastName": formik.values.lastName,
                "gender": formik.values.gender,
                "dob": formik.values.dob,
                "heightMeasure": formik.values.height,
                "heightCmOrFeet": formik.values.height === 144 ? formik.values.heightText : formik.values.heightInFeet,
                "heightInch": formik.values.heightInInch,
                "identifcnMark": formik.values.identificationMarks,
                "fatherName": formik.values.fatherName,
                "motherName": formik.values.motherName,
                "maritalStatus": formik.values.maritalStatus,
                "spouseName": formik.values.spouseName,
                "isDisabled": formik.values.physicallyHandicapped,
                "bloodGroup": formik.values.bloodGrp,
                "personalEmail": formik.values.personalemail,
                "personalMobileNo": formik.values.personalMobile,
                "religion": formik.values.religion,
                "nationality": formik.values.nationality,
                "socialCategory": formik.values.socialCategory,
                "gpfPranType": formik.values.gpfPranType,
                "panNo": formik.values.pancard,
                "aadhaarRefNo": formik.values.Aadhaar,
                "employeeType": formik.values.employeeType,
                "serviceType": formik.values.serviceType,
                "cadreId": formik.values.cadre,
                "isGovtQuarterOccupied": formik.values.govtOccupied,
                "quarterType": formik.values.quarterType,
                "parentDeptId": formik.values.parentDept,
                "currentDeptId": formik.values.currentDept,
                "currentDsgnId": formik.values.currentDesgn,
                "currentOffice": formik.values.currentOffice,
                "ordIssuingOffice": formik.values.orderIssuingOffice,
                "appointOrdNo": 'ORD123',
                "appointOrdDate": formik.values.appointmentOrdDate,
                "srcRecruitment": formik.values.srcOfRecruit,
                "joiningDate": formik.values.joiningDate,
                "joiningTime": formik.values.joiningTime,
                "superannuationDate": formik.values.superannuationDate,
                "confirmationDate": formik.values.confirmationDate,
                "isPayslip": formik.values.paySlip,
                "payslipAuthority": formik.values.payslipAuthority,
                "status": null,
                "remarks": null,
                "grpId": null,
                "addressLine1": formik.values.houseNumberComm,
                "addressLine2": formik.values.streetcomm,
                "stateId": formik.values.stateIdcommunication,
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
            {/* <div>
                <Modal
                    open={openAlertSave}
                    onClose={handleAlertSaveClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={styleAlertOpenSave}>
                        <Alert severity="warning"
                            className={classes.cookieAlert}
                            sx={{ height: 230, p: 3 }}
                        >
                            <AlertTitle>
                                <Typography id="modal-modal-title" variant="h3" sx={{ color: "rgba(102,60,0)" }} component="h2">
                                    Warning
                                </Typography>
                            </AlertTitle>
                            <Typography id="modal-modal-description" variant="subtitle1" component="body" sx={{ mt: 2, bgcolor: "#fff4e5" }}>
                                Please review your details carefully before submission as changes will not be possible after submission or refreshing the page. Ensure accuracy before proceeding.
                            </Typography>
                            <Box sx={{ mt: 2, display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "flex-end" }}>
                                <Button variant="contained" sx={{ mb: { xs: 2, md: 0 }, mr: { xs: 0, md: 2 } }} size="medium" color="warning"
                                    onClick={() => { savePersonalDetails() }}>
                                    Proceed&nbsp;
                                    <ArrowRightAltIcon />
                                </Button>
                                <Button variant="contained" size="medium" color="info" onClick={() => { handleAlertSaveClose() }}>
                                    Cancel
                                </Button>
                            </Box>
                        </Alert>
                    </Box>
                </Modal>
            </div> */}
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
                                            <Grid item xs={12} sm={4} md={4} lg={8}>
                                                <Grid container direction="row" rowSpacing={0} columnSpacing={2} justify="flex-end" alignItems="center" sx={{ mb: 1 }}>
                                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                                        <Autocomplete
                                                            disablePortal
                                                            margin="normal"
                                                            size="small"
                                                            id="prefix"
                                                            name="prefix"
                                                            options={prefixList}
                                                            value={prefixList.find(
                                                                (option) => option.id === formik.values.prefix
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("prefix", null)
                                                                }
                                                                else
                                                                    formik.setFieldValue("prefix", value.id)
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Prefix"
                                                                    required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.prefix && formik.touched.prefix ? formik.errors.prefix : null}
                                                                    error={formik.errors.prefix && formik.touched.prefix ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                                        <TextField
                                                            fullWidth
                                                            id="firstName"
                                                            name="firstName"
                                                            label="First Name"
                                                            size="small"
                                                            margin="normal"
                                                            required
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.firstName}
                                                            error={formik.touched.firstName && !!formik.errors.firstName}
                                                            helperText={formik.touched.firstName && formik.errors.firstName}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                                        <TextField
                                                            fullWidth
                                                            id="middleName"
                                                            name="middleName"
                                                            label="Middle Name"
                                                            size="small"
                                                            margin="normal"
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.middleName}
                                                            error={formik.touched.middleName && !!formik.errors.middleName}
                                                            helperText={formik.touched.middleName && formik.errors.middleName}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                                        <TextField
                                                            fullWidth
                                                            id="lastName"
                                                            name="lastName"
                                                            label="Last Name"
                                                            size="small"
                                                            margin="normal"
                                                            required
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.lastName}
                                                            error={formik.touched.lastName && !!formik.errors.lastName}
                                                            helperText={formik.touched.lastName && formik.errors.lastName}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    rowSpacing={0}
                                                    columnSpacing={2}
                                                    justify="flex-end"
                                                    alignItems="center"
                                                    sx={{ mb: 1 }}
                                                >
                                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                                        <Autocomplete
                                                            disablePortal
                                                            margin="normal"
                                                            size="small"
                                                            id="gender"
                                                            name="gender"
                                                            options={genderList}
                                                            value={genderList.find(
                                                                (option) => option.id === formik.values.gender
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("gender", null)
                                                                }
                                                                else
                                                                    formik.setFieldValue("gender", value.id)
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Gender"
                                                                    required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.gender && formik.touched.gender ? formik.errors.gender : null}
                                                                    error={formik.errors.gender && formik.touched.gender ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                                        <LocalizationProvider
                                                            dateAdapter={AdapterDayjs}
                                                            adapterLocale={"en-gb"}
                                                        >
                                                            <DatePicker
                                                                label="Date of Birth"
                                                                inputFormat="DD-MM-YYYY"
                                                                maxDate={new Date()}
                                                                id="dob"
                                                                name="dob"
                                                                value={formik.values.dob}
                                                                InputLabelProps={{ shrink: true }}
                                                                onChange={(value) => { if (value === null) { formik.setFieldValue("dob", "") } else { formik.setFieldValue("dob", dayjs(value).format("YYYY-MM-DD")) } }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        size="small"
                                                                        fullWidth
                                                                        margin="normal"
                                                                        name="dob"
                                                                        required
                                                                        {...params}
                                                                        error={formik.touched.dob && Boolean(formik.errors.dob)}
                                                                        helperText={formik.touched.dob && formik.errors.dob}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <ImageUploadCard
                                                    OnUploadImage={handleFileChangeImg}
                                                    uploadedImage={setUploadedImage}
                                                    image={image}
                                                />
                                                {imageName != '' ?
                                                    <div
                                                        style={{
                                                            color: "green",
                                                            // marginBottom: "3px",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        <p>Uploaded Image : {imageName}</p>
                                                    </div>
                                                    :
                                                    <div
                                                        style={{
                                                            color: "red",
                                                            // marginBottom: "3px",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        <p>
                                                            <b>Note:</b> Please upload Latest passport size
                                                            photo
                                                        </p>
                                                    </div>
                                                }
                                            </Grid>
                                        </Grid>
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
                                                <Autocomplete
                                                    disablePortal
                                                    margin="normal"
                                                    size="small"
                                                    id="height"
                                                    name="height"
                                                    options={heightList}
                                                    value={
                                                        heightList.find(
                                                            (option) =>
                                                                option.id ===
                                                                formik.values.height
                                                        ) || null
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value === null) {
                                                            formik.setFieldValue("height", null);
                                                        } else formik.setFieldValue("height", value.id);
                                                    }}
                                                    getOptionLabel={(value) => value.label}
                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Height"
                                                            required
                                                            onBlur={formik.handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            helperText={
                                                                formik.errors.height &&
                                                                    formik.touched.height
                                                                    ? formik.errors.height
                                                                    : null
                                                            }
                                                            error={
                                                                formik.errors.height &&
                                                                    formik.touched.height
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            {formik.values.height === 144 && (
                                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                                    <TextField
                                                        margin="normal"
                                                        // required
                                                        fullWidth
                                                        type="text"
                                                        id="heightText"
                                                        name="heightText"
                                                        label="Height (cm)"
                                                        InputLabelProps={{ shrink: true }}
                                                        size="small"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.heightText}
                                                        error={formik.touched.heightText && !!formik.errors.heightText}
                                                        helperText={formik.touched.heightText && formik.errors.heightText}
                                                    />
                                                </Grid>)}
                                            {formik.values.height === 145 &&
                                                (
                                                    <>
                                                        <Grid item xs={12} sm={2} md={2} lg={2}>
                                                            <TextField
                                                                margin="normal"
                                                                required
                                                                fullWidth
                                                                type="text"
                                                                id="heightInFeet"
                                                                name="heightInFeet"
                                                                label="Height (Feet)"
                                                                InputLabelProps={{ shrink: true }}
                                                                size="small"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.heightInFeet}
                                                                helperText={
                                                                    formik.errors.heightInFeet &&
                                                                        formik.touched.heightInFeet
                                                                        ? formik.errors.heightInFeet
                                                                        : null
                                                                }
                                                                error={
                                                                    formik.errors.heightInFeet &&
                                                                        formik.touched.heightInFeet
                                                                        ? true
                                                                        : false
                                                                }
                                                            // error={formik.touched.heightInFeet && !!formik.errors.heightInFeet}
                                                            // helperText={formik.touched.heightInFeet && formik.errors.heightInFeet}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={2} md={2} lg={2}>
                                                            <TextField
                                                                margin="normal"
                                                                fullWidth
                                                                type="text"
                                                                id="heightInInch"
                                                                name="heightInInch"
                                                                label="Height (Inch)"
                                                                InputLabelProps={{ shrink: true }}
                                                                size="small"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.heightInInch}
                                                                error={formik.touched.heightInInch && Boolean(formik.errors.heightInInch)}
                                                                helperText={formik.touched.heightInInch && formik.errors.heightInInch}
                                                            />
                                                        </Grid>
                                                    </>
                                                )}
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    id="identificationMarks"
                                                    name="identificationMarks"
                                                    label="Identification Mark 1(Acc to SSC)"
                                                    InputLabelProps={{ shrink: true }}
                                                    size="small"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.identificationMarks}
                                                    error={formik.touched.identificationMarks && !!formik.errors.identificationMarks}
                                                    helperText={formik.touched.identificationMarks && formik.errors.identificationMarks}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    margin="normal"
                                                    fullWidth
                                                    required
                                                    type="text"
                                                    id="fatherName"
                                                    name="fatherName"
                                                    label="Father's Name"
                                                    InputLabelProps={{ shrink: true }}
                                                    //   autoComplete="email"
                                                    size="small"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.fatherName}
                                                    error={formik.touched.fatherName && !!formik.errors.fatherName}
                                                    helperText={formik.touched.fatherName && formik.errors.fatherName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    margin="normal"
                                                    fullWidth
                                                    required
                                                    type="text"
                                                    id="motherName"
                                                    name="motherName"
                                                    label="Mother's Name"
                                                    InputLabelProps={{ shrink: true }}
                                                    //   autoComplete="email"
                                                    size="small"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.motherName}
                                                    error={formik.touched.motherName && !!formik.errors.motherName}
                                                    helperText={formik.touched.motherName && formik.errors.motherName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <Autocomplete
                                                    disablePortal
                                                    margin="normal"
                                                    size="small"
                                                    id="maritalStatus"
                                                    name="maritalStatus"
                                                    options={maritalStatusList}
                                                    value={maritalStatusList.find(
                                                        (option) => option.id === formik.values.maritalStatus
                                                    ) || null}
                                                    onChange={(e, value) => {
                                                        if (value === null) {
                                                            formik.setFieldValue("maritalStatus", null)
                                                        }
                                                        else
                                                            formik.setFieldValue("maritalStatus", value.id)
                                                    }}
                                                    getOptionLabel={(value) => value.label}
                                                    sx={{ width: "100%", mt: 2 }}
                                                    renderInput={(params) => (
                                                        <TextField {...params}
                                                            label="Marital Status"
                                                            required
                                                            InputLabelProps={{ shrink: true }}
                                                            onBlur={formik.handleBlur}
                                                            helperText={formik.errors.maritalStatus && formik.touched.maritalStatus ? formik.errors.maritalStatus : null}
                                                            error={formik.errors.maritalStatus && formik.touched.maritalStatus ? true : false}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    margin="normal"
                                                    //required
                                                    fullWidth
                                                    id="spouseName"
                                                    label="Spouse Name(Husband/Wife)"
                                                    InputLabelProps={{ shrink: true }}
                                                    name="spouseName"
                                                    size="small"
                                                    value={formik.values.spouseName || ""}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.spouseName && Boolean(formik.errors.spouseName)}
                                                    helperText={formik.touched.spouseName && formik.errors.spouseName}
                                                    disabled={(formik.values.maritalStatus === 1 || formik.values.maritalStatus === 2) ? true : false}
                                                />
                                            </Grid>
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
                                                            formik.setFieldValue("disabilityPercentage", "");
                                                            formik.setFieldValue("disabilitype", "");
                                                            formik.handleChange(e);
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
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <Autocomplete
                                                    disablePortal
                                                    margin="normal"
                                                    size="small"
                                                    id="disabilityType"
                                                    name="disabilityType"
                                                    options={disabilityList}
                                                    value={
                                                        disabilityList.find(
                                                            (option) =>
                                                                option.id ===
                                                                formik.values.disabilityType
                                                        ) || null
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value === null) {
                                                            formik.setFieldValue("disabilityType", null);
                                                        } else formik.setFieldValue("disabilityType", value.id);
                                                    }}
                                                    getOptionLabel={(value) => value.label}
                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Type of Disability"
                                                            //  required
                                                            onBlur={formik.handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            helperText={
                                                                formik.errors.disabilityType &&
                                                                    formik.touched.disabilityType
                                                                    ? formik.errors.disabilityType
                                                                    : null
                                                            }
                                                            error={
                                                                formik.errors.disabilityType &&
                                                                    formik.touched.disabilityType
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
                                                    //  required
                                                    fullWidth
                                                    type="text"
                                                    id="disabilityPercentage"
                                                    name="disabilityPercentage"
                                                    label="Percentage of Disability"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={(e) => {
                                                        if (e.target.value < 0 || e.target.value > 100) {
                                                            alert("Disability Percentage should be between 0 and 100")
                                                            formik.setFieldValue("disabilityPercentage", "")
                                                            return;
                                                        }
                                                        else {
                                                            formik.setFieldValue("disabilityPercentage", e.target.value)
                                                        }
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.disabilityPercentage}
                                                    error={formik.touched.disabilityPercentage && !!formik.errors.disabilityPercentage}
                                                    helperText={formik.touched.disabilityPercentage && formik.errors.disabilityPercentage}
                                                />
                                            </Grid>
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
                                                    id="personalemail"
                                                    name="personalemail"
                                                    label="Personal Email ID"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.personalemail}
                                                    error={formik.touched.personalemail && !!formik.errors.personalemail}
                                                    helperText={formik.touched.personalemail && formik.errors.personalemail}
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
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <Autocomplete
                                                    disablePortal
                                                    margin="normal"
                                                    size="small"
                                                    id="socialCategory"
                                                    name="socialCategory"
                                                    options={categoryList}
                                                    value={
                                                        categoryList.find(
                                                            (option) =>
                                                                option.id ===
                                                                formik.values.socialCategory
                                                        ) || null
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value === null) {
                                                            formik.setFieldValue("socialCategory", null);
                                                        } else formik.setFieldValue("socialCategory", value.id);
                                                    }}
                                                    getOptionLabel={(value) => value.label}
                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Social Category"
                                                            required
                                                            onBlur={formik.handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            helperText={
                                                                formik.errors.socialCategory &&
                                                                    formik.touched.socialCategory
                                                                    ? formik.errors.socialCategory
                                                                    : null
                                                            }
                                                            error={
                                                                formik.errors.socialCategory &&
                                                                    formik.touched.socialCategory
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
                                                    id="gpfPranType"
                                                    name="gpfPranType"
                                                    options={gpfPranList}
                                                    value={
                                                        gpfPranList.find(
                                                            (option) =>
                                                                option.id === formik.values.gpfPranType
                                                        ) || null
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value === null) {
                                                            formik.setFieldValue("gpfPranType", null);
                                                        } else formik.setFieldValue("gpfPranType", value.id);
                                                    }}
                                                    getOptionLabel={(value) => value.label}
                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="GPF/PRAN Type"
                                                            //  required
                                                            InputLabelProps={{ shrink: true }}
                                                            onBlur={formik.handleBlur}
                                                            helperText={
                                                                formik.errors.gpfPranType &&
                                                                    formik.touched.gpfPranType
                                                                    ? formik.errors.gpfPranType
                                                                    : null
                                                            }
                                                            error={
                                                                formik.errors.gpfPranType &&
                                                                    formik.touched.gpfPranType
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            {(formik.values.gpfPranType === 205 || formik.values.gpfPranType === 206) && (
                                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                                    <TextField
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="text"
                                                        id="gpfPranId"
                                                        name="gpfPranId"
                                                        label="GPF/PRAN ID"
                                                        size="small"
                                                        InputLabelProps={{ shrink: true }}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.gpfPranId}
                                                        error={formik.touched.gpfPranId && !!formik.errors.gpfPranId}
                                                        helperText={formik.touched.gpfPranId && formik.errors.gpfPranId}
                                                    />
                                                </Grid>
                                            )}
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    id="pancard"
                                                    name="pancard"
                                                    label="PAN Number"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.pancard}
                                                    error={formik.touched.pancard && !!formik.errors.pancard}
                                                    helperText={formik.touched.pancard && formik.errors.pancard}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    id="Aadhaar"
                                                    name="Aadhaar"
                                                    label="Aadhaar Number"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.Aadhaar}
                                                    error={formik.touched.Aadhaar && !!formik.errors.Aadhaar}
                                                    helperText={formik.touched.Aadhaar && formik.errors.Aadhaar}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container direction="row" rowSpacing={0} columnSpacing={2}>
                                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                                <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf", marginBottom: "20px" }}>
                                                    <PinDropTwoToneIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
                                                    <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Permanent Address</H3>
                                                </div>
                                                <Divider />
                                                <Grid
                                                    container
                                                    direction="row"
                                                    rowSpacing={0}
                                                    columnSpacing={2}
                                                    justify="flex-end"
                                                    alignItems="center"
                                                >
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <TextField
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="houseNumberComm"
                                                            label="House No./Building Name"
                                                            name="houseNumberComm"
                                                            value={formik.values.houseNumberComm || ""}
                                                            size="small"
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={
                                                                formik.touched.houseNumberComm &&
                                                                Boolean(formik.errors.houseNumberComm)
                                                            }
                                                            helperText={
                                                                formik.touched.houseNumberComm &&
                                                                formik.errors.houseNumberComm
                                                            }
                                                            disabled={disableoption}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <TextField
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="streetcomm"
                                                            label="Street"
                                                            name="streetcomm"
                                                            value={formik.values.streetcomm || ""}
                                                            InputLabelProps={{ shrink: true }}
                                                            size="small"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={
                                                                formik.touched.streetcomm &&
                                                                Boolean(formik.errors.streetcomm)
                                                            }
                                                            helperText={
                                                                formik.touched.streetcomm && formik.errors.streetcomm
                                                            }
                                                            disabled={disableoption}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <FormControl fullWidth >
                                                            <Autocomplete
                                                                disablePortal
                                                                margin="normal"
                                                                size="small"
                                                                fullWidth
                                                                id="stateIdcommunication"
                                                                name="stateIdcommunication"
                                                                options={stateonelist}
                                                                disabled={isReadable}
                                                                value={stateonelist.find(
                                                                    (option) => option.stateId === formik.values.stateIdcommunication?.stateId
                                                                ) || null}
                                                                onChange={(e, value) => {
                                                                    if (value === null) {
                                                                        formik.setFieldValue("stateIdcommunication", null)
                                                                    }
                                                                    else {
                                                                        formik.setFieldValue("stateIdcommunication", value)
                                                                        axios.get(`${process.env.REACT_APP_MASTER_API_URL}/user/getDistrictList/${value.stateId}`, {
                                                                            headers: {
                                                                                Authorization: `Bearer ${Cookies.get("token")}`
                                                                            }
                                                                        }).then(response => {
                                                                            let sortedDistrictData = response.data.result.map((value) => {
                                                                                value.districtName = value.districtName.toUpperCase();
                                                                                return value;
                                                                            })
                                                                            sortedDistrictData = sortedDistrictData.sort((a, b) => a.districtName.localeCompare(b.districtName));
                                                                            setDistrictoneList(sortedDistrictData);
                                                                            console.log(sortedDistrictData);
                                                                        })
                                                                            .catch(error => {
                                                                                setDistrictoneList([]);
                                                                                console.log(error);
                                                                            });
                                                                    }
                                                                }}
                                                                getOptionLabel={(value) => value.stateName}
                                                                sx={{ width: "100%", mt: 2, mb: 1 }}
                                                                renderInput={(params) => (
                                                                    <TextField {...params}
                                                                        // required
                                                                        label="State Name"
                                                                        name="stateIdcommunication"
                                                                        InputLabelProps={{ shrink: true }}
                                                                        onBlur={formik.handleBlur}
                                                                        helperText={formik.errors.stateIdcommunication && formik.touched.stateIdcommunication ? formik.errors.stateIdcommunication : null}
                                                                        error={formik.errors.stateIdcommunication && formik.touched.stateIdcommunication ? true : false}
                                                                        disabled={disableoption}
                                                                    />
                                                                )}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <FormControl fullWidth >
                                                            <Autocomplete
                                                                disablePortal
                                                                margin="normal"
                                                                size="small"
                                                                id="distIdcommunication"
                                                                name="distIdcommunication"
                                                                options={districtoneList}
                                                                value={districtoneList.find((option) => option.distId === formik.values.distIdcommunication?.distId) || null}
                                                                onChange={(e, value) => {
                                                                    if (value === null) {
                                                                        formik.setFieldValue("distIdcommunication", null);
                                                                    } else {
                                                                        formik.setFieldValue("distIdcommunication", value)
                                                                    }
                                                                }}
                                                                getOptionLabel={(value) => value.districtName}
                                                                sx={{ width: "100%", mt: 2, mb: 1 }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        // required
                                                                        {...params}
                                                                        label="District Name"
                                                                        name="distIdcommunication"
                                                                        InputLabelProps={{ shrink: true }}
                                                                        onBlur={formik.handleBlur}
                                                                        helperText={formik.errors.distIdcommunication && formik.touched.distIdcommunication ? formik.errors.distIdcommunication : null}
                                                                        error={formik.errors.distIdcommunication && formik.touched.distIdcommunication ? true : false}
                                                                        disabled={disableoption}
                                                                    />
                                                                )}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    {/* <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                <Autocomplete
                                                                    disablePortal
                                                                    margin="normal"
                                                                    size="small"
                                                                    fullWidth
                                                                    id="mandalIdcommunication"
                                                                    name="mandalIdcommunication"
                                                                    options={mandaloneList}
                                                                    value={mandaloneList.find(
                                                                        (option) => option.mandalId === formik.values.mandalIdcommunication?.mandalId) || null}
                                                                    onChange={(e, value) => {
                                                                        if (value === null) {
                                                                            formik.setFieldValue("mandalIdcommunication", null)
                                                                        }
                                                                        else {
                                                                            formik.setFieldValue("mandalIdcommunication", value);
                                                                            axios.get(`${process.env.REACT_APP_MASTER_API_URL}/user/getVillageList/${value.mandalId}`, {
                                                                                headers: {
                                                                                    Authorization: `Bearer ${Cookies.get("token")}`
                                                                                }
                                                                            }).then(response => {
                                                                                let sortedVillageData = response.data.result.map((value) => {
                                                                                    value.villageName = value.villageName.toUpperCase();
                                                                                    return value;
                                                                                })
                                                                                sortedVillageData = sortedVillageData.sort((a, b) => a.villageName.localeCompare(b.villageName));
                                                                                setIsVillageDisabled(false);
                                                                                setVillageoneList(sortedVillageData);
                                                                                console.log(sortedVillageData);
                                                                            })
                                                                                .catch(error => {
                                                                                    setVillageoneList([]);
                                                                                    console.log(error);
                                                                                });
                                                                        }
                                                                    }}
                                                                    getOptionLabel={(value) => value.mandalName}
                                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params}
                                                                            label="Mandal Name"
                                                                            name="mandalIdcommunication"
                                                                            InputLabelProps={{ shrink: true }}
                                                                            onBlur={formik.handleBlur}
                                                                            helperText={formik.errors.mandalIdcommunication && formik.touched.mandalIdcommunication ? formik.errors.mandalIdcommunication : null}
                                                                            error={formik.errors.mandalIdcommunication && formik.touched.mandalIdcommunication ? true : false}
                                                                            disabled={disableoption}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                <Autocomplete
                                                                    disablePortal
                                                                    fullWidth
                                                                    margin="normal"
                                                                    size="small"
                                                                    id="villageIdcommunication"
                                                                    name="villageIdcommunication"
                                                                    options={villageoneList}
                                                                    value={villageoneList.find(
                                                                        (option) => option.villageId === formik.values.villageIdcommunication?.villageId) || null}
                                                                    onChange={(e, value) => {
                                                                        console.log(value);
                                                                        if (value === null) {
                                                                            formik.setFieldValue("villageIdcommunication", null)
                                                                        }
                                                                        else {
                                                                            formik.setFieldValue("villageIdcommunication", value);
                                                                        }
                                                                    }}
                                                                    getOptionLabel={(value) => value.villageName}
                                                                    sx={{ width: "100%", mt: 2, mb: 1 }}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params}
                                                                            label="Village Name"
                                                                            name="villageIdcommunication"
                                                                            InputLabelProps={{ shrink: true }}
                                                                            onBlur={formik.handleBlur}
                                                                            helperText={formik.errors.villageIdcommunication && formik.touched.villageIdcommunication ? formik.errors.villageIdcommunication : null}
                                                                            error={formik.errors.villageIdcommunication && formik.touched.villageIdcommunication ? true : false}
                                                                            disabled={disableoption}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid> */}
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <FormControl fullWidth sx={{ mt: 2 }}>
                                                            <TextField
                                                                label="Pincode"
                                                                size="small"
                                                                fullWidth
                                                                required
                                                                placeholder={"999999"}
                                                                mask={"######"}
                                                                value={formik.values.pincodecomm || ""}
                                                                id="pincodecomm"
                                                                name="pincodecomm"
                                                                InputLabelProps={{ shrink: true }}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    formik.touched.pincodecomm &&
                                                                    Boolean(formik.errors.pincodecomm)
                                                                }
                                                                helperText={
                                                                    formik.touched.pincodecomm &&
                                                                    formik.errors.pincodecomm
                                                                }
                                                                disabled={disableoption}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid container direction="row" rowSpacing={0} columnSpacing={2}>
                                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                                <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf", marginBottom: "20px" }}>
                                                    <FeedIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
                                                    <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Current Employee Official Details</H3>
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
                                                        <Autocomplete
                                                            disablePortal
                                                            margin="normal"
                                                            size="small"
                                                            id="employeeType"
                                                            name="employeeType"
                                                            options={employeeList}
                                                            value={employeeList.find(
                                                                (option) => option.id === formik.values.employeeType
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("employeeType", null)
                                                                }
                                                                else {
                                                                    formik.setFieldValue("employeeType", value.id)
                                                                    axios.get(`http://141.148.194.18:8052/payroll/employee/dropdown/service-type/${value.id}`, {
                                                                        headers: {
                                                                            Authorization: `Bearer ${Cookies.get("token")}`
                                                                        }
                                                                    }).then(response => {
                                                                        console.log(response)
                                                                        if (response.status === 200) {
                                                                            setServiceList(response.data);
                                                                            setIsServiceType(false);
                                                                        }
                                                                        console.log(response);
                                                                    })
                                                                        .catch(error => {
                                                                            setServiceList([]);
                                                                            console.log(error);
                                                                        });
                                                                }
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Employee Type"
                                                                    required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.employeeType && formik.touched.employeeType ? formik.errors.employeeType : null}
                                                                    error={formik.errors.employeeType && formik.touched.employeeType ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <FormControl fullWidth >
                                                            <Tooltip title={isserviceType ? "Please select employee Type" : ""} arrow>
                                                                <Autocomplete
                                                                    disablePortal
                                                                    margin="normal"
                                                                    size="small"
                                                                    id="serviceType"
                                                                    name="serviceType"
                                                                    disabled={!formik.values.employeeType ?? true}
                                                                    options={serviceList}
                                                                    value={serviceList.find(
                                                                        (option) => option.id === formik.values.serviceType
                                                                    ) || null}
                                                                    onChange={(e, value) => {
                                                                        if (value === null) {
                                                                            formik.setFieldValue("serviceType", null)
                                                                        }
                                                                        else {
                                                                            formik.setFieldValue("serviceType", value.id);
                                                                            axios.get(`
                                                            http://141.148.194.18:8052/payroll/employee/dropdown/cadre/${value.id}`, {
                                                                                headers: {
                                                                                    Authorization: `Bearer ${Cookies.get("token")}`
                                                                                }
                                                                            }).then(response => {
                                                                                if (response.status === 200) {
                                                                                    setCradeList(response.data);
                                                                                    setRetirementAgeList(response.data[0].retirementAge);
                                                                                    setIsCradeType(false);
                                                                                }
                                                                                console.log(response.data[0].retirementAge);
                                                                            })
                                                                                .catch(error => {
                                                                                    setCradeList([]);
                                                                                    console.log(error);
                                                                                });
                                                                        }
                                                                    }}
                                                                    getOptionLabel={(value) => value.label}
                                                                    sx={{ width: "100%", mt: 2 }}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params}
                                                                            label="Service Type"
                                                                            // required
                                                                            InputLabelProps={{ shrink: true }}
                                                                            onBlur={formik.handleBlur}
                                                                            disabled={isserviceType}
                                                                            helperText={formik.errors.serviceType && formik.touched.serviceType ? formik.errors.serviceType : null}
                                                                            error={formik.errors.serviceType && formik.touched.serviceType ? true : false}
                                                                        />
                                                                    )}
                                                                />
                                                            </Tooltip>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <FormControl fullWidth >
                                                            <Tooltip title={iscradeType ? "Please select service Type" : ""} arrow>
                                                                <Autocomplete
                                                                    disablePortal
                                                                    margin="normal"
                                                                    size="small"
                                                                    id="cadre"
                                                                    name="cadre"
                                                                    disabled={!formik.values.serviceType ?? true}
                                                                    options={cradeList}
                                                                    value={cradeList.find(
                                                                        (option) => option.id === formik.values.cadre
                                                                    ) || null}
                                                                    onChange={(e, value) => {
                                                                        if (value === null) {
                                                                            formik.setFieldValue("cadre", null)
                                                                        }
                                                                        else
                                                                            formik.setFieldValue("cadre", value.id)
                                                                    }}
                                                                    getOptionLabel={(value) => value.label}
                                                                    sx={{ width: "100%", mt: 2 }}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params}
                                                                            label="Cadre"
                                                                            // required
                                                                            InputLabelProps={{ shrink: true }}
                                                                            onBlur={formik.handleBlur}
                                                                        
                                                                            helperText={formik.errors.cadre && formik.touched.cadre ? formik.errors.cadre : null}
                                                                            error={formik.errors.cadre && formik.touched.cadre ? true : false}
                                                                        />
                                                                    )}
                                                                />
                                                            </Tooltip>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <FormControl>
                                                            <FormLabel id="demo-row-radio-buttons-group-label">
                                                                Govt. Quarter Occupied (yes/no)
                                                            </FormLabel>
                                                            <RadioGroup
                                                                row
                                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                                name="govtOccupied"
                                                                value={formik.values.govtOccupied}
                                                                onChange={(e) => {
                                                                    formik.handleChange(e);
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
                                                            {formik.touched.govtOccupied &&
                                                                formik.errors.govtOccupied && (
                                                                    <FormHelperText error>
                                                                        {formik.errors.govtOccupied}
                                                                    </FormHelperText>
                                                                )}
                                                        </FormControl>
                                                    </Grid>
                                                    {formik.values.govtOccupied === "true" && (
                                                        <Grid item xs={12} sm={4} md={4} lg={4}>
                                                            <Autocomplete
                                                                disablePortal
                                                                margin="normal"
                                                                size="small"
                                                                id="quarterType"
                                                                name="quarterType"
                                                                options={quarterTypeList}
                                                                value={
                                                                    quarterTypeList.find(
                                                                        (option) =>
                                                                            option.id ===
                                                                            formik.values.quarterType
                                                                    ) || null
                                                                }
                                                                onChange={(e, value) => {
                                                                    if (value === null) {
                                                                        formik.setFieldValue("quarterType", null);
                                                                    } else formik.setFieldValue("quarterType", value.id);
                                                                }}
                                                                getOptionLabel={(value) => value.label}
                                                                sx={{ width: "100%", mt: 2, mb: 1 }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="Quarter Type"
                                                                        //required
                                                                        onBlur={formik.handleBlur}
                                                                        InputLabelProps={{ shrink: true }}
                                                                        helperText={
                                                                            formik.errors.quarterType &&
                                                                                formik.touched.quarterType
                                                                                ? formik.errors.quarterType
                                                                                : null
                                                                        }
                                                                        error={
                                                                            formik.errors.quarterType &&
                                                                                formik.touched.quarterType
                                                                                ? true
                                                                                : false
                                                                        }
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    )}
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <Autocomplete
                                                            disablePortal
                                                            margin="normal"
                                                            size="small"
                                                            id="parentDept"
                                                            name="parentDept"
                                                            options={departmentList}
                                                            value={departmentList.find(
                                                                (option) => option.id === formik.values.parentDept
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("parentDept", null)
                                                                }
                                                                else
                                                                    formik.setFieldValue("parentDept", value.id)
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Parent Department"
                                                                    // required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.parentDept && formik.touched.parentDept ? formik.errors.parentDept : null}
                                                                    error={formik.errors.parentDept && formik.touched.parentDept ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <Autocomplete
                                                            disablePortal
                                                            margin="normal"
                                                            size="small"
                                                            id="currentDept"
                                                            name="currentDept"
                                                            options={departmentList}
                                                            value={departmentList.find(
                                                                (option) => option.id === formik.values.currentDept
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("currentDept", null)
                                                                }
                                                                else {
                                                                    formik.setFieldValue("currentDept", value.id);
                                                                    axios.get(`http://141.148.194.18:8052/payroll/employee/dropdown/designation/${value.id}`, {
                                                                        headers: {
                                                                            Authorization: `Bearer ${Cookies.get("token")}`
                                                                        }
                                                                    }).then(response => {
                                                                        if (response.status === 200) {
                                                                            setDesignation(response.data);
                                                                            setIsDesignation(false);
                                                                        }
                                                                        console.log(response);
                                                                    })
                                                                        .catch(error => {
                                                                            setDesignation([]);
                                                                            console.log(error);
                                                                        });
                                                                }
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Current Department"
                                                                    required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.currentDept && formik.touched.currentDept ? formik.errors.currentDept : null}
                                                                    error={formik.errors.currentDept && formik.touched.currentDept ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <FormControl fullWidth >
                                                            <Tooltip title={isdesignation ? "Please select Department" : ""} arrow>
                                                                <Autocomplete
                                                                    disablePortal
                                                                    margin="normal"
                                                                    size="small"
                                                                    id="currentDesgn"
                                                                    name="currentDesgn"
                                                                    options={designation}
                                                                    value={designation.find(
                                                                        (option) => option.id === formik.values.currentDesgn
                                                                    ) || null}
                                                                    onChange={(e, value) => {
                                                                        if (value === null) {
                                                                            formik.setFieldValue("currentDesgn", null)
                                                                        }
                                                                        else {
                                                                            formik.setFieldValue("currentDesgn", value.id);
                                                                        }
                                                                    }}
                                                                    getOptionLabel={(value) => value.label}
                                                                    sx={{ width: "100%", mt: 2 }}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params}
                                                                            label="Current Designation"
                                                                            //required
                                                                            InputLabelProps={{ shrink: true }}
                                                                            onBlur={formik.handleBlur}
                                                                            helperText={formik.errors.currentDesgn && formik.touched.currentDesgn ? formik.errors.currentDesgn : null}
                                                                            error={formik.errors.currentDesgn && formik.touched.currentDesgn ? true : false}
                                                                        />
                                                                    )}
                                                                />
                                                            </Tooltip>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={3} md={3} lg={3}>
                                                        <Autocomplete
                                                            disablePortal
                                                            disabled={true}
                                                            margin="normal"
                                                            size="small"
                                                            id="currentOffice"
                                                            name="currentOffice"
                                                            options={genderList}
                                                            value={genderList.find(
                                                                (option) => option.id === formik.values.currentOffice
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("currentOffice", null)
                                                                }
                                                                else
                                                                    formik.setFieldValue("currentOffice", value.id)
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Current Office"
                                                                    //   required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.currentOffice && formik.touched.currentOffice ? formik.errors.currentOffice : null}
                                                                    error={formik.errors.currentOffice && formik.touched.currentOffice ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={1} md={1} lg={1}>
                                                        <IconButton
                                                            edge="start"
                                                            color="inherit"
                                                            onClick={() => { setOpenModal(true) }}
                                                            aria-label="search"
                                                            sx={{ alignItems: "right", display: "flex" }}
                                                        >
                                                            <SearchIcon />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <Autocomplete
                                                            disablePortal
                                                            margin="normal"
                                                            size="small"
                                                            id="appointmentOrdNo"
                                                            name="appointmentOrdNo"
                                                            options={genderList}
                                                            value={genderList.find(
                                                                (option) => option.id === formik.values.appointmentOrdNo
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("appointmentOrdNo", null)
                                                                }
                                                                else
                                                                    formik.setFieldValue("appointmentOrdNo", value.id)
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Appointment Order Number"
                                                                    //  required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.appointmentOrdNo && formik.touched.appointmentOrdNo ? formik.errors.appointmentOrdNo : null}
                                                                    error={formik.errors.appointmentOrdNo && formik.touched.appointmentOrdNo ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <LocalizationProvider
                                                            dateAdapter={AdapterDayjs}
                                                            adapterLocale={"en-gb"}
                                                        >
                                                            <DatePicker
                                                                label="Appointment Order Date"
                                                                inputFormat="DD-MM-YYYY"
                                                                maxDate={new Date()}
                                                                id="appointmentOrdDate"
                                                                name="appointmentOrdDate"
                                                                value={formik.values.appointmentOrdDate}
                                                                InputLabelProps={{ shrink: true }}
                                                                onChange={(value) => { if (value === null) { formik.setFieldValue("appointmentOrdDate", "") } else { formik.setFieldValue("appointmentOrdDate", dayjs(value).format('YYYY-MM-DD')) } }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        size="small"
                                                                        fullWidth
                                                                        margin="normal"
                                                                        name="appointmentOrdDate"
                                                                        required
                                                                        {...params}
                                                                        error={formik.touched.appointmentOrdDate && Boolean(formik.errors.appointmentOrdDate)}
                                                                        helperText={formik.touched.appointmentOrdDate && formik.errors.appointmentOrdDate}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                    <Grid item xs={12} sm={3} md={3} lg={3}>
                                                        <Autocomplete
                                                            disablePortal
                                                            disabled={true}
                                                            margin="normal"
                                                            size="small"
                                                            id="orderIssuingOffice"
                                                            name="orderIssuingOffice"
                                                            options={genderList}
                                                            value={genderList.find(
                                                                (option) => option.id === formik.values.orderIssuingOffice
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("orderIssuingOffice", null)
                                                                }
                                                                else
                                                                    formik.setFieldValue("orderIssuingOffice", value.id)
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Order Issuing Office/Authority"
                                                                    // required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.orderIssuingOffice && formik.touched.orderIssuingOffice ? formik.errors.orderIssuingOffice : null}
                                                                    error={formik.errors.orderIssuingOffice && formik.touched.orderIssuingOffice ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={1} md={1} lg={1}>
                                                        <IconButton
                                                            edge="start"
                                                            color="inherit"
                                                            onClick={() => { setOpenModal(true) }}
                                                            aria-label="search"
                                                            sx={{ alignItems: "right", display: "flex" }}
                                                        >
                                                            <SearchIcon />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <Autocomplete
                                                            disablePortal
                                                            margin="normal"
                                                            size="small"
                                                            id="srcOfRecruit"
                                                            name="srcOfRecruit"
                                                            options={srcOfRecruitList}
                                                            value={srcOfRecruitList.find(
                                                                (option) => option.id === formik.values.srcOfRecruit
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("srcOfRecruit", null)
                                                                }
                                                                else
                                                                    formik.setFieldValue("srcOfRecruit", value.id)
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Source of Recruitment"
                                                                    //  required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.srcOfRecruit && formik.touched.srcOfRecruit ? formik.errors.srcOfRecruit : null}
                                                                    error={formik.errors.srcOfRecruit && formik.touched.srcOfRecruit ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <LocalizationProvider
                                                            dateAdapter={AdapterDayjs}
                                                            adapterLocale={"en-gb"}
                                                        >
                                                            <DatePicker
                                                                label="Joining/Charge Taken Date"
                                                                inputFormat="DD-MM-YYYY"
                                                                maxDate={new Date()}
                                                                id="joiningDate"
                                                                name="joiningDate"
                                                                value={formik.values.joiningDate}
                                                                InputLabelProps={{ shrink: true }}
                                                                onChange={(value) => { if (value === null) { formik.setFieldValue("joiningDate", "") } else { formik.setFieldValue("joiningDate", dayjs(value).format("YYYY-MM-DD")) } }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        size="small"
                                                                        fullWidth
                                                                        margin="normal"
                                                                        name="joiningDate"
                                                                        required
                                                                        {...params}
                                                                        error={formik.touched.joiningDate && Boolean(formik.errors.joiningDate)}
                                                                        helperText={formik.touched.joiningDate && formik.errors.joiningDate}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <Autocomplete
                                                            disablePortal
                                                            margin="normal"
                                                            size="small"
                                                            id="joiningTime"
                                                            name="joiningTime"
                                                            options={joiningTimeList}
                                                            value={joiningTimeList.find(
                                                                (option) => option.id === formik.values.joiningTime
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("joiningTime", null)
                                                                }
                                                                else
                                                                    formik.setFieldValue("joiningTime", value.id)
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Joining Time"
                                                                    //  required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.joiningTime && formik.touched.joiningTime ? formik.errors.joiningTime : null}
                                                                    error={formik.errors.joiningTime && formik.touched.joiningTime ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
                                                            <DatePicker
                                                                label="Superannuation Date"
                                                                inputFormat="DD-MM-YYYY"
                                                                id="superannuationDate"
                                                                name="superannuationDate"
                                                                value={formik.values.superannuationDate}
                                                                InputLabelProps={{ shrink: true }}
                                                                onChange={(value) => {
                                                                    if (value === null) {
                                                                        formik.setFieldValue("superannuationDate", "");
                                                                    } else {
                                                                        formik.setFieldValue("superannuationDate", dayjs(value).format("YYYY-MM-DD"));
                                                                    }
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        size="small"
                                                                        fullWidth
                                                                        margin="normal"
                                                                        name="superannuationDate"
                                                                        required
                                                                        {...params}
                                                                        error={formik.touched.superannuationDate && Boolean(formik.errors.superannuationDate)}
                                                                        helperText={formik.touched.superannuationDate && formik.errors.superannuationDate}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <LocalizationProvider
                                                            dateAdapter={AdapterDayjs}
                                                            adapterLocale={"en-gb"}
                                                        >
                                                            <DatePicker
                                                                label="Confiramtion Date"
                                                                inputFormat="DD-MM-YYYY"
                                                                maxDate={new Date()}
                                                                id="confirmationDate"
                                                                name="confirmationDate"
                                                                value={formik.values.confirmationDate}
                                                                InputLabelProps={{ shrink: true }}
                                                                onChange={(value) => {
                                                                    if (value === null) { formik.setFieldValue("confirmationDate", "") }
                                                                    else { formik.setFieldValue("confirmationDate", dayjs(value).format("YYYY-MM-DD")) }
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        size="small"
                                                                        fullWidth
                                                                        margin="normal"
                                                                        name="confirmationDate"
                                                                        required
                                                                        {...params}
                                                                        error={formik.touched.confirmationDate && Boolean(formik.errors.confirmationDate)}
                                                                        helperText={formik.touched.confirmationDate && formik.errors.confirmationDate}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <Autocomplete
                                                            disablePortal
                                                            margin="normal"
                                                            size="small"
                                                            id="paySlip"
                                                            name="paySlip"
                                                            options={paySlipList}
                                                            value={paySlipList.find(
                                                                (option) => option.id === formik.values.paySlip
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("paySlip", null)
                                                                }
                                                                else
                                                                    formik.setFieldValue("paySlip", value.id)
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Pay Slip"
                                                                    //    required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.paySlip && formik.touched.paySlip ? formik.errors.paySlip : null}
                                                                    error={formik.errors.paySlip && formik.touched.paySlip ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                                        <Autocomplete
                                                            disablePortal
                                                            margin="normal"
                                                            size="small"
                                                            id="payslipAuthority"
                                                            name="payslipAuthority"
                                                            options={payslipAuthorityList}
                                                            value={payslipAuthorityList.find(
                                                                (option) => option.id === formik.values.payslipAuthority
                                                            ) || null}
                                                            onChange={(e, value) => {
                                                                if (value === null) {
                                                                    formik.setFieldValue("payslipAuthority", null)
                                                                }
                                                                else
                                                                    formik.setFieldValue("payslipAuthority", value.id)
                                                            }}
                                                            getOptionLabel={(value) => value.label}
                                                            sx={{ width: "100%", mt: 2 }}
                                                            renderInput={(params) => (
                                                                <TextField {...params}
                                                                    label="Pay Slip Authority"
                                                                    // required
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onBlur={formik.handleBlur}
                                                                    helperText={formik.errors.payslipAuthority && formik.touched.payslipAuthority ? formik.errors.payslipAuthority : null}
                                                                    error={formik.errors.payslipAuthority && formik.touched.payslipAuthority ? true : false}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf", marginBottom: "20px" }}>
                                            <PostAddIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
                                            <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Additional Information</H3>
                                        </div>
                                        <Divider />
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell>S.NO</StyledTableCell>
                                                        <StyledTableCell>Attachment Type</StyledTableCell>
                                                        <StyledTableCell>Attachment Name</StyledTableCell>
                                                        <StyledTableCell>View Link</StyledTableCell>
                                                        <StyledTableCell>Upload Button</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <StyledTableRow>
                                                        <StyledTableCell component="th" scope="row">1</StyledTableCell>
                                                        <StyledTableCell>Aadhar Card</StyledTableCell>
                                                        <StyledTableCell>{formik.values.aadharDocName}</StyledTableCell>
                                                        <StyledTableCell>
                                                            {formik.values.aadharDoc && (
                                                                <>
                                                                    {formik.values.submitDisable === false ? (
                                                                        <Link href="#" underline="none" onClick={(event) => getFile(event, formik.values.aadharDoc)}>
                                                                            <Typography>Uploaded File: {formik.values.aadharDocName}</Typography>
                                                                        </Link>
                                                                    ) : (
                                                                        <Typography sx={{ color: "green", fontSize: "12px" }}>Uploaded File: {formik.values.aadharDocName}</Typography>
                                                                    )}
                                                                </>
                                                            )}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <Button
                                                                sx={{ borderRadius: "5%" }}
                                                                component="label"
                                                                variant="contained"
                                                                startIcon={<CloudUploadIcon />}
                                                                onClick={handleButtonClick2}
                                                            >
                                                                Upload Aadhar
                                                            </Button>
                                                            <VisuallyHiddenInput
                                                                ref={fileInputRef2}
                                                                type="file"
                                                                onChange={handleFileChange2}
                                                            />
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                    <StyledTableRow>
                                                        <StyledTableCell component="th" scope="row">2</StyledTableCell>
                                                        <StyledTableCell>Pancard Card</StyledTableCell>
                                                        <StyledTableCell>{formik.values.panDocName}</StyledTableCell>
                                                        <StyledTableCell>
                                                            {formik.values.panDoc && (
                                                                <>
                                                                    {formik.values.submitDisable === false ? (
                                                                        <Link href="#" underline="none" onClick={(event) => getFile(event, formik.values.panDoc)}>
                                                                            <Typography>Uploaded File: {formik.values.panDocName}</Typography>
                                                                        </Link>
                                                                    ) : (
                                                                        <Typography sx={{ color: "green", fontSize: "12px" }}>Uploaded File: {formik.values.panDocName}</Typography>
                                                                    )}
                                                                </>
                                                            )}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <Button
                                                                sx={{ borderRadius: "5%" }}
                                                                component="label"
                                                                variant="contained"
                                                                startIcon={<CloudUploadIcon />}
                                                                onClick={handleButtonClick3}
                                                            >
                                                                Upload PAN Card
                                                            </Button>
                                                            <VisuallyHiddenInput
                                                                ref={fileInputRef3}
                                                                type="file"
                                                                onChange={handleFileChange3}
                                                            />
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

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
            {/* <Card>
                <CardContent>
                <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Additional Information</H3>
                    <SearchTable
                     columns={columns}
                     isCheckbox={false}
                     isHideDensity={false}
                     isHideExport={true}
                     isHideFilter={true}
                     isHideColumn={true}
                     isHidePaging={false}
                     data={uploadedFiles}
                     name="abc"
                     id="hjjh"
                    />
                </CardContent>
            </Card> */}
            {/* <Box sx={{ overflow: "auto", mt: 3 }} >
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <TableContainer>
            {uploadedFiles.map((file, index) => (
              <>
                {/* <SubHeadingDesign name={keys[index]} textAlign={"left"} /> */}
            {/* <Table key={index} class="myTable">
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Name</TableCell>
                      <TableCell>File Name</TableCell>  
                      <TableCell>View</TableCell>
                      <TableCell>Download</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow >
                      {file.length > 0 ? (
                        <>
                          <TableCell>{file?.[0].attachmentName}</TableCell>
                          <TableCell>{file?.[0].fileName}</TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="download"
                              onClick={() => handleDownloadFile(file[0])}
                              color="primary"
                            >
                              <DownloadIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteFile(index)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </>
                      ) : <>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </>}
                    </TableRow>
                  </TableBody>
                </Table>
              </>
            ))}
          </TableContainer>
        </Box> */}
            {/* </Box>  */}
            {openModal && (
                <Modal
                    closeModal={setOpenModal}
                />
            )}
        </>
    );
};
export default SavePersonalDetails;
