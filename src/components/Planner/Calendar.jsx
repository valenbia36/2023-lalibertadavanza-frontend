import React, { useState, useEffect } from "react";
import { Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RecipeAutocomplete from "./RecipeAutocomplete";
import getApiUrl from "../../helpers/apiConfig";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CheckIcon from "@mui/icons-material/Check";
import ConfirmButton from "./ConfirmButton";
import { useSnackbar } from "notistack";

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
const initialPlanState = {
  Monday: { breakfast: null, lunch: null, snack: null, dinner: null },
  Tuesday: { breakfast: null, lunch: null, snack: null, dinner: null },
  Wednesday: { breakfast: null, lunch: null, snack: null, dinner: null },
  Thursday: { breakfast: null, lunch: null, snack: null, dinner: null },
  Friday: { breakfast: null, lunch: null, snack: null, dinner: null },
  Saturday: { breakfast: null, lunch: null, snack: null, dinner: null },
  Sunday: { breakfast: null, lunch: null, snack: null, dinner: null },
};

const Calendar = ({ initialData, recipes }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setSelectedRecipes({ ...initialData });
      //console.log(initialData);
    } else {
      setSelectedRecipes({ ...initialPlanState });
      //console.log(initialData);
    }
  }, []);

  const handleRecipeChange = (day, meal, recipe) => {
    /* setSelectedRecipes((prevSelectedRecipes) => ({
      ...prevSelectedRecipes,
      [day]: {
        ...prevSelectedRecipes[day],
        [meal]: recipe,
      },
    })); */

    setSelectedRecipes({
      ...selectedRecipes,
      [day]: { ...selectedRecipes[day], [meal]: recipe },
    });
  };

  const handleAddToCalendar = () => {
    fetch(apiUrl + "/api/weeks/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        ...selectedRecipes,
        userId: localStorage.getItem("userId"),
      }),
    })
      .then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("The plan was created successfully.", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("An error occurred while creating the plan.", {
            variant: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
      });
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
        <IconButton
          type="submit"
          aria-label="search"
          onClick={handleAddToCalendar}
        >
          <SaveAltIcon fontSize="large" />
        </IconButton>
      </div>
    </Container>
  );
};

export default Calendar;
