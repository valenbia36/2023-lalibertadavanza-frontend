import React, { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";

export default function AddMealButton({ initialData, handleAddMeal, disable }) {
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
        disabled={disable}
      >
        {initialData ? "Update Recipe" : "Add Recipe"}
      </Button>
    </Grid>
  );
}
