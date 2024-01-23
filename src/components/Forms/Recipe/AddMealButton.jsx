import React from "react";
import { Button, Grid } from "@mui/material";

export default function AddMealButton({ initialData, handleAddMeal }) {
  return (
    <Grid item xs={12}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddMeal}
        sx={{
          mt: 3,
          mb: 2,
          backgroundColor: "#373D20",
          "&:hover": { backgroundColor: "#373D20" },
          fontWeight: "bold",
        }}
        fullWidth
      >
        {initialData ? "Update Meal" : "Add Meal"}
      </Button>
    </Grid>
  );
}
