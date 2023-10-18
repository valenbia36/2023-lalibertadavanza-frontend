import React, { useState, useEffect } from "react";
import MyResponsiveLine from "./LineChart";
import MonthSelector from "../MonthSelector";
import { CircularProgress, Grid } from "@mui/material";
import getApiUrl from '../../helpers/apiConfig';

const apiUrl = getApiUrl();

const LineChartContainer = () => {
  const [data, setData] = useState();
  const [selectedMonth, setSelectedMonth] = useState("10");
  const [isLoading, setIsLoading] = useState(false);

  const getMeals = async (selectedMonth) => {
    setIsLoading(true);
    setData("");
    const response = await fetch(
      apiUrl + "api/meals/user/" +
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
    setData(data.resultWithAllDays);
    setIsLoading(false);
  };

  useEffect(() => {
    getMeals(selectedMonth);
  }, [selectedMonth]);

  return (
    <div
      style={{
        textAlign: "center",
        color: "black",
        maxWidth: 320,
      }}
    >
      <Grid sx={{ maxHeight: "520px", minWidth: "320px" }}>
        <h2>Calories By Month</h2>
        <MonthSelector
          setSelectedMonth={setSelectedMonth}
          selectedMonth={selectedMonth}
        />
        <div style={{ position: "relative", minHeight: 450, marginTop: "10%" }}>
          {isLoading ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
              }}
            >
              <CircularProgress size={100} />
            </div>
          ) : data && data.length > 0 ? (
            <MyResponsiveLine data={data} />
          ) : (
            <div>No calories to show</div>
          )}
        </div>
      </Grid>
    </div>
  );
};

export default LineChartContainer;
