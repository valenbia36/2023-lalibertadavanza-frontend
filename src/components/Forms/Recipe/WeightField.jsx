import React from "react";
import { TextField, Grid } from "@mui/material";

export default function WeightField({
  food,
  index,
  handleQuantityInputChange,
}) {
  return (
    <Grid item xs={4}>
      <TextField
        InputProps={{
          inputProps: { min: 1 },
        }}
        label={`Weight (gr/ml)`}
        type="number"
        variant="outlined"
        fullWidth
        value={food.weightConsumed}
        onChange={(e) => handleQuantityInputChange(e, index)}
      />
    </Grid>
  );
}
