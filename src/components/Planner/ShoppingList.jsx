import React, { useEffect, useState } from "react";
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
import BuyList from "./BuyList";
export function ShoppingList({
  open,
  setOpen,
  shoppingListData,
  weeklyTotalPerFood,
}) {
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
          maxHeight: "80vh !important",
          overflowY: "auto !important",
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

        {/* Componente para mostrar las foods */}
        <BuyList
          shoppingListData={shoppingListData}
          weeklyTotalPerFood={weeklyTotalPerFood}
        />
      </Box>
    </Modal>
  );
}
