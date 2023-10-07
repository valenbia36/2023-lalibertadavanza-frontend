import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import MyResponsiveLine from "./LineChart"

const getMealsByUserIdAndMonth = async (selectedMonth,setData) => {
  setData("");
  console.log(selectedMonth)
  const response = await fetch(
    "http://localhost:3001/api/meals/user/" +
      localStorage.getItem("userId") +
      "/month/" +
      selectedMonth,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
  const data = await response.json();
  setData(data.resultWithAllDays)
};

const LineChartContainer = () => {
    const [data, setData] = useState();
    const [selectedMonth, setSelectedMonth] = useState("10");
  
    
      useEffect(() => {
        getMealsByUserIdAndMonth(selectedMonth,setData);
      }, [selectedMonth]);
    
    return(
        <div
            style={{
            textAlign: "center",
            color: "black",
            }}
        >
        <h2>Calories By Day</h2>
        <TextField
        style={{ width: "50%", minWidth:200 }}
        InputLabelProps={{ shrink: true }}
        label="Month"
        variant="outlined"
        margin="normal"
        type="number"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <br />
        {data && data.length > 0 ? (
        <MyResponsiveLine data={data} />
        ) : (
        <div>No calories to show</div>
        )}
        </div>
    )
};

export default LineChartContainer;