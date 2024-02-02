import React from "react";
import { TextField, Grid } from "@mui/material";

export default function StepField({ index, mealData, handleStepChange }) {
  return (
    <Grid item xs={10}>
      <TextField
        id={`step-${index}`}
        label={`Step ${index + 1}`}
        variant="outlined"
        fullWidth
        multiline
        rows={2}
        value={mealData.steps[index].text}
        onChange={(e) =>
          handleStepChange(index, e.target.value, mealData.steps[index].images)
        }
      />
    </Grid>
  );
}
