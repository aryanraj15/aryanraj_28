import React, { useState } from 'react';
import {
    Table,
    TableBody,
    Autocomplete,
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
    Grid,
} from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from '@mui/lab/DatePicker';

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

    const handleChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    return (
        <div>
           
            <TableContainer component={Paper}>
                <Table  >

                    <TableHead>
                        <TableRow>
                            <TableCell >Qualification</TableCell>
                            <TableCell  >Institute</TableCell>
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

                                        <Autocomplete
                                            type='small'
                                            margin="normal"
                                            fullWidth
                                            options={QualificationOptions}
                                            sx={{ width: "150px", mt: 2 }}
                                            renderInput={(params) => (
                                                <TextField required {...params} 
                                                label=" Qualification" />
                                            )}
                                        />

                                    </FormControl>
                                </TableCell>


                                <TableCell>
                                    <FormControl>
                                        <Autocomplete
                                            type='small'
                                            margin="normal"
                                            fullWidth
                                            options={InstituteOptions}
                                            sx={{ width: "150px", mt: 2 }}
                                            renderInput={(params) => (
                                                <TextField required {...params} label=" Institute" />
                                            )}
                                        />
                                    </FormControl>
                                </TableCell>


                                <TableCell>

                                    <TextField
                                        type='small'
                                        margin="normal"
                                        fullWidth
                                        label="Board"
                                        variant="outlined"
                                        style={{ width: "150px", padding: 0 }}

                                    />
                                </TableCell>
                                <TableCell>

                                    <TextField
                                        type='small'
                                        margin="normal"
                                        fullWidth
                                        label="Percentage(%)"
                                        variant="outlined"
                                        style={{ width: "150px", padding: 0 }}

                                    />
                                </TableCell>


                                <TableCell>
                                    <TextField
                                        type="date"
                                        variant="outlined"
                                        sx={{ mt: 1.5, padding: 0 }}

                                    />
                                </TableCell>


                                <TableCell>
                                    <TextField
                                        type="date"
                                        variant="outlined"
                                        sx={{ mt: 1.5, padding: 0 }}

                                    />
                                </TableCell>



                                <TableCell>
                                    <Button sx={{ mb: 2 }} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                        Upload

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
        </div>
    );
}

export default MyTable;
