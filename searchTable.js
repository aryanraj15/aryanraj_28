import * as React from "react";
import { DataGrid, GridToolbar, GridRowIdGetter } from "@mui/x-data-grid";
import { Typography, Box, Link, Card, CardContent, Button } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
export default function DataTable({ columns, data, isCheckbox, isHideDensity, isHideExport, isHideFilter, isHideColumn, isHidePaging, name }) {
  const flag = isCheckbox;
  const flagDen = isHideDensity;
  const flagExp = isHideExport;
  const flagFilter = isHideFilter;
  const flagColumn = isHideColumn;
  // console.log(isCheckbox);
  // console.log(flagColumn);
  function CustomToolbar() {
    return (

      <GridToolbarContainer>
        {flagColumn ? (
          <GridToolbarColumnsButton />
        ) : (null)}
        {flagFilter ? (
          <GridToolbarFilterButton />
        ) : (null)}
        {flagDen ? (
          <GridToolbarDensitySelector />
        ) : (null)}
        {flagExp ? (
          <GridToolbarExport />
        ) : (null)}
      </GridToolbarContainer>
    );
  }

  let newData = [];
  if (name === "roleMasterTab") {
    data.map((item, index) => {

      newData.push({ id: index + 1, Name: item.name, RoleCode: item.roleCode, RoleDescription: item.roledesc, RoleCreationDate: item.createdOn,RoleCreationDate: item.updatedOn, RoleId: item.roleId });
    });
  }
  else if (name === "users") {
    data.map((item, index) => {
      newData.push({ id: index + 1, loginid: item.userId, username: item.userName, designation: item.desigName, organization: item.deptName, departmentName: item.deptName,userId : item.id });
    });

  }
  else if (name === "department") {
    data.map((item, index) => {

      newData.push({ id: index + 1, Name: item.name, DepartmentCode: item.code, DepartmentinTelugu: item.deptNameTelugu, ParentDepartment: item.createdOn,ParentDepartment: item.updatedOn, DeptId: item.deptId });
    });
  }
    else if (name === "designationMasterTab") {
      data.map((item, index) => {
      newData.push({ id: index + 1, Name: item.name, DesignationCode: item.code, DesignationinTelugu: item.nameTelugu, DesignationCreationDate: item.createdOn,DesignationCreationDate: item.updatedOn, DesignationId: item.id });
      });
    }

    else if (name === "bankMasterTab") {
      data.map((item, index) => {
      newData.push({ id: index + 1, Bankname: item.bankName, BankinTelugu: item.bankTeluguName, BankCreationDate: item.bankCreationDate, BankId: item.bankId });
      });
    }

    else if(name==="userMap"){
      data.map((item, index) => {
        newData.push({ id: index + 1, username: item.userName, userId: item.id , mobileNo : item.mobileNo, loginid : item.userId, emailId : item.emailID});
        });
         
    }
    else if(name==="userMap2"){
      data.map((item, index) => {
        newData.push({ id: index + 1, role: item.role.name, createdon: item.createdOn , roleId : item.roleId, });
        });

    }
    else if(name==="roleMenuRightMap"){
      data.map((item, index) => {
        newData.push({ id: index + 1, menu: item.name, pmenu: item.parentName , menuId : item.menuId, parentId: item.parentId });
        });

    }
    
    else if(name === "branchMasterTab")
    {
      data.map((item, index) => {
        newData.push({ id : index + 1, BankName: item.bankName, BranchName:item.branchName,BranchTelugu : item.branchTeluguName,ifscCode: item.ifscCode, CreationDate : item.creationDate , BranchId : item.branchId, BankId: item.bankId});
        });
      }
  

  return (

    <Box sx={{ overflow: "auto" }}>
      <Box sx={{ width: "100%", height: 400, display: "table", tableLayout: "fixed" }}>

        <DataGrid
          rows={newData}
          columns={columns}
          getRowId={(rows) => rows.id}
          hideFooter={isHidePaging}
          initialState={isHidePaging ? null : {
            pagination: { paginationModel: { pageSize: 5 } },

          }}

          slots={{ toolbar: CustomToolbar }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection={flag}
          sx={{
            width: '100%',
            '& .super-app-theme--header': {
              fontFamily: "Franklin Gothic Medium", fontSize: "15px",
              backgroundColor: '#F5FAFF'

            },
          }}
        />


      </Box>
    </Box>

  );
}
