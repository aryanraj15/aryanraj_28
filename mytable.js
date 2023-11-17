import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

const validationSchema = Yup.object().shape({
  qualification: Yup.string().required('Qualification is required'),
  institute: Yup.string().required('Institute is required'),
  board: Yup.string(),
  percentage: Yup.number().min(0, 'Percentage must be greater than or equal to 0').max(100, 'Percentage must be less than or equal to 100'),
  admissionDate: Yup.date().nullable(),
  completionDate: Yup.date().nullable(),
  document: Yup.string(),
});

const QualificationOptions = ['Option 1', 'Option 2', 'Option 3'];
const InstituteOptions = ['Institute 1', 'Institute 2', 'Institute 3'];

function MyTable() {
  const [rows, setRows] = useState([
    {
      qualification: '',
      institute: '',
      board: '',
      admissionDate: null,
      completionDate: null,
      document: '',
    },
  ]);

  const formik = useFormik({
    initialValues: {
      qualification: '',
      institute: '',
      board: '',
      percentage: '',
      admissionDate: null,
      completionDate: null,
      document: '',
    },
    validationSchema,
   
  });

  const addRow = () => {
    setRows([
      ...rows,
      {
        qualification: '',
        institute: '',
        board: '',
        percentage: '',
        admissionDate: null,
        completionDate: null,
        document: '',
      },
    ]);
  };

  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Qualification</TableCell>
                <TableCell>Institute</TableCell>
                <TableCell>Board</TableCell>
                <TableCell>Percentage</TableCell>
                <TableCell>Admission Date</TableCell>
                <TableCell>Completion Date</TableCell>
                <TableCell>Upload</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <FormControl>
                      <TextField
                        select
                        fullWidth
                        label="Qualification"
                        variant="outlined"
                        {...formik.getFieldProps(`rows[${index}].qualification`)}
                      >
                        {QualificationOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </TableCell>

                  <TableCell>
                    <FormControl>
                      <TextField
                        select
                        fullWidth
                        label="Institute"
                        variant="outlined"
                        {...formik.getFieldProps(`rows[${index}].institute`)}
                      >
                        {InstituteOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </TableCell>

                  <TableCell>
                    <TextField
                      fullWidth
                      label="Board"
                      variant="outlined"
                      {...formik.getFieldProps(`rows[${index}].board`)}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      fullWidth
                      label="Percentage"
                      variant="outlined"
                      {...formik.getFieldProps(`rows[${index}].percentage`)}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="date"
                      variant="outlined"
                      {...formik.getFieldProps(`rows[${index}].admissionDate`)}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="date"
                      variant="outlined"
                      {...formik.getFieldProps(`rows[${index}].completionDate`)}
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        {...formik.getFieldProps(`rows[${index}].document`)}
                      />
                    </Button>
                  </TableCell>

                  <TableCell>
                  <IconButton onClick={() => deleteRow(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" color="primary" onClick={addRow} sx={{margin:2}}>
                Add 
            </Button>
      </form>
    </div>
  );
}

export default MyTable;
