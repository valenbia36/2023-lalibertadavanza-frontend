import React, { useState, useEffect } from "react";
import { TextField, Grid, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import MyResponsivePie from "./PieChart"
import CategorySelect from "../CategorySelect";

const getMealsByUserIdAndDay = async (date, selectedCategory,setData) => {
  setData("");
  const response = await fetch(
    "http://localhost:3001/api/meals/user/" +
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
        const { name, quantity, category } = food;
        if (groupedFoods[name]) {
          groupedFoods[name].value += quantity;
        } else {
          groupedFoods[name] = { id: category, value: quantity, label: name };
        }
      });
    });
    const groupedFoodsArray = Object.values(groupedFoods);

    if (selectedCategory) {
      setData(
        groupedFoodsArray.filter((item) => item.id === selectedCategory)
      );
    } else {
      setData(groupedFoodsArray);
    }
  } else {
    setData([]);
  }
};

const PieChartContainer = () => {
    const [data, setData] = useState();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
    
      useEffect(() => {
        getMealsByUserIdAndDay(date,selectedCategory,setData);
      }, [date, selectedCategory]);
    
    
      const handleCategoryChange = (selectedCategory) => {
        setSelectedCategory(selectedCategory);
      };
    return(
        <div
            style={{
            textAlign: "center",
            color: "black",
            }}
        >
        <h2>Foods by Day</h2>
        <TextField
        style={{ width: "50%", minWidth:200 }}
        InputLabelProps={{ shrink: true }}
        label="Date"
        variant="outlined"
        margin="normal"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        />
        <Grid >
            <CategorySelect
            customWidth={"50%"}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            />
        </Grid>
        <Grid >
            <IconButton
            aria-label="delete row"
            size="small"
            onClick={() => setSelectedCategory("")}
            >
            <DeleteIcon />
            </IconButton>
        </Grid>
        <br />
        {data && data.length > 0 ? (
        <MyResponsivePie data={data} />
        ) : (
        <div>No foods to show</div>
        )}
        </div>
    )
};

export default PieChartContainer;