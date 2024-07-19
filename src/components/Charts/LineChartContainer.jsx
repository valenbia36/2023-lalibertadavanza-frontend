import React, { useState, useEffect } from "react";
import MyResponsiveLine from "./LineChart";
import { Button, CircularProgress, Grid } from "@mui/material";
import getApiUrl from "../../helpers/apiConfig";
import { addDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const css = `
  .my-selected:not([disabled]) { 
    font-weight: bold; 
    background-color: #f9efe9;
  }
  .my-selected:hover:not([disabled]) { 
    border-color: 1.5px solid black;
    color: black;
  }
  .my-today { 
    font-weight: bold;
    font-size: 140%; 
    color: red;
  }
`;

const apiUrl = getApiUrl();

const LineChartContainer = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [range, setRange] = useState({
    from: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0,
      0
    ),
    to: addDays(new Date().setHours(0, 0), 7),
  });

  const getMeals = async (selectedStartDate, selectedEndDate) => {
    const response = await fetch(
      apiUrl +
        "/api/meals/user/between/" +
        selectedStartDate +
        "/" +
        selectedEndDate,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (response.status === 401) {
      // Token ha expirado, desloguear al usuario
      localStorage.removeItem("token");

      window.location.href = "/";
    }
    const data = await response.json();
    setData(data.fechasIntermedias);
  };

  useEffect(() => {
    if (range) {
      if (range.from && range.to) {
        getMeals(range.from, range.to);
      }
    }
  }, [range]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        maxWidth: 300,
        margin: "auto",
      }}
    >
      <h2 style={{ fontWeight: "bold" }}>Calories By Date</h2>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        sx={{
          mt: 3,
          mb: 2,
          backgroundColor: "#373D20",
          "&:hover": { backgroundColor: "#373D20" },
          fontWeight: "bold",
        }}
      >
        Select Date
      </Button>

      <Grid
        sx={{ maxHeight: "520px", minWidth: "320px", position: "relative" }}
      >
        <style>{css}</style>
        <div
          style={{
            position: "relative",
            minHeight: 450,
            marginTop: "10%",
            zIndex: 1,
          }}
        >
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
          ) : isDatePickerOpen ? (
            <div
              style={{
                border: "1px solid #000",
                borderRadius: "10px",
                display: "inline-block",
              }}
            >
              <DayPicker
                mode="range"
                defaultMonth={range ? range.from : new Date()}
                selected={range}
                onSelect={setRange}
                max={31}
                modifiersClassNames={{
                  selected: "my-selected",
                  today: "my-today",
                }}
                styles={{
                  caption: { fontWeight: "bold", fontSize: "18px" },
                  day: { fontSize: "14px" },
                  selectedFirst: {
                    backgroundColor: "#f9efe9",
                    fontWeight: "bold",
                  },
                  selectedLast: {
                    backgroundColor: "#f9efe9",
                    fontWeight: "bold",
                  },
                  selected: { backgroundColor: "#f9efe9", fontWeight: "bold" },
                  today: { fontWeight: "bold", color: "red" },
                }}
              />
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
