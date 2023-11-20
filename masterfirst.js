import React, { useState, useCallback } from "react";
import SearchTable from "../../src/Components/SearchTable";
import useTitle from "../Components/useTitle";
import { H3 } from "../Components/Typography";
import { useTheme, Card, CardContent, Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Grid";
import { Routes, Route, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Navbar from "../Components/Navbar";
import Box from "@mui/material/Box";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';

import EditIcon from '@mui/icons-material/Edit';
function TelephonicIntimations() {
    const name = "Attachment Master"
  useTitle("STATE");

  const [rowss, setRowss] = useState([]);
  const [index, setIndex] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  const theme = useTheme();

  // define the validation schema for the form
  const validationSchema = Yup.object({
    document: Yup.string()
      .required("Document name is required")
      .matches(/^[A-Za-z\s]+$/, "Document name must contain only letters and spaces"),
  });

  // use the useFormik hook to handle the form state and validation
  // add the validateOnChange prop and set it to false
  const formik = useFormik({
    initialValues: {
      document: "",
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      // handle submit logic here
      setSelectedRow(null);
      if (selectedRow !== null) {
        setRowss((prevValue) => {
          const updatedRows = [...prevValue];
          updatedRows[selectedRow].document = values.document;
          return updatedRows;
        });
      } else {
        setRowss((prevValue) => [
          ...prevValue,
          { index, document: values.document },
        ]);
        setIndex((prevValue) => prevValue + 1);
      }

      formik.resetForm();
    },
  });

  // use the useCallback hook to memoize the event handlers
  const handleCancel = useCallback(() => {
    setSelectedRow(null);
    formik.resetForm();
  }, []);

  const handleEdit = useCallback(
    (index) => () => {
      // handle edit logic here
      setSelectedRow(index - 1);
      formik.setFieldValue("document", rowss[index - 1].document);
    },
    [rowss]
  );

  // define the columns for the table
  const columns = [
    {
      field: "index",
      headerName: "S.No",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "document",
      headerName: "DOCUMENT TYPE",
      width: 500,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "action",
      headerName: "ACTION",
      headerClassName: "super-app-theme--header",
      width: 450,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleEdit(params.row.index)}
              sx={{color:'black',backgroundColor:'white',
              ":hover":{color:'black',backgroundColor:'white'},borderRadius:'4px'}} endIcon={<EditIcon />}
            >
              EDIT
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <>
    <Navbar name={name} ></Navbar>
      <Card sx={{ mt: 2, backgroundColor: theme.palette.primary[100] }}>
        <CardContent>
          <H3 lineHeight={2.2} sx={{ ml: 62 }}>
            SELECT DOCUMENT TYPE
          </H3>
          <form onSubmit={formik.handleSubmit}>
            {/* use the sx prop to style the components */}
            <Stack direction="row" spacing={2} sx={{ ml: theme.spacing(6) }}>
              {/* use the TextField component from formik-material-ui */}
             <Grid
               container
               direction="column"
               columnSpacing={2}
                justify="flex-end"
                alignItems="center"
                >
                 <Grid sx={{ mt: 2, width: 400 }}   >
              <TextField
                margin="normal"
                fullWidth
                type="text"
                id="document"
                name="document"
                label= "DOCUMENT TYPE" 
                value={formik.values.document}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.document && Boolean(formik.errors.document)}
                helperText={formik.touched.document && formik.errors.document}
              />

              </Grid>
              </Grid>
            </Stack>

            

            <Grid
            container
            direction="row"
            rowSpacing={0}
            columnSpacing={2}
            sx={{ml:8}}
            justify="flex-end"
            alignItems="center"
            justifyContent="center"
            color="white"
          >
            <Grid item xs={12} sm={3} md={3} lg={4}>
            <FormControl component="fieldset">
         {/* <FormLabel component="legend">Select</FormLabel> */}
         <FormGroup aria-label="position" row>
        
        <FormControlLabel
          value="end"
          sx={{color:"black"}}
          control={<Checkbox />}
          label="Is Mandatory"
          labelPlacement="end"
        />
         <FormControlLabel
          value="end"
          sx={{color:"black"}}
          control={<Checkbox />}
          label="Active"
          labelPlacement="end"
        />
      </FormGroup>
    </FormControl>

              </Grid>
          </Grid>
         
            <Box
                spacing={2}
                sx={{ flexGrow: 1, spacing: 2, mt: 2, float: "center", ml: 60 }}
                >
              <Button variant="contained" 
              type="submit" 
              size="large">
                SAVE <AttachFileIcon></AttachFileIcon>
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outlined"
                sx={{ minWidth: 100, ml: 1 }}
                size="large"
              >
                CANCEL
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <SearchTable
            columns={columns}
            data={rowss}
            isCheckbox={false}
            isHideDensity={false}
            isHideExport={true}
            isHideFilter={true}
            isHideColumn={true}
            isHidePaging={false}
            name="state"
            id="state"
          ></SearchTable>
        </CardContent>
      </Card>
    </>
  );
}
export default TelephonicIntimations;
