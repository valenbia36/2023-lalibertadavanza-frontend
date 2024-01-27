import React, { useState, useEffect } from "react";
import { Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RecipeAutocomplete from "./RecipeAutocomplete";
import getApiUrl from "../../helpers/apiConfig";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

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
  const [meals, setMeals] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState("FoodBankIcon");
  const [currentRecipes, setCurrentRecipes] = useState([]);
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
    // Actualiza currentRecipes según el ícono seleccionado
    setCurrentRecipes(
      selectedIcon === "FoodBankIcon" ? getMeals() : getRecipes()
    );
  }, [selectedIcon]);
  const toggleIcon = () => {
    setSelectedIcon((prevIcon) =>
      prevIcon === "FoodBankIcon" ? "ReceiptLongIcon" : "FoodBankIcon"
    );
  };

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
  const saveWeek = async () => {
    try {
      const response = await fetch(apiUrl + "/api/saveWeek", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          startDate: new Date(),
          selectedRecipes,
        }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result); // Maneja la respuesta como desees
    } catch (error) {
      console.error("Error saving week:", error);
    }
  };
  const getMeals = async () => {
    const response = await fetch(
      apiUrl + "/api/meals/user/" + localStorage.getItem("userId"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();

    const mealsWithShortenedDates = data.data.map((meal) => {
      return {
        ...meal,
        date: meal.date.substring(0, 10),
      };
    });

    setMeals(mealsWithShortenedDates);
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
                <Grid container alignItems="center" spacing={6}>
                  <Grid item>
                    <RecipeAutocomplete
                      selectedRecipe={(selectedRecipes[day] || {}).breakfast}
                      recipes={currentRecipes}
                      handleRecipeChange={(recipe) =>
                        handleRecipeChange(day, "breakfast", recipe)
                      }
                    />
                  </Grid>
                  <Grid item>
                    <IconButton onClick={toggleIcon}>
                      {selectedIcon === "FoodBankIcon" ? (
                        <FoodBankIcon />
                      ) : (
                        <ReceiptLongIcon />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
              <div>
                <Typography variant="subtitle1">Almuerzo:</Typography>
                <Grid container alignItems="center" spacing={6}>
                  <Grid item>
                    <RecipeAutocomplete
                      selectedRecipe={(selectedRecipes[day] || {}).lunch}
                      recipes={recipes}
                      handleRecipeChange={(recipe) =>
                        handleRecipeChange(day, "lunch", recipe)
                      }
                    />
                  </Grid>
                  <Grid item>
                    <IconButton>
                      <FoodBankIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
              <div>
                <Typography variant="subtitle1">Snack:</Typography>
                <Grid container alignItems="center" spacing={6}>
                  <Grid item>
                    <RecipeAutocomplete
                      selectedRecipe={(selectedRecipes[day] || {}).snack}
                      recipes={recipes}
                      handleRecipeChange={(recipe) =>
                        handleRecipeChange(day, "snack", recipe)
                      }
                    />
                  </Grid>
                  {console.log(selectedRecipes[day])}
                  <Grid item>
                    <IconButton>
                      <FoodBankIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
              <div>
                <Typography variant="subtitle1">Cena:</Typography>
                <Grid container alignItems="center" spacing={6}>
                  <Grid item>
                    <RecipeAutocomplete
                      selectedRecipe={(selectedRecipes[day] || {}).dinner}
                      recipes={recipes}
                      handleRecipeChange={(recipe) =>
                        handleRecipeChange(day, "dinner", recipe)
                      }
                    />
                  </Grid>
                  <Grid item>
                    <IconButton>
                      <FoodBankIcon />
                    </IconButton>
                  </Grid>
                </Grid>
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
        <IconButton
          type="submit"
          aria-label="search"
          onClick={() => saveWeek()}
        >
          <SaveAltIcon fontSize="large" />
        </IconButton>
      </div>
    </Container>
  );
};

export default Calendar;
