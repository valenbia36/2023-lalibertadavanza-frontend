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
  console.log(isModalFoodOpen);

  return (
    <div style={{ textAlign: "center", color: "black" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="2%"
      >
        RECIPES TABLE
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          maxWidth: "100%",
        }}
      >
        <RecipeTable filterOpen={filterOpen} />
      </div>
      <React.Fragment>
        <RecipeForm
          openRecipe={isModalRecipeOpen}
          setRecipeOpen={setIsModalRecipeOpen}
          setOpenFoodModal={setIsModalFoodOpen}
          foodModal={isModalFoodOpen}
        />
      </React.Fragment>
      {localStorage.getItem("viewAs") === "false" && (
        <IconButton
          onClick={() => {
            setIsModalRecipeOpen(true);
          }}
        >
          <AddCircleRoundedIcon />
        </IconButton>
      )}
      <IconButton
        onClick={() => {
          setFilterOpen(!filterOpen);
        }}
      >
        <FilterAltRoundedIcon />
      </IconButton>
    </div>
  );
};

export default RecipeList;
