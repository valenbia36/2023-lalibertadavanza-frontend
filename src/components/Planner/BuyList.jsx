import React from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

const BuyList = ({ shoppingListData, weeklyTotalPerFood }) => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const calculateTotalWeightConsumedPerDay = (data) => {
    const totalWeightConsumedPerDay = {};
    const weeklyTotalConsumed = {};
    /*  console.log(data); */

    // Iterate over each day
    Object.keys(data).forEach((day) => {
      totalWeightConsumedPerDay[day] = {};

      // Iterate over each meal (breakfast, lunch, dinner)
      Object.keys(data[day] || {}).forEach((meal) => {
        // Iterate over each food item in the meal
        (data[day][meal] || []).forEach((food) => {
          const foodName = food.foodId.name;

          // Initialize total weight consumed for the food if not present
          if (!totalWeightConsumedPerDay[day][foodName]) {
            totalWeightConsumedPerDay[day][foodName] = 0;
          }

          // Increment total weight consumed for the food on the specific day
          totalWeightConsumedPerDay[day][foodName] += food.weightConsumed;

          // Initialize weekly total weight consumed for the food if not present
          if (!weeklyTotalConsumed[foodName]) {
            weeklyTotalConsumed[foodName] = 0;
          }

          // Increment weekly total weight consumed for the food
          weeklyTotalConsumed[foodName] += food.weightConsumed;
        });
      });
    });

    return { totalWeightConsumedPerDay, weeklyTotalConsumed };
  };

  // Example usage:
  const { totalWeightConsumedPerDay, weeklyTotalConsumed } =
    calculateTotalWeightConsumedPerDay(shoppingListData);
  /* console.log(totalWeightConsumedPerDay); */
  return (
    <div>
      {/* Mostrar la suma total de cada alimento por día */}
      <Typography variant="h6" gutterBottom>
        Shopping List:
      </Typography>

      {daysOfWeek.map((day, index) => (
        <div key={index}>
          <Typography variant="subtitle1" gutterBottom>
            {`${day}:`}
          </Typography>
          <List>
            {Object.keys(totalWeightConsumedPerDay[day] || {}).map(
              (foodName, foodIndex) => (
                <ListItem key={foodIndex}>
                  <ListItemText
                    primary={`${foodName}: ${totalWeightConsumedPerDay[day][foodName]} grams/ml`}
                  />
                </ListItem>
              )
            )}
          </List>
        </div>
      ))}

      {/* Mostrar la suma total de cada alimento para toda la semana */}
      <Typography variant="h6" gutterBottom>
        Weekly Total:
      </Typography>
      <ul>
        {Object.keys(weeklyTotalConsumed).map((foodName, index) => (
          <li key={index}>
            <Typography>{`${foodName}: ${weeklyTotalConsumed[foodName]} grams/ml`}</Typography>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyList;
