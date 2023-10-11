import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function ComboBox({ data, setSearchText }) {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={data.map((item) => item.name)}
      sx={{ width: 200 }}
      onChange={setSearchText(newValue)}
      renderInput={(params) => <TextField {...params} label="Category" />}
    />
  );
}
