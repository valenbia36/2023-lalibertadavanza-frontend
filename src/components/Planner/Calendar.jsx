import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RecipeAutocomplete from "./RecipeAutocomplete";
import getApiUrl from "../../helpers/apiConfig";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CheckIcon from "@mui/icons-material/Check";
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
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [addedMealsCount, setAddedMealsCount] = useState(0);
  const [mealToAdd, setMealToAdd] = useState(null);

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
    const dailyTotalPerFood = {};

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
            if (!dailyTotalPerFood[food.name]) {
              dailyTotalPerFood[food.name] = 0;
            }

            dailyTotalPerFood[food.name] += food.weightConsumed;

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
    setWeeklyTotalPerFood(dailyTotalPerFood);
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
    if (meal) {
      setMealToAdd({ meal, timeOfTheDay, hour });
      setShowConfirmationDialog(true);
    } else {
      addMealToCalendar(meal, timeOfTheDay, hour);
      setAddedMealsCount(addedMealsCount + 1);
    }
  };

  const addMealToCalendar = (meal, timeOfTheDay, hour) => {
    handleAddToCalendar();
    const fechaActual = new Date();
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const horaFormateada = `${horas < 10 ? "0" : ""}${horas}:${
      minutos < 10 ? "0" : ""
    }${minutos}`;
    if (meal && meal != []) {
      const mealToAdd = {
        name: meal.name,
        foods: meal.foods,
        date: fechaActual,
        hour: horaFormateada,
      };
      setIsLoading(true);
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
      setIsLoading(false);
    } else {
      setIsLoading(false);
      enqueueSnackbar("An error occurred while saving the meal.", {
        variant: "error",
      });
    }
  };

  const handleConfirmAddMeal = () => {
    if (mealToAdd && mealToAdd.meal) {
      addMealToCalendar(mealToAdd.meal, mealToAdd.timeOfTheDay, mealToAdd.hour);
      setShowConfirmationDialog(false);
    }
  };

  const handleCloseConfirmationDialog = () => {
    setShowConfirmationDialog(false);
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
        marginBottom: 0,
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
                marginBottom: 0,
              }}
            >
              <Typography variant="h6" align="center" gutterBottom>
                {day}
              </Typography>

              <div>
                <Typography variant="subtitle1">
                  Breakfast:
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
        <Button
          variant="contained"
          type="submit"
          aria-label="search"
          onClick={handleShoppingList}
          endIcon={<ShoppingCartCheckoutIcon />}
          style={{ marginRight: "10px" }}
        >
          View Cart
        </Button>
        <Button
          variant="contained"
          type="submit"
          aria-label="search"
          onClick={handleAddToCalendar}
          endIcon={<SaveAltIcon />}
          style={{ marginLeft: "10px" }}
        >
          Save Plan
        </Button>
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

      <Dialog
        open={showConfirmationDialog}
        onClose={handleCloseConfirmationDialog}
      >
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have already added a meal today. Are you sure you want to add
            another one?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAddMeal} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Calendar;
