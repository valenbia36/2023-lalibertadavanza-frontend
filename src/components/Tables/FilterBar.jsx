import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box } from "@mui/material";

const FilterSearchComponent = ({ setSearchText, searchText }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleSearchBar = () => {
    setSearchVisible(!searchVisible);
  };
  const handleSearch = () => {
    setSearchText(searchValue);
  };
  
  return (
    <div>
      <IconButton onClick={toggleSearchBar}>
        <FilterAltIcon />
      </IconButton>
      {searchVisible && (
        <Box>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <IconButton onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Box>
      )}
    </div>
  );
};

export default FilterSearchComponent;
