import React from "react";
import { TextField, Grid } from "@mui/material";

export default function NameField({ mealData, setMealData }) {
  return (
    <Grid item xs={12}>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={mealData.name}
        onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
      />
    </Grid>
  );
}
