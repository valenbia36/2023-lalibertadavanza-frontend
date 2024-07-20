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
          inputProps: {
            maxLength: 6,
          },
        }}
        label={`Weight (gr/ml)`}
        variant="outlined"
        fullWidth
        value={food.weightConsumed}
        onChange={(e) => handleQuantityInputChange(e, index)}
      />
    </Grid>
  );
}
