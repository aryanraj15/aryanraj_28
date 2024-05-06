import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Grid, Box, Card, CardContent, IconButton, Stack, Link, Button } from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useNavigate } from 'react-router-dom';
import useTitle from '../../../hooks/useTitle';
import { H3 } from '../../../components/Typography';
import AlertConfirm from "react-alert-confirm";
import { useSnackbar } from "../../../components/Snackbar";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "react-alert-confirm/lib/style.css";

const TrackLeaveequestStatus = ({ rqstId }) => {
  const [trackData, setTrackData] = useState([]);
  console.log(rqstId);
 
  const title = 'Track Leave Request';
  useTitle(title);

  const navigate = useNavigate();
  useEffect(() => {
    statusTracker();
    console.log(rqstId);

  }, [rqstId]); // Added rqstId as a dependency for useEffect
  console.log(rqstId);

  const statusTracker = async () => {
    try {
      const body = {
        rqstId: rqstId // Use rqstId passed from props

      };
      console.log(rqstId);

      console.log("Status Tracker", body);
      const res = await axios.post(
        `http://141.148.194.18:8095/leavemanagement/track-status-table`,
        body,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        }

      );
      console.log("Status Tracker", res);
      if (res.data.statusCode == 200) {
        console.log("the result ", res.data.result);
        setTrackData(res.data.result);


      }
    } catch (error) {
      alert("No data found", error);
      console.log(error.message);
    }
  };


  return (
    <>
      <Card sx={{ my: 2 }} elevation={3}>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf" }}>
            <EventBusyIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
            <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Track Leave Request</H3>
          </div>
          <Box component={"div"} >

            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell><h7><b>S.NO</b></h7></TableCell>
                    <TableCell><h7><b>Action By</b></h7></TableCell>
                    <TableCell><h7><b>Action On</b></h7></TableCell>
                    <TableCell><h7><b>Remarks</b></h7></TableCell>
                    <TableCell><h7><b>Status Description</b></h7></TableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trackData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{row.updBy}</TableCell>
                      <TableCell>{row.updOn}</TableCell>
                      <TableCell>{row.remarks}</TableCell>
                      <TableCell>{row.statusDesc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>


          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default TrackLeaveequestStatus






import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Grid, Box, Card, CardContent, IconButton, Stack, Link, Button } from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the ArrowBackIcon
import { useNavigate } from 'react-router-dom';
import useTitle from '../../../hooks/useTitle';
import { H3 } from '../../../components/Typography';
import AlertConfirm from "react-alert-confirm";
import { useSnackbar } from "../../../components/Snackbar";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "react-alert-confirm/lib/style.css";

const TrackLeaveRequestStatus = ({ rqstId }) => {
  const [trackData, setTrackData] = useState([]);
  const navigate = useNavigate();

  const title = 'Track Leave Request';
  useTitle(title);

  useEffect(() => {
    statusTracker();
  }, [rqstId]);

  const statusTracker = async () => {
    try {
      const body = { rqstId };
      const res = await axios.post(
        `http://141.148.194.18:8095/leavemanagement/track-status-table`,
        body,
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      if (res.data.statusCode === 200) {
        setTrackData(res.data.result);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back using react-router
  };

  return (
    <>
      <Card sx={{ my: 2 }} elevation={3}>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf" }}>
            <IconButton onClick={handleBack}><ArrowBackIcon /></IconButton> {/* Back button */}
            <EventBusyIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
            <H3 sx={{ fontSize: "15px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Track Leave Request</H3>
          </div>
          <Box component={"div"} >
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell><h7><b>S.NO</b></h7></TableCell>
                    <TableCell><h7><b>Action By</b></h7></TableCell>
                    <TableCell><h7><b>Action On</b></h7></TableCell>
                    <TableCell><h7><b>Remarks</b></h7></TableCell>
                    <TableCell><h7><b>Status Description</b></h7></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trackData.map((row, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">{index + 1}</TableCell>
                      <TableCell>{row.updBy}</TableCell>
                      <TableCell>{row.updOn}</TableCell>
                      <TableCell>{row.remarks}</TableCell>
                      <TableCell>{row.statusDesc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default TrackLeaveRequestStatus;
