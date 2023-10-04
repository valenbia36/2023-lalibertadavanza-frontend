import React, { useState, useEffect } from "react";
import {Select, MenuItem,InputLabel,FormControl,} from "@mui/material";

const CategorySelect = ({selectedCategory,onCategoryChange }) => {
    const [categoriesOptions, setCategoriesOptions] = useState([]);
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
    useEffect(() => {
      getCategories();
    }, [categoriesOptions]);
  return (
    <FormControl fullWidth>
      <InputLabel id="category-select-label">Category</InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        label="Category"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {Array.isArray(categoriesOptions) && categoriesOptions.length > 0 ? (
          categoriesOptions.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="">No hay categorías disponibles</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default CategorySelect;