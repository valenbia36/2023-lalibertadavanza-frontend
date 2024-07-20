import React, { useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";

const BuyList = ({ shoppingListData, weeklyTotalPerFood }) => {
  const [purchaseAmount, setPurchaseAmount] = useState({});

  const calculateWeeklyTotalConsumed = (data) => {
    const weeklyTotalConsumed = {};

    // Iterate over each day
    Object.keys(data).forEach((day) => {
      // Iterate over each meal (breakfast, lunch, dinner)
      Object.keys(data[day] || {}).forEach((meal) => {
        // Iterate over each food item in the meal
        (data[day][meal] || []).forEach((food) => {
          const foodName = food.foodId.name;

          // Initialize weekly total weight consumed for the food if not present
          if (!weeklyTotalConsumed[foodName]) {
            weeklyTotalConsumed[foodName] = 0;
          }

          // Increment weekly total weight consumed for the food
          weeklyTotalConsumed[foodName] += food.weightConsumed;
        });
      });
    });

    return weeklyTotalConsumed;
  };
  const handlePurchaseChange = (event, foodName) => {
    const { value } = event.target;
    const updatedPurchaseAmount = {
      ...purchaseAmount,
      [foodName]: value,
    };
    setPurchaseAmount(updatedPurchaseAmount);
  };

  // Example usage:
  const weeklyTotalConsumed = calculateWeeklyTotalConsumed(shoppingListData);

  return (
    <div>
      {/* Mostrar la suma total de cada alimento para toda la semana */}
      <Typography variant="h6" gutterBottom>
        Weekly Total:
      </Typography>
      <List>
        {Object.keys(weeklyTotalConsumed).map((foodName, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${foodName}: ${weeklyTotalConsumed[foodName]} grams/ml`}
            />
            <TextField
              label="Purchased Amount"
              type="number"
              value={purchaseAmount[foodName] || ""}
              onChange={(event) => handlePurchaseChange(event, foodName)}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default BuyList;
