import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function ComboBox({ data, setSearchText, searchText }) {
  const handleOptionChange = (event, newValue) => {
    setSearchText(newValue);
  };
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={data.map((item) => item.name)}
      sx={{ width: 200 }}
      onChange={handleOptionChange}
      renderInput={(params) => <TextField {...params} label="Category" />}
    />
  );
}
