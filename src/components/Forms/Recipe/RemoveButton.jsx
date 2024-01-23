import React from "react";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import { IconButton, Grid } from "@mui/material";
export default function RemoveButton({ index, handleRemove }) {
  return (
    index > 0 && (
      <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
        <IconButton color="primary" onClick={() => handleRemove(index)}>
          <RemoveCircleRoundedIcon />
        </IconButton>
      </Grid>
    )
  );
}
