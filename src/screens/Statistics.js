import React, { useState, useEffect } from "react";
import Drawer from "../components/Drawer";
import MyResponsivePie from "../components/Charts/PieChart";
import { TextField } from "@mui/material";
import { format } from "date-fns";

const Statistics = () => {
  const [data, setData] = useState();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const getMealsByUserIdAndDay = async () => {
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
      console.log(groupedFoodsArray);
      setData(groupedFoodsArray);
    } else {
      // Manejar el caso en el que no hay alimentos disponibles para el día seleccionado
      setData([]); // Puedes establecer un array vacío o null, según tus necesidades
    }
  };
  useEffect(() => {
    getMealsByUserIdAndDay();
  }, [date]);
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
        {(data && data.length > 0) ? (
          <MyResponsivePie data={data} />
        ) : (
          <div>No foods to show</div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
