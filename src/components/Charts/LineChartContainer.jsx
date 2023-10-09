import React, { useState, useEffect } from "react";
import MyResponsiveLine from "./LineChart"
import MonthSelector from '../MonthSelector'

const getMealsByUserIdAndMonth = async (selectedMonth,setData) => {
  setData("");
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
            maxWidth: 320
            }}
        >
        <h2>Calories By Month</h2>
        <MonthSelector setSelectedMonth={setSelectedMonth} selectedMonth={selectedMonth}/>
        {data && data.length > 0 ? (
          <MyResponsiveLine data={data}/>
        ) : (
         <div>No calories to show</div>
        )}
        </div>
    )
};

export default LineChartContainer;