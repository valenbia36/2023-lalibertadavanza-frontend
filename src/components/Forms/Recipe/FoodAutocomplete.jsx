import React from "react";
import { Autocomplete } from "@mui/material";
import { TextField, Grid } from "@mui/material";
export default function FoodAutocomplete({
  index,
  foodOptions,
  food,
  handleFoodInputChange,
}) {
  return (
    <Grid item xs={6}>
      <Autocomplete
        id={`food-autocomplete-${index}`}
        options={foodOptions}
        value={foodOptions.find((option) => option.name === food.name) || null}
        onChange={(e, newValue) => handleFoodInputChange(newValue, index)}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label="Food" variant="outlined" fullWidth />
        )}
        noOptionsText="No foods available."
        ListboxProps={{
          style: {
            maxHeight: 110,
          },
        }}
      />
    </Grid>
  );
}
