import { IconButton, Grid } from "@mui/material";
import React from "react";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

export default function AddButton({ index, handleInput }) {
  return (
    index === 0 && (
      <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
        <IconButton color="primary" onClick={handleInput}>
          <AddCircleRoundedIcon />
        </IconButton>
      </Grid>
    )
  );
}
