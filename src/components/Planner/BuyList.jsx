import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const BuyList = ({ shoppingListData, weeklyTotalPerFood }) => {
  return (
    <div>
      {/* Mostrar la suma total de cada alimento */}
      <Typography variant="h6" gutterBottom>
        Weekly Total Per Food:
      </Typography>
      <ul>
        {Object.keys(weeklyTotalPerFood).map((foodName, index) => (
          <li key={index}>
            <Typography>{`${foodName}: ${weeklyTotalPerFood[foodName]} grams/ml`}</Typography>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default BuyList;
