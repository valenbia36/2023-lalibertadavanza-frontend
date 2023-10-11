import React from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const MonthSelector = ({selectedMonth, setSelectedMonth}) => {

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <FormControl variant="outlined" style={{ width: "50%", minWidth: 200, zIndex: 2 }}>
      <InputLabel>Month</InputLabel>
      <Select
        label="Month"
        value={selectedMonth}
        onChange={handleMonthChange}
        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
      >
        <MenuItem value={1}>January</MenuItem>
        <MenuItem value={2}>February</MenuItem>
        <MenuItem value={3}>March</MenuItem>
        <MenuItem value={4}>April</MenuItem>
        <MenuItem value={5}>May</MenuItem>
        <MenuItem value={6}>June</MenuItem>
        <MenuItem value={7}>July</MenuItem>
        <MenuItem value={8}>August</MenuItem>
        <MenuItem value={9}>September</MenuItem>
        <MenuItem value={10}>October</MenuItem>
        <MenuItem value={11}>November</MenuItem>
        <MenuItem value={12}>December</MenuItem>
      </Select>
    </FormControl>
  );
};

export default MonthSelector;
