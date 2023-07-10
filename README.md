# aryanraj_28
import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
// import {table,TableBody, TableCell, TableContainer, TableRow,Paper,Bu}
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { H3, H4 } from "../components/Typography";
import CardContent from "@mui/material/CardContent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import useTitle from "../hooks/useTitle";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs from 'dayjs';
// import 'dayjs/locale/en-gb'
import Stack from "@mui/material/Stack";
import { Routes, Route, useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import axios from "../../utils/axios";
// import useTitle from "../../hooks/useTitle";
// import SearchTable from "../../components/SearchTable";
import SearchTable from "../components/SearchTable";
import { Small } from "../components/Typography";


function TelephonicIntimations() {
  useTitle("STATE");

  const [states, setStates] = useState("");
  const [rowss, setRowss] = useState([]);
  const [index, setIndex] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleChange = (e) => {
    setStates(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    if (selectedRow !== null) {
      setRowss((prevValue) => {
        const updatedRows = [...prevValue];
        updatedRows[selectedRow].states = states;
        return updatedRows;
      });
    }
    else {
      setRowss((prevValue) => [
        ...prevValue,
        { index, states: states }
      ]);
      setIndex((prevValue) => prevValue + 1);
    }

    setStates("");
  };

  const handleCancel = () => {
    setSelectedRow(null);
    setStates("");
  };

  const handleEdit = (index) => {
    setSelectedRow(index - 1);
    setStates(rowss[index - 1].states);
  };
  const columns = [

    {
      field: "index",
      headerName: "S.No",
      width: 100,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "states",
      headerName: "States",
      width: 500,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      width: 300,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {


        return (
          <Stack direction="row" spacing={2}>

            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => handleEdit(params.row.index)}
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
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <H3 lineHeight={2.2}>Select State</H3>
          <Box component="form" onSubmit={handleSubmit}>
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
                  fullWidth
                  type="text"
                  id="states"
                  name="states"
                  label="State Name"
                  size="small"
                  value={states}
                  onChange={handleChange}

                />
              </Grid>
            </Grid>



            <Box
              spacing={2}
              sx={{ flexGrow: 1, spacing: 2, mt: 1, pb: 3, float: "right" }}
            >
              <Button
                sx={{
                  minWidth: 100, ml: 1
                }}
                variant="contained"
                type="submit"
              >
                SAVE
              </Button>
              <Button
                type="button"
                sx={{ minWidth: 100, ml: 1 }}
                onClick={handleCancel}
                variant="outlined"
              >
                CANCEL
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
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
