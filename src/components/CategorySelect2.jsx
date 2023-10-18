import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
} from "@mui/material";

const CategorySelect = ({
  selectedCategory,
  onCategoryChange,
  customWidth,
}) => {
  const [categoriesOptions, setCategoriesOptions] = useState([]);

  useEffect(() => {
    if (categoriesOptions.length > 0 && !selectedCategory) {
      onCategoryChange(categoriesOptions[0].name);
    }
  }, [categoriesOptions, onCategoryChange, selectedCategory]);

  const getCategories = async () => {
    const response = await fetch("http://localhost:3001/api/category/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setCategoriesOptions(data.data);
  };

  return (
    <Autocomplete
      id="category-select"
      options={categoriesOptions}
      getOptionLabel={(option) => option.name}
      value={selectedCategory || ""}
      onChange={(event, newValue) => {
        onCategoryChange(newValue.name);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Category"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: <>{params.InputProps.endAdornment}</>,
          }}
        />
      )}
      noOptionsText="There are no categories available"
      ListboxProps={{
        style: {
          maxHeight: 110, // Adjust the value to your desired maximum height
        },
      }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
    />
  );
};

export default CategorySelect;
