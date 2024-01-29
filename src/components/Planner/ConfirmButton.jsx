import React from "react";
import { IconButton, Grid, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function ConfirmButton() {
  return (
    <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
      <Tooltip title="Meal eated">
        <IconButton color="primary">
          <CheckIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
}
