# aryanraj_28
my first github project 
import * as React from "react";
import { DataGrid, GridToolbar, GridRowIdGetter } from "@mui/x-data-grid";
import { Typography, Box, Link, Card, CardContent } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
export default function DataTable({
  columns,
  data,
  isCheckbox,
  isHideDensity,
  isHideExport,
  isHideFilter,
  isHideColumn,
  isHidePaging,
}) {
  const flag = isCheckbox;
  const flagDen = isHideDensity;
  const flagExp = isHideExport;
  const flagFilter = isHideFilter;
  const flagColumn = isHideColumn;
  console.log(isCheckbox);
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        {flagColumn ? <GridToolbarColumnsButton /> : null}
        {flagFilter ? <GridToolbarFilterButton /> : null}
        {flagDen ? <GridToolbarDensitySelector /> : null}
        {flagExp ? <GridToolbarExport /> : null}
      </GridToolbarContainer>
    );
  }

  let newData = [];
  data.map((item, index) => {
    newData.push({ SrNo: index + 1, ...item });
  });

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ overflow: "auto" }}>
          <Box
            sx={{
              width: "100%",
              height: "auto",
              display: "table",
              tableLayout: "fixed",
              height: "500%",
            }}
          >
            <DataGrid
              rows={newData}
              columns={columns}
              getRowId={(rows) => rows.SrNo}
              hideFooter={isHidePaging}
              initialState={
                isHidePaging
                  ? null
                  : {
                      pagination: { paginationModel: { pageSize: 5 } },
                    }
              }
              slots={{ toolbar: CustomToolbar }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection={flag}
              sx={{
                width: "100%",
                "& .super-app-theme--header": {
                  fontFamily: "Franklin Gothic Medium",
                  fontSize: "15px",
                  backgroundColor: "#2169b3",
                  color: "white",
                },
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
