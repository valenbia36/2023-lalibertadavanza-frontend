import React, { useState } from "react";
import { Modal, Box, Grid, Button, IconButton } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";

const apiUrl = getApiUrl();

const IntermittentFastingForm = ({ openIntermittentFastingModal, closeModal }) => {

  const [startDateTime, setStartDateTime] = useState(new Date(new Date().getTime() + 30 * 60000));
  const [endDateTime, setEndDateTime] = useState(new Date(new Date().getTime() + 60 * 60000));

  const handleStartIntermittentFasting = () => {
    fetch(apiUrl + '/api/intermittentFasting', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        startDateTime: startDateTime,
        endDateTime: endDateTime
      }),
    }).then(function (response) {
      if (response.status === 200) {
        console.log('funciono')
      }
    })
  }

  return (
    <Modal
      open={openIntermittentFastingModal}
      onClose={closeModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 5,
          borderRadius: "2%",
        }}
      >
        <IconButton
          aria-label="Close"
          onClick={closeModal}
          sx={{
            position: "absolute",
            top: "3%",
            right: "10px",
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
        <span style={{ marginBottom: '5%' }}>Configure your Intermittent Fasting: </span>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div style={{ marginBottom: '15px' }}>
            <DateTimePicker value={startDateTime} label="Start Date Time" disablePast onChange={(newDate) =>
              setStartDateTime(newDate)
            } />
          </div>
          <div>
            <DateTimePicker value={endDateTime} label="End Date Time" disabled={!startDateTime}
              minDate={startDateTime} onChange={(newDate) =>
                setEndDateTime(newDate)
              } />
          </div>
        </LocalizationProvider>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
            }}
            fullWidth
            onClick={handleStartIntermittentFasting}
          >
            Start Intermittent Fasting
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default IntermittentFastingForm;
