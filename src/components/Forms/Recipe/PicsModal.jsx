import React, { useState } from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  Grid,
  IconButton,
  FormControl,
  FormControlLabel,
  Radio,
  FormGroup,
  RadioGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TitlebarBelowImageList from "./TitlebarBelowImageList";
export default function PicsModal({ open, setOpen, initialData }) {
  const closeModal = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 580,
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
        <TitlebarBelowImageList data={initialData} />
      </Box>
    </Modal>
  );
}
