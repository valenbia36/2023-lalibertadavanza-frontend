import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
} from "@mui/material";
import getApiUrl from '../helpers/apiConfig';

const CategoryAutocomplete = ({selectedCategory,onCategoryChange,customWidth,}) => {
    const [categoriesOptions, setCategoriesOptions] = useState([]);

    const apiUrl = getApiUrl();

    useEffect(() => {
      getCategories();
    }, [categoriesOptions]);
  
    const getCategories = async () => {
      const response = await fetch(apiUrl + "/api/category/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      const categories = (data.data).map(item => item.name);
      setCategoriesOptions(categories);
    };

  return (
    <Autocomplete
      style={{ width: customWidth || "100%", maxWidth: 500, minWidth: 200 }}
      value={selectedCategory}
      onChange={(event, newValue) => {
        onCategoryChange(newValue);
      }}
      options={categoriesOptions}
      getOptionLabel={(option) => option}
      renderInput={(params) => <TextField {...params} label="Choose a Category" variant="outlined" />}
    />
  );
}

export default CategoryAutocomplete;
