const officeIds = values.officeSelect 
            ? [values.officeSelect.id] 
            : officeData.map(office => office.id); // If officeSelect is null, get all office IDs





import { Card, Grid, CardContent, TextField, Box, Button, Alert } from '@mui/material';
import React, { useState, useEffect } from 'react';
import PageTitle from '../../layouts/PageTitle';
import useTitle from '../../hooks/useTitle';
import SearchTable from '../../components/SearchTableAlt';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/AxiosInterceptor';
import Loader from '../../components/Loader';
import { useFormik } from 'formik';
import * as yup from "yup";
import { useSnackbar } from '../../components/Snackbar';

const SalaryProcessReport = () => {
    const title = 'Salary Process Report';
    const name = 'Processed Salary Report';
    const name1 = 'Salary Process Report';
    useTitle(title);

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const validationSchema = yup.object({
        department: yup.object().nullable().required("Please select HOA"),
        financialYear: yup.object().nullable().required("Financial year is required"),
    });

    const formik = useFormik({
        initialValues: {
            officeSelect: null,
            department: null,
            financialYear: null,
            totalEmployee: '',
            salaryInitiated: '',
            salaryNotInitiatedYet: '',
            delay: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            const officeIds = values.officeSelect 
                ? [values.officeSelect.id] 
                : officeData.map(office => office.id);

            handleFetchTableData({
                deptId: [values.department?.id],
                empIds: [],
                officeIds: officeIds,
                payMontId: values.financialYear?.id,
            });
        },
    });

    const [departmentData, setDepartmentData] = useState([]);
    const [financialYearData, setFinancialYearData] = useState([]);
    const [officeData, setOfficeData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [callOfficeData, setCallOfficeData] = useState(false);
    const [isLoader, setIsLoader] = useState(false);

    const handleFetchIndependentDropdownData = async () => {
        try {
            const res = await axiosClient.get(`${process.env.REACT_APP_PAYROLL_API_URL}/getIndependentdropdown`);
            if (res.data.status) {
                const departmentDropdown = res.data.result.departments.map((item) => ({
                    id: item.deptId,
                    label: item.name
                }));
                setDepartmentData(departmentDropdown);
                setIsLoader(false);
            }
        } catch (error) {
            setIsLoader(false);
            console.log(error);
        }
    };

    const Fetchfymonth = async () => {
        try {
            const res = await axiosClient.get(`${process.env.REACT_APP_PAYROLL_API_URL}/getFyMonth`);
            if (res.data.status) {
                const financialYearDropdown = res.data.result.map((item) => ({
                    id: item.typeId,
                    label: item.typeName
                }));
                setFinancialYearData(financialYearDropdown);
                setIsLoader(false);
            }
        } catch (error) {
            setIsLoader(false);
            console.log(error);
        }
    };

    const handleCallofficeData = async () => {
        setIsLoader(true);
        try {
            const payload = {
                deptId: formik.values.department.id,
                stateId: null,
                districtId: null,
                officeName: null
            };
            const res = await axiosClient.post(`http://141.148.194.18:8052/payroll/employee/dropdown/office`, payload);
            if (res.status === 200) {
                const officeDropdown = res.data.map((item) => ({
                    id: item.id,
                    label: item.officeName
                }));
                setOfficeData(officeDropdown);
                formik.setFieldValue('officeSelect', null);
                setIsLoader(false);
                setCallOfficeData(false);
            } else {
                setIsLoader(false);
                formik.setFieldValue('officeSelect', null);
                setOfficeData([]);
            }
        } catch (error) {
            console.log(error);
            setIsLoader(false);
            formik.setFieldValue('officeSelect', null);
            setOfficeData([]);
        }
    };

    const handleFetchTableData = async (payload) => {
        try {
            setIsLoader(true);
            const res = await axiosClient.post(`${process.env.REACT_APP_PAYROLL_API_URL}/getEmployeeReport`, payload);
            if (res.data.status) {
                setTableData(res.data.result);
                setIsLoader(false);
                setShowPeriodList(true);
                showSnackbar(res.data.message, 'success');
            } else {
                setIsLoader(false);
                showSnackbar('No records found', 'error');
            }
        } catch (error) {
            console.log(error);
            setIsLoader(false);
            showSnackbar('No records found', 'error');
        }
    };

    useEffect(() => {
        setIsLoader(true);
        handleFetchIndependentDropdownData();
        Fetchfymonth();
    }, []);

    useEffect(() => {
        if (callOfficeData) {
            handleCallofficeData();
        }
    }, [formik.values.department]);

    return (
        <>
            {isLoader && <Loader />}
            <Card>
                <CardContent>
                    <PageTitle name={name} />
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container columnSpacing={2}>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    options={departmentData}
                                    fullWidth
                                    id="department"
                                    name="department"
                                    required
                                    value={
                                        departmentData.find(
                                            (option) => option.id === formik.values.department?.id
                                        ) || null
                                    }
                                    onChange={(e, value) => {
                                        if (value === null) {
                                            formik.setFieldValue("department", null);
                                            formik.setFieldValue('officeSelect', null);
                                        } else {
                                            formik.setFieldValue("department", value);
                                            setCallOfficeData(true);
                                        }
                                    }}
                                    getOptionLabel={(value) => value.label}
                                    size='small'
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Department"
                                            required
                                            onBlur={formik.handleBlur}
                                            helperText={
                                                formik.errors.department &&
                                                    formik.touched.department
                                                    ? formik.errors.department
                                                    : null
                                            }
                                            error={
                                                formik.errors.department &&
                                                    formik.touched.department
                                                    ? true
                                                    : false
                                            }
                                        />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    options={officeData}
                                    fullWidth
                                    disabled={formik.values.department ? false : true}
                                    id="officeSelect"
                                    name="officeSelect"
                                    required
                                    value={officeData &&
                                        officeData.find(
                                            (option) => option.id === formik.values.officeSelect?.id
                                        ) || null
                                    }
                                    onChange={(e, value) => {
                                        if (value === null) {
                                            formik.setFieldValue("officeSelect", null);
                                        } else {
                                            formik.setFieldValue("officeSelect", value);
                                        }
                                    }}
                                    getOptionLabel={(value) => value.label}
                                    size='small'
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Office"
                                            required
                                            onBlur={formik.handleBlur}
                                            helperText={
                                                formik.errors.officeSelect &&
                                                    formik.touched.officeSelect
                                                    ? formik.errors.officeSelect
                                                    : null
                                            }
                                            error={
                                                formik.errors.officeSelect &&
                                                    formik.touched.officeSelect
                                                    ? true
                                                    : false
                                            }
                                        />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    options={financialYearData}
                                    fullWidth
                                    id="financialYear"
                                    name="financialYear"
                                    required
                                    value={
                                        financialYearData.find(
                                            (option) => option.id === formik.values.financialYear?.id
                                        ) || null
                                    }
                                    onChange={(e, value) => {
                                        if (value === null) {
                                            formik.setFieldValue("financialYear", null);
                                        } else {
                                            formik.setFieldValue("financialYear", value);
                                        }
                                    }}
                                    getOptionLabel={(value) => value.label}
                                    size='small'
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Financial Year"
                                            required
                                            onBlur={formik.handleBlur}
                                            helperText={
                                                formik.errors.financialYear &&
                                                    formik.touched.financialYear
                                                    ? formik.errors.financialYear
                                                    : null
                                            }
                                            error={
                                                formik.errors.financialYear &&
                                                    formik.touched.financialYear
                                                    ? true
                                                    : false
                                            }
                                        />}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item style={{ width: '100%', display: 'flex', justifyContent: 'right', marginTop: '1rem' }}>
                                <Button variant='contained' type="submit" disabled={isLoader}>
                                    {isLoader ? 'Please wait..' : 'Submit'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
            <SearchTable
                name1={name1}
                showPeriodList={showPeriodList}
                data={tableData}
                downloadButtonName="Download Salary Process Report"
                dowloadFileName="salary-process-report"
                downloadPath={`${process.env.REACT_APP_PAYROLL_API_URL}/getEmployeeReportExcel`}
            />
        </>
    );
};

export default SalaryProcessReport;

























import { Card, Grid, CardContent, TextField, Box, Button, Stack, Typography, Alert } from '@mui/material'
import React, {useState, useEffect} from 'react'
import PageTitle from '../../layouts/PageTitle'
import useTitle from '../../hooks/useTitle'
import SearchTable from '../../components/SearchTableAlt';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/AxiosInterceptor';
import Loader from '../../components/Loader';
import { useFormik } from 'formik';
import * as yup from "yup";
import AlertConfirm, { Button1 } from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
import { useSnackbar } from '../../components/Snackbar';

const SalaryProcessReport = () => {

    const title = 'Salary Process Report';
    const name = 'Processed Salary Report';
    const name1= 'Salary Process Report'
    useTitle(title)

    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar();
    const validationSchema = yup.object({
       // officeSelect: yup.object().nullable().required("Please select Office"),
        department: yup.object().nullable().required("Please select HOA"),
        financialYear: yup.object().nullable().required("Financial year is required"),
    });
    const formik = useFormik({
        initialValues: {
            officeSelect: "",
            department:null,
            financialYear:null,
            totalEmployee: '',
            salaryInitiated:'',
            salaryNotInitiatedYet  :'',
            delay:'',


        },
        validationSchema: validationSchema,
        onSubmit: (values, {resetForm}) => {
            console.log(values)
            // callConfirmDialogFormSave(values, resetForm);
            handleFetchTableData({
                deptId : [formik.values.department && formik.values.department?.id],
                empIds:[],
                officeIds:[1,2,3,23],
                // officeIds: [formik.values.officeSelect && formik.values?.officeSelect?.id],
                payMontId: formik.values.financialYear && formik.values?.financialYear?.id
            });
        }
    })
    console.log(formik.values)
    // const handleOpenGroup =(params) => {
    //     navigate('/opengroup', {state:params})
    // }
    // const handleGoForProcess = (params)=> {
    //     navigate('/SalaryProcess', {state:[params, formik.values.officeSelect?.id]});
    // }

    const columns = [
        {
            field: "officeId",
            headerName: "Office Id.",
            flex: 0.1,
            minWidth: 180,
            headerClassName: "super-app-theme--header",

        },
        {
            field: "officeName",
            headerName: "Office Name",
            flex: 0.2,
            minWidth: 180,
            headerClassName: "super-app-theme--header",

        },
        {
            field: "deptName",
            headerName: "Department Name",
            flex: 0.2,
            minWidth: 180,
            headerClassName: "super-app-theme--header",

        },
        {
            field: "notProcessedCount",
            headerName: "Not Processed Count",
            flex: 0.2,
            minWidth: 180,
            headerClassName: "super-app-theme--header",

        },
        {
            field: "processedCount",
            headerName: "Processed Count",
            flex: 0.2,
            minWidth: 180,
            headerClassName: "super-app-theme--header",

        },
        {
            field: "notDelayedCount",
            headerName: "Not Delayed Count",
            flex: 0.2,
            minWidth: 180,
            headerClassName: "super-app-theme--header",

        },
        {
            field: "totalEmp",
            headerName: "Total Employee",
            flex: 0.2,
            minWidth: 180,
            headerClassName: "super-app-theme--header",

        },
        {
            field: "delayedCount",
            headerName: "Delayed Count",
            flex: 0.2,
            minWidth: 180,
            headerClassName: "super-app-theme--header",

        },
    ];

    
    const [departmentData, setDepartmentData] = useState([]);
    const [financialYearData, setFinancialYearData] = useState([]);
    const [officeData, setOfficeData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [ callOfficeData, setCallOfficeData] = useState(false);

    const [showPeriodList, setShowPeriodList] = useState(false);
    const [fieldData, setFieldData] = useState();
    const [isLoader, setIsLoader] = useState(false);

    const handleFetchIndependentDropdownData = async() => {
        try {
            const res = await axiosClient.get(`${process.env.REACT_APP_PAYROLL_API_URL}/getIndependentdropdown`)
             console.log(res.data.result.departments);
            if(res.data.status){

                const departmentDropdown = res?.data?.result?.departments?.map((item) => ({
                    id: item?.deptId,
                    label: item?.name
                   
                }))

                console.log(departmentDropdown);
                setDepartmentData(departmentDropdown);
                setIsLoader(false);
            }

        } catch (error) {
            setIsLoader(false);
            console.log(error)
        }
    }

    const Fetchfymonth= async() => {
        try {
            const res = await axiosClient.get(`${process.env.REACT_APP_PAYROLL_API_URL}/getFyMonth`)
            if(res.data.status){

                const financialYearDropdown = res?.data?.result?.map((item) => ({
                    id: item?.typeId,
                    label: item?.typeName
                }))
                console.log(financialYearDropdown);
                setFinancialYearData(financialYearDropdown);
                setIsLoader(false);
            }

        } catch (error) {
            setIsLoader(false);
            console.log(error)
        }
    }

    const handleCallofficeData =async() => {
        setIsLoader(true);
        try {
            const payload = {
                deptId: formik.values.department.id,
                stateId:  null,
                districtId: null,
                officeName: null
              };
            const res = await axiosClient.post(`http://141.148.194.18:8052/payroll/employee/dropdown/office`,payload )
            console.log('office',res);
            if(res.status === 200){
                const officeDropdown = res?.data?.map((item) => ({
                    id: item?.id,
                    label: item?.officeName
                }))

                console.log(officeDropdown)
                setOfficeData(officeDropdown)
                formik.setFieldValue('officeSelect', null)
                setIsLoader(false);
                setCallOfficeData(false);
            }
            else{
                setIsLoader(false);
                formik.setFieldValue('officeSelect', null)
                setOfficeData([])
            }
        } catch (error) {
            console.log(error)
            setIsLoader(false);
            formik.setFieldValue('officeSelect', null)
            setOfficeData([])
        }
    }

    var val;
    const handleReset =(val) => {
        formik.setFieldValue('hoa', null);
        formik.setFieldValue('financialYear', null);
        handleFetchTableData({
            deptId: 1,
            officeIds: null,
            empIds:null,
            payMontId: null

        }, val);
    }
    const handleFetchTableData = async(payload, val) => {

        // const payload = {
        //     officeId : formik.values.officeSelect ? formik.values.officeSelect?.id : 1,
        //     hoaId: formik.values.hoa ? formik.values?.hoa?.id : null,
        //     fyId: formik.values.financialYear ? formik.values?.financialYear?.id : null
        // }
        console.log(val, 'val')
        try {
            setIsLoader(true);
            const res = await axiosClient.post(`${process.env.REACT_APP_PAYROLL_API_URL}/getEmployeeReport`, payload)
            console.log('tableData',res);

            if(res.data.status){
                setTableData(res.data?.result);
                // formik.setFieldValue('totalEmployee', (res.data.result?.allocatedEmp + res.data.result?.unAllocatedEmp))
                // formik.setFieldValue('allocatedEmployee', res.data.result?.allocatedEmp)
                // formik.setFieldValue('unallocatedEmployee', res.data.result?.unAllocatedEmp)
                setIsLoader(false);
                setShowPeriodList(true);
                showSnackbar(res.data.message, 'success');
                if(val){
                    setShowPeriodList(false);
                    // formik.setFieldValue('totalEmployee', '')       
                    // formik.setFieldValue('allocatedEmployee', '')
                    // formik.setFieldValue('unallocatedEmployee', '')
                }
            }
            else{
                setIsLoader(false);
                showSnackbar('No records found', 'error')
            }
        } catch (error) {
            console.log(error);
            setIsLoader(false);
            showSnackbar('No records found', 'error')
        }
    }
    useEffect(() => {
        setIsLoader(true);
        handleFetchIndependentDropdownData();
        Fetchfymonth();
        // handleFetchTableData();
    }, [])

    useEffect(() => {
        if(callOfficeData){
            // setIsLoader(true);
            handleCallofficeData();
        }
    }, [formik.values.department])

    return (
        <>
        {isLoader && <Loader />}
        <Card>
            <CardContent>
                <PageTitle name={name}/>
                    <Box component= "form" onSubmit={formik.handleSubmit}>
                        <Grid container columnSpacing={2}>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    options={departmentData}
                                    fullWidth
                                    id="department"
                                    name="department"
                                    required
                                    value={
                                        departmentData.find(
                                        (option) =>
                                            option.id === formik.values.department?.id
                                        ) || null
                                    }
                                    onChange={(e, value) => {
                                        if (value === null) {
                                            formik.setFieldValue("department", null);
                                            formik.setFieldValue('officeSelect', null);
                                        } else {
                                            formik.setFieldValue("department", value);
                                            setCallOfficeData(true);
                                        }
                                    }}
                                    getOptionLabel={(value) => value.label}
                                    size='small'
                                    renderInput={(params) => 
                                        <TextField 
                                            {...params} 
                                            label="Department"
                                            required
                                            onBlur={formik.handleBlur}
                                            helperText={
                                                formik.errors.department &&
                                                formik.touched.department
                                                ? formik.errors.department
                                                : null
                                            }
                                            error={
                                                formik.errors.department &&
                                                formik.touched.department
                                                ? true
                                                : false
                                            } 
                                        />}
                                />
                            </Grid>
                            {/* <Grid item xs={12} sm={12} md={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    options={officeData}
                                    fullWidth
                                    id="officeSelect"
                                    name="officeSelect"
                                    required
                                    value={
                                        officeData.find(
                                        (option) =>
                                            option.id === formik.values.officeSelect?.id
                                        ) || null
                                    }
                                    onChange={(e, value) => {
                                        if (value === null) {
                                            formik.setFieldValue("officeSelect", null);
                                            formik.setFieldValue('hoa', null);
                                        } else {
                                            formik.setFieldValue("officeSelect", value);
                                            setCallOfficeData(true);
                                        }
                                    }}
                                    getOptionLabel={(value) => value.label}
                                    size='small'
                                    renderInput={(params) => 
                                        <TextField 
                                            {...params} 
                                            label="Office"
                                            required
                                            onBlur={formik.handleBlur}
                                            helperText={
                                                formik.errors.officeSelect &&
                                                formik.touched.officeSelect
                                                ? formik.errors.officeSelect
                                                : null
                                            }
                                            error={
                                                formik.errors.officeSelect &&
                                                formik.touched.officeSelect
                                                ? true
                                                : false
                                            } 
                                        />}
                                />
                            </Grid> */}
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    options={officeData}
                                    fullWidth
                                    disabled= {formik.values.department ? false : true}
                                    id="officeSelect"
                                    name="officeSelect"
                                    required
                                    value={officeData &&
                                        officeData?.find(
                                        (option) =>
                                            option.id === formik.values.officeSelect?.id
                                        ) || null
                                    }
                                    onChange={(e, value) => {
                                        if (value === null) {
                                        formik.setFieldValue("officeSelect", null);
                                        } else {
                                        formik.setFieldValue("officeSelect", value);
                                        }
                                    }}
                                    getOptionLabel={(value) => value.label}
                                    size='small'
                                    renderInput={(params) => 
                                        <TextField 
                                            {...params} 
                                            label="Office"
                                            required
                                            onBlur={formik.handleBlur}
                                            helperText={
                                                formik.errors.officeSelect &&
                                                formik.touched.officeSelect
                                                ? formik.errors.officeSelect
                                                : null
                                            }
                                            error={
                                                formik.errors.officeSelect &&
                                                formik.touched.officeSelect
                                                ? true
                                                : false
                                            } 
                                        />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    options={financialYearData}
                                    fullWidth
                                    id="financialYear"
                                    name="financialYear"
                                    required
                                    value={
                                        financialYearData.find(
                                        (option) =>
                                            option.id === formik.values.financialYear?.id
                                        ) || null
                                    }
                                    onChange={(e, value) => {
                                        if (value === null) {
                                        formik.setFieldValue("financialYear", null);
                                        } else {
                                        formik.setFieldValue("financialYear", value);
                                        }
                                    }}
                                    getOptionLabel={(value) => value.label}
                                    size='small'
                                    renderInput={(params) => 
                                        <TextField 
                                            {...params} 
                                            label="Financial Year"
                                            required
                                            onBlur={formik.handleBlur}
                                            helperText={
                                                formik.errors.financialYear &&
                                                formik.touched.financialYear
                                                ? formik.errors.financialYear
                                                : null
                                            }
                                            error={
                                                formik.errors.financialYear &&
                                                formik.touched.financialYear
                                                ? true
                                                : false
                                            } 
                                    />}
                                />
                            </Grid>

                        </Grid>
                        <Grid container>
                            <Grid item style={{width:'100%',display:'flex',justifyContent:'flex-end', gap:4}}  paddingRight={{md:3, lg:3}} paddingTop={{md:2, lg:2}}>
                                <Button variant='outlined' style={{borderRadius:'4px', float:'right'}} onClick={() => handleReset(val = true)}>Reset</Button>
                                <Button variant='contained' style={{borderRadius:'4px', float:'right'}} disabled={formik.values.department === null || formik.values.officeSelect === null || formik.values.financialYear === null ? true : false} type='submit'>Search</Button>
                            </Grid>
                        </Grid>
                    </Box>
            </CardContent>    
        </Card>
        {!showPeriodList && (
            <Alert severity="warning">
                Please select the above fields and search to receive the data.
            </Alert>
        )}
        <>
            <Card>
                <CardContent>
                    <PageTitle name={name1}/>
                    <Grid container columnSpacing={2}>
                        {/* <Grid item xs={12} sm={12} md={3} lg={3.8}>
                            <TextField label="Office Name" size="small" defaultValue={"Finance Department"} disabled fullWidth/>
                        </Grid> */}
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <TextField label="Total Employee" size="small" name="totalEmployee" value={formik.values.totalEmployee} disabled fullWidth/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <TextField label="Salary Initiated" size="small" name='allocatedEmployee' value={formik.values.salaryInitiated} disabled fullWidth/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <TextField label="Salary Not Initiated Yet" size="small" name='unallocatedEmployee' value={formik.values.salaryNotInitiatedYet} disabled fullWidth/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <TextField label="Delay" size="small" name='unallocatedEmployee' value={formik.values.delay} disabled fullWidth/>
                        </Grid>
                    </Grid>
                    {showPeriodList && (
                    <>
                        <Grid container sx={{mt:2}}>
                            <SearchTable 
                                columns={columns}
                                // data={rowss}
                                data={tableData}
                                isCheckbox={false}
                                isHideDensity={false}
                                isHideExport={true}
                                isHideFilter={true}
                                isHideColumn={true}
                                isHidePaging={false}
                                name="villageName"
                                id="villageName"
                            />
                        </Grid>
                    </>
                    )}
                </CardContent>
            </Card>
        </>
        
    
        </>
    )
}

export default SalaryProcessReport
