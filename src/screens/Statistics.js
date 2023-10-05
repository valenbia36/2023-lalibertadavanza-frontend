import React, { useState, useEffect } from "react";
import Drawer from "../components/Drawer";
import MyResponsivePie from "../components/Charts/PieChart";
import { TextField, Grid, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import CategorySelect from "../components/CategorySelect";

const Statistics = () => {
  const [data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const handleCategoryChange = (selectedCategory) => {
    setSelectedCategory(selectedCategory);
  };
  const getMealsByUserIdAndDay = async () => {
    setData("")
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
      
      if(selectedCategory)
      {
        setData(groupedFoodsArray.filter(item => item.id === selectedCategory))
      }
      else{setData(groupedFoodsArray);}

    } else {
      setData([]);
    }
  };
  useEffect(() => {
    getMealsByUserIdAndDay();
  }, [date,selectedCategory]);
  return (
    <div>
      <Drawer user={localStorage.getItem("username")} />
      <div style={{ textAlign: "center", color: "black" }}>
      <h2>Foods by Day</h2>
        <TextField
          InputLabelProps={{ shrink: true }}
          label="Date"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
         <Grid
              container
              spacing={1}
              alignItems="center"
              sx={{ marginTop: "2%" }}
            >
            <Grid item xs={10}>
            <CategorySelect selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
            </Grid>
            <Grid item xs={2}>
                <IconButton
                aria-label="delete row"
                size="small"
                onClick={() => setSelectedCategory("")}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
        </Grid>
        <br/>
        {(data && data.length > 0) ? (
          <MyResponsivePie data={data}/>
        ) : (
          <div>No foods to show</div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
