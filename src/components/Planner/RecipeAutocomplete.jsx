import React, { useState, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";

const RecipeAutocomplete = ({
  selectedRecipe,
  handleRecipeChange,
  recipes,
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Check if recipes is not empty before setting options
    if (recipes && recipes.length > 0) {
      setOptions(recipes);
    }
  }, [recipes]);

  return (
    <Autocomplete
      style={{ width: "120%", maxWidth: 400, minWidth: 200 }}
      value={selectedRecipe}
      onChange={(event, newValue) => {
        handleRecipeChange(newValue);
      }}
      options={options}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField {...params} label="Choose a Recipe" variant="outlined" />
      )}
      ListboxProps={{
        style: {
          maxHeight: 110,
        },
      }}
    />
  );
};

export default RecipeAutocomplete;
