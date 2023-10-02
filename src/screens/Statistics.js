import React, { useState, useEffect } from "react";
import Drawer from "../components/Drawer";
import MyResponsivePie from "../components/Charts/PieChart";
import { Grid, Paper, TextField } from "@mui/material";
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
    data.data.forEach((item) => {
      item.foods.forEach((food) => {
        const { name, quantity, category } = food;
        // Verificar si ya existe un registro para este alimento
        if (groupedFoods[name]) {
          // Si existe, sumar el quantity al registro existente
          groupedFoods[name].value += quantity;
        } else {
          // Si no existe, crear un nuevo registro
          groupedFoods[name] = { id: category, value: quantity, label: name };
        }
      });
      const groupedFoodsArray = Object.values(groupedFoods);
      console.log(groupedFoodsArray);
      setData(groupedFoodsArray);
    });
  };
  useEffect(() => {
    getMealsByUserIdAndDay();
  }, [date]);
  return (
    <div>
      <Drawer user={localStorage.getItem("username")} />
      <div style={{ width: "500px", height: "500px" }}>
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
        {data && <MyResponsivePie data={data} />}
      </div>
    </div>
  );
};

export default Statistics;
