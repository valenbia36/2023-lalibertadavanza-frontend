import React, { useState, useEffect } from "react";
import MyResponsiveLine from "./LineChart";
import { Button, CircularProgress, Grid } from "@mui/material";
import getApiUrl from '../../helpers/apiConfig';
import { addDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

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
  const [selectedMonth, setSelectedMonth] = useState("10");
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const getMeals = async (selectedMonth) => {
    setIsLoading(true);
    setData("");
    const response = await fetch(
      apiUrl + "/api/meals/user/" +
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

  const defaultSelected = {
    from: new Date(),
    to: addDays(new Date(), 4)
  };
  const [range, setRange] = useState(defaultSelected);

  return (
    <div
      style={{
        textAlign: "center",
        color: "black",
        maxWidth: 320,
      }}
    >

      <Grid sx={{ maxHeight: "520px", minWidth: "320px" }}>
        <h2 style={{fontWeight: 'bold'}}>Calories By Date</h2>
        <style>{css}</style>
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
              fullWidth
            >
              Select Date
            </Button>
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

        {isDatePickerOpen && (<DayPicker
          id="test"
          mode="range"
          defaultMonth={new Date()}
          selected={range}
          onSelect={setRange}
          style={{ fontSize: '14px'}}
          modifiersClassNames={{
            selected: 'my-selected',
            today: 'my-today'
          }}
          styles={{caption: { fontWeight: 'black' }}}
        />)}
      </Grid>
    </div>
  );
};

export default LineChartContainer;
