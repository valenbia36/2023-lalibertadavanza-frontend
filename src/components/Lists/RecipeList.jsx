import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import FoodForm from "../Forms/FoodForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import RecipeTable from "../Tables/RecipeTable";
import RecipeForm from "../Forms/Recipe/RecipeForm";
const RecipeList = () => {
  const [isModalRecipeOpen, setIsModalRecipeOpen] = useState(false);
  const [isModalFoodOpen, setIsModalFoodOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const handleOpenForm = () => {
    setIsModalRecipeOpen(true);
  };

  return (
    <div style={{ textAlign: "center", color: "black" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="0%"
      >
        RECIPES TABLE
      </Typography>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          maxWidth: "100%",
        }}
      >
        <RecipeTable
          filterOpen={filterOpen}
          modalOpen={isModalRecipeOpen}
          setModalOpen={setIsModalRecipeOpen}
        />
      </div>
    </div>
  );
};

export default RecipeList;
