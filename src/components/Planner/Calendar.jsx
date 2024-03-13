import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RecipeAutocomplete from "./RecipeAutocomplete";
import getApiUrl from "../../helpers/apiConfig";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CheckIcon from "@mui/icons-material/Check";
import ConfirmButton from "./ConfirmButton";
import { useSnackbar } from "notistack";
import { ShoppingList } from "./ShoppingList";

const apiUrl = getApiUrl();
const today = new Date();

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

const Calendar = ({ initialData, recipes, isMobile, setPlan }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [openList, setOpenList] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingListData, setShoppingListData] = useState({});
  const [weeklyTotalPerFood, setWeeklyTotalPerFood] = useState({});
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setSelectedRecipes({ ...initialData });
    } else {
      setSelectedRecipes({ ...initialPlanState });
    }
  }, []);

  const handleRecipeChange = (day, meal, recipe) => {
    setSelectedRecipes({
      ...selectedRecipes,
      [day]: { ...selectedRecipes[day], [meal]: recipe },
    });
  };
  const handleShoppingList = () => {
    const shoppingListData = {};
    const dailyTotalPerFood = {}; // New object to store daily total consumption for each food

    for (const day of daysOfWeek) {
      const breakfast = selectedRecipes[day]?.breakfast;
      const lunch = selectedRecipes[day]?.lunch;
      const snack = selectedRecipes[day]?.snack;
      const dinner = selectedRecipes[day]?.dinner;

      shoppingListData[day] = {};

      const calculateTotalPerFood = (meal) => {
        if (selectedRecipes[day][meal] && selectedRecipes[day][meal].foods) {
          const foods = selectedRecipes[day][meal].foods;
          foods.forEach((food) => {
            // Initialize daily total for each food if not present
            if (!dailyTotalPerFood[food.name]) {
              dailyTotalPerFood[food.name] = 0;
            }

            // Increment daily total for each food
            dailyTotalPerFood[food.name] += food.weightConsumed;

            // Add food to shopping list data
            if (!shoppingListData[day][meal]) {
              shoppingListData[day][meal] = [];
            }
            shoppingListData[day][meal].push(food);
          });
        }
      };

      calculateTotalPerFood("breakfast");
      calculateTotalPerFood("lunch");
      calculateTotalPerFood("snack");
      calculateTotalPerFood("dinner");
    }

    setOpenList(true);
    setShoppingListData(shoppingListData);
    setWeeklyTotalPerFood(dailyTotalPerFood); // Update the state with the daily total consumption per food
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
          setPlan({ ...initialData, lastUpdate: new Date() });
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
  const handleAddMeal = (meal, timeOfTheDay, hour) => {
    handleAddToCalendar();
    if (meal && meal != []) {
      const mealToAdd = {
        name: timeOfTheDay + meal.name,
        foods: meal.foods,
        date: new Date(),
        hour: hour,
        userId: localStorage.getItem("userId"),
      };
      mealToAdd.calories = meal.foods
        .map((food) => parseInt(food.totalCalories))
        .reduce((acc, calories) => acc + calories, 0);

      mealToAdd.carbs = meal.foods
        .map((food) => parseInt(food.totalCarbs))
        .reduce((acc, carbs) => acc + carbs, 0);

      mealToAdd.proteins = meal.foods
        .map((food) => parseInt(food.totalProteins))
        .reduce((acc, proteins) => acc + proteins, 0);

      mealToAdd.fats = meal.foods
        .map((food) => parseInt(food.totalFats))
        .reduce((acc, fats) => acc + fats, 0);

      fetch(apiUrl + "/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(mealToAdd),
      })
        .then(function (response) {
          if (response.status === 200) {
            enqueueSnackbar("The meal was created successfully.", {
              variant: "success",
            });
          } else {
            enqueueSnackbar("An error occurred while saving the meal.", {
              variant: "error",
            });
          }
        })
        .catch(function (error) {
          enqueueSnackbar("An error occurred while saving the meal.", {
            variant: "error",
          });
        });
    } else {
      enqueueSnackbar("An error occurred while saving the meal.", {
        variant: "error",
      });
    }
  };
  function getFecha(fecha) {
    var cadenaFecha = fecha;
    var fechaObjeto = new Date(cadenaFecha);
    var hora = fechaObjeto.getHours();
    var minutos = fechaObjeto.getMinutes();
    var dia = fechaObjeto.getDate();
    var mes = fechaObjeto.getMonth() + 1;
    var anio = fechaObjeto.getFullYear();
    minutos = minutos < 10 ? "0" + minutos : minutos;
    var resultado = hora + ":" + minutos + " " + dia + "/" + mes + "/" + anio;

    if (fecha) return resultado;
    else {
      return "---";
    }
  }

  return (
    <Container
      maxWidth="lg"
      style={{
        paddingBottom: isMobile ? "45px" : "0",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 0, // Ajusta este valor según tus necesidades
      }}
    >
      <Grid container spacing={2}>
        {daysOfWeek.map((day, index) => (
          <Grid item xs={12} sm={9} md={8} lg={3} key={index}>
            <Paper
              elevation={
                today.toLocaleDateString("en", { weekday: "long" }) === day
                  ? 10
                  : 3
              }
              style={{
                padding: "10px",
                transition: "box-shadow 0.3s ease",
                boxShadow:
                  today.toLocaleDateString("en", { weekday: "long" }) === day
                    ? "0 0 15px rgba(255, 0, 0, 0.8)"
                    : "none",
                marginBottom: 0, // Ajusta este valor según tus necesidades
              }}
            >
              <Typography variant="h6" align="center" gutterBottom>
                {day}
              </Typography>

              <div>
                <Typography variant="subtitle1">
                  Breakfast:{}
                  {today.toLocaleDateString("en", { weekday: "long" }) ===
                    day && (
                    <Tooltip title="Add to meals">
                      <IconButton
                        onClick={() => {
                          handleAddMeal(
                            (selectedRecipes[day] || {}).breakfast,
                            "Breakfast: ",
                            "10:00"
                          );
                        }}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Typography>

                <RecipeAutocomplete
                  selectedRecipe={(selectedRecipes[day] || {}).breakfast}
                  recipes={recipes}
                  handleRecipeChange={(recipe) =>
                    handleRecipeChange(day, "breakfast", recipe)
                  }
                />
              </div>

              <div>
                <Typography variant="subtitle1">
                  Lunch:
                  {today.toLocaleDateString("en", { weekday: "long" }) ===
                    day && (
                    <Tooltip title="Add to meals">
                      <IconButton
                        onClick={() => {
                          handleAddMeal(
                            (selectedRecipes[day] || {}).lunch,
                            "Lunch: ",
                            "12:00"
                          );
                        }}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Typography>

                <RecipeAutocomplete
                  selectedRecipe={(selectedRecipes[day] || {}).lunch}
                  recipes={recipes}
                  handleRecipeChange={(recipe) =>
                    handleRecipeChange(day, "lunch", recipe)
                  }
                />
              </div>
              <div>
                <Typography variant="subtitle1">
                  Snack:
                  {today.toLocaleDateString("en", { weekday: "long" }) ===
                    day && (
                    <Tooltip title="Add to meals">
                      <IconButton
                        onClick={() => {
                          handleAddMeal(
                            (selectedRecipes[day] || {}).snack,
                            "Snack: ",
                            "16:00"
                          );
                        }}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Typography>
                <RecipeAutocomplete
                  selectedRecipe={(selectedRecipes[day] || {}).snack}
                  recipes={recipes}
                  handleRecipeChange={(recipe) =>
                    handleRecipeChange(day, "snack", recipe)
                  }
                />
              </div>
              <div>
                <Typography variant="subtitle1">
                  Dinner:
                  {today.toLocaleDateString("en", { weekday: "long" }) ===
                    day && (
                    <Tooltip title="Add to meals">
                      <IconButton
                        onClick={() => {
                          handleAddMeal(
                            (selectedRecipes[day] || {}).dinner,
                            "Dinner: ",
                            "20:00"
                          );
                        }}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Typography>

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
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        {/* <IconButton
          type="submit"
          aria-label="search"
          onClick={handleShoppingList}
        >
          <ShoppingCartCheckoutIcon fontSize="large" />
        </IconButton> */}
        <Button
          variant="outlined"
          type="submit"
          aria-label="search"
          onClick={handleShoppingList}
          endIcon={<ShoppingCartCheckoutIcon />}
        >
          View Cart
        </Button>

        <IconButton
          type="submit"
          aria-label="search"
          onClick={handleAddToCalendar}
        >
          <SaveAltIcon fontSize="large" />
        </IconButton>
      </div>
      {initialData?.lastUpdate && (
        <Typography variant="h6" align="center" gutterBottom>
          {"Last Update: "}
        </Typography>
      )}

      {initialData?.lastUpdate && (
        <Typography variant="h6" align="center" gutterBottom>
          {getFecha(initialData.lastUpdate)}
        </Typography>
      )}

      <ShoppingList
        open={openList}
        setOpen={setOpenList}
        initialData={selectedRecipes}
        daysOfWeek={daysOfWeek}
        shoppingListData={shoppingListData}
        weeklyTotalPerFood={weeklyTotalPerFood}
      />
    </Container>
  );
};

export default Calendar;
