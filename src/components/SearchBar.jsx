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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        maxWidth: 600,
        margin: "auto",
        borderRadius: 1,
        boxShadow: 1,
        backgroundColor: "background.paper",
      }}
    >
      <TextField
        id="search-bar"
        onChange={handleInputChange}
        label="Search Recipes"
        variant="outlined"
        placeholder="Enter a recipe name..."
        size="small"
        fullWidth
        sx={{
          borderRadius: 1,
          backgroundColor: "white",
          "& .MuiInputBase-root": {
            borderRadius: 1,
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 1,
          },
        }}
      />
      <IconButton
        type="button"
        aria-label="search"
        sx={{
          marginLeft: -1,
          borderRadius: 0,
          bgcolor: "primary.main",
          "&:hover": {
            bgcolor: "primary.dark",
          },
        }}
      >
        <SearchIcon sx={{ color: "white" }} />
      </IconButton>
    </Box>
  );
}
