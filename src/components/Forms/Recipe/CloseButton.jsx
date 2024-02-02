import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

export default function CloseButton({ closeModal }) {
  return (
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
  );
}
