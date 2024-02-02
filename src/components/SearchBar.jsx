import React from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { Box, Paper } from "@mui/material";

export default function SearchBar({ setSearchQuery }) {
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <TextField
        id="search-bar"
        className="text"
        onInput={handleInputChange}
        label="Enter a recipe name"
        variant="outlined"
        placeholder="Search..."
        size="small"
        sx={{ maxWidth: 450, left: "5%" }}
      />
      <IconButton type="button" aria-label="search" sx={{ left: "5%" }}>
        <SearchIcon />
      </IconButton>
      </div>
  );
}
