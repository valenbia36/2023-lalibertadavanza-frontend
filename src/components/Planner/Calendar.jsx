import React, { useState, useEffect } from "react";
import { Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RecipeAutocomplete from "./RecipeAutocomplete";
import getApiUrl from "../../helpers/apiConfig";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

const apiUrl = getApiUrl();

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Calendar = ({}) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState({
    Monday: { breakfast: null, lunch: null, snack: null, dinner: null },
    Tuesday: { breakfast: null, lunch: null, snack: null, dinner: null },
    Wednesday: { breakfast: null, lunch: null, snack: null, dinner: null },
    Thursday: { breakfast: null, lunch: null, snack: null, dinner: null },
    Friday: { breakfast: null, lunch: null, snack: null, dinner: null },
    Saturday: { breakfast: null, lunch: null, snack: null, dinner: null },
    Sunday: { breakfast: null, lunch: null, snack: null, dinner: null },
  });

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = async () => {
    const response = await fetch(apiUrl + "/api/recipes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setRecipes(data.data);
  };

  const handleRecipeChange = (day, meal, recipe) => {
    setSelectedRecipes((prevSelectedRecipes) => ({
      ...prevSelectedRecipes,
      [day]: {
        ...(prevSelectedRecipes[day] || {}),
        [meal]: recipe,
      },
    }));
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Grid container spacing={2}>
        {daysOfWeek.map((day) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={day}>
            <Paper elevation={3} style={{ padding: "10px" }}>
              <Typography variant="h6" align="center" gutterBottom>
                {day}
              </Typography>
              <div>
                <Typography variant="subtitle1">Desayuno:</Typography>
                <RecipeAutocomplete
                  selectedRecipe={(selectedRecipes[day] || {}).breakfast}
                  recipes={recipes}
                  handleRecipeChange={(recipe) =>
                    handleRecipeChange(day, "breakfast", recipe)
                  }
                />
              </div>
              <div>
                <Typography variant="subtitle1">Almuerzo:</Typography>
                <RecipeAutocomplete
                  selectedRecipe={(selectedRecipes[day] || {}).lunch}
                  recipes={recipes}
                  handleRecipeChange={(recipe) =>
                    handleRecipeChange(day, "lunch", recipe)
                  }
                />
              </div>
              <div>
                <Typography variant="subtitle1">Snack:</Typography>
                <RecipeAutocomplete
                  selectedRecipe={(selectedRecipes[day] || {}).snack}
                  recipes={recipes}
                  handleRecipeChange={(recipe) =>
                    handleRecipeChange(day, "snack", recipe)
                  }
                />
              </div>
              <div>
                <Typography variant="subtitle1">Cena:</Typography>
                <RecipeAutocomplete
                  selectedRecipe={(selectedRecipes[day] || {}).dinner}
                  recipes={recipes}
                  handleRecipeChange={(recipe) =>
                    handleRecipeChange(day, "dinner", recipe)
                  }
                />
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <div
        style={{
          position: "fixed",
          bottom: "15%",
          right: "20%",
          zIndex: "1000",
        }}
      >
        <IconButton type="submit" aria-label="search">
          <ShoppingCartCheckoutIcon fontSize="large" />
        </IconButton>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "15%",
          right: "15%",
          zIndex: "1000",
        }}
      >
        <IconButton type="submit" aria-label="search">
          <SaveAltIcon fontSize="large" />
        </IconButton>
      </div>
    </Container>
  );
};

export default Calendar;
