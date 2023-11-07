import React, { useState } from 'react';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const QualificationOptions = ['Option 1', 'Option 2', 'Option 3'];
const InstituteOptions = ['Option A', 'Option B', 'Option C'];

const MyTable = () => {
  const [rows, setRows] = useState([{}]);

  const handleAddRow = () => {
    setRows([...rows, {}]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleAddRow}>
        ADD
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Qualification</TableCell>
              <TableCell>Institute</TableCell>
              <TableCell>Board</TableCell>
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
                    <InputLabel>Qualification</InputLabel>
                    <Select>
                      {QualificationOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl>
                    <InputLabel>Institute</InputLabel>
                    <Select>
                      {InstituteOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField label="Board" variant="outlined" />
                </TableCell>
                <TableCell>
                  <TextField type="date" variant="outlined" />
                </TableCell>
                <TableCell>
                  <TextField type="date" variant="outlined" />
                </TableCell>
                <TableCell>
                  <input type="file" />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteRow(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MyTable;
