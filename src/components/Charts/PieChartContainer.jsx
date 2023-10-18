import React, { useState, useEffect } from "react";
import { TextField, Grid } from "@mui/material";
import { format } from "date-fns";
import MyResponsivePie from "./PieChart";
import CircularProgress from "@mui/material/CircularProgress";
import getApiUrl from '../../helpers/apiConfig';
import CategoryAutocomplete from "../CategoryAutocomplete";

const apiUrl = getApiUrl();

const getMealsByUserIdAndDay = async (
  date,
  selectedCategory,
  setData,
  setLoading
) => {
  setData("");
  setLoading(true);
  const response = await fetch(
    apiUrl + "/api/meals/user/" +
      localStorage.getItem("userId") +
      "/date/" +
      date,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
  const data = await response.json();
  const groupedFoods = {};
  if (data.data && data.data.length > 0) {
    data.data.forEach((item) => {
      item.foods.forEach((food) => {
        const { name, weightConsumed, category } = food;
        if (groupedFoods[name]) {
          groupedFoods[name].value += weightConsumed;
        } else {
          groupedFoods[name] = { id: category, value: weightConsumed, label: name };
        }
      });
    });
    const groupedFoodsArray = Object.values(groupedFoods);

    if (selectedCategory) {
      setData(groupedFoodsArray.filter((item) => item.id === selectedCategory));
      setLoading(false);
    } else {
      setData(groupedFoodsArray);
      setLoading(false);
    }
  } else {
    setData([]);
    setLoading(false);
  }
};

const PieChartContainer = () => {
  const [data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMealsByUserIdAndDay(date, selectedCategory, setData, setLoading);
  }, [date, selectedCategory]);

  const handleCategoryChange = (selectedCategory) => {
    setSelectedCategory(selectedCategory);
  };

  return (
    <div
      style={{
        textAlign: "center",
        color: "black",
        maxWidth: 320,
      }}
    >
      <Grid sx={{ maxHeight: "450px", minWidth: "320px" }}>
        <h2>Foods by Day</h2>
        <TextField
          style={{ width: "73%", minWidth: 200 }}
          InputLabelProps={{ shrink: true }}
          label="Date"
          variant="outlined"
          margin="normal"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Grid >
          <CategoryAutocomplete
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Grid>
        <div style={{ position: "relative", minHeight: 320, marginTop: "10%" }}>
          {loading ? (
            <CircularProgress />
          ) : data && data.length > 0 ? (
            <MyResponsivePie data={data} />
          ) : (
            <div style={{ fontSize: "18px", width: 320, marginTop: "10%" }}>
              No foods to show
            </div>
          )}
        </div>
      </Grid>
    </div>
  );
};

export default PieChartContainer;
