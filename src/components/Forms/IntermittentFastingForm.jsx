import React from "react";
import { Modal, Box, Grid, Button } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

const IntermittentFastingForm = ({ openIntermittentFastingModal, closeModal }) => {

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
          alignItems: "center", // Centra horizontalmente
          justifyContent: "center", // Centra verticalmente
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
        <span style={{marginBottom: '3%'}}>Configure your Intermittent Fasting: </span>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker defaultValue={new Date()} />
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
          >
            Start Intermittent Fasting
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default IntermittentFastingForm;
