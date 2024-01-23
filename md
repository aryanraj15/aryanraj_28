import React, { useState } from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Card, CardContent } from "@mui/material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import useTitle from '../../../hooks/useTitle';
import { useNavigate } from 'react-router-dom';
import { H3 } from '../../../components/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BoardRoomBooking = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    conferenceType: '',
    date: null,
    startTime: '',
    endTime: '',
    participants: '',
    purpose: '',
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const valuesMeeting = [
    { id: 1, label: "Board Room Booking" },
    { id: 2, label: "Conference Room Booking" },
  ];

  const navigate = useNavigate();

  const handleRedirect = () => {
    // Open the modal before navigating
    handleOpenModal();
  };

  const handleConfirmSubmit = () => {
    // You can handle form submission logic here
    // For now, let's just close the modal
    handleCloseModal();
    // Simulate a delay (you can customize this)
    setTimeout(() => {
      navigate('/viewboardroombookings');
    }, 2000);
  };

  const title = "Board Room Booking";
  useTitle(title);

  return (
    <>
      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "left", alignItems: 'center', marginBlock: 15, borderBottom: "0.5px solid #d1d1cf", marginTop: '30px' }}>
            <MeetingRoomIcon sx={{ fontSize: "25px", color: '#246cb5' }} />
            <H3 sx={{ fontSize: "17px", color: '#246cb5' }} marginLeft={0.5} my={0.5} display="flex" justifyContent="center" alignItems="flex-end">Book a Board Room</H3>
          </div>
          <Grid container spacing={2} direction="row" alignItems="center">
            {/* ... (other form fields) */}
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ width: '100%' }}>
            <Button variant="contained" sx={{ float: 'right', borderRadius: '4px' }} onClick={handleRedirect}>
              Submit
            </Button>
          </Grid>
        </CardContent>
      </Card>

      {/* Modal for Confirmation */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to submit the form?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Button variant="contained" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleConfirmSubmit}>
              Okay
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default BoardRoomBooking;
