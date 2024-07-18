import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
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
import SaveIcon from "@mui/icons-material/Save";
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

const Calendar = ({
  initialData,
  recipes,
  isMobile,
  setPlan,
  isModalRecipeOpen,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [openList, setOpenList] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
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
    console.log(recipes);
  }, [initialData, isModalRecipeOpen]);

  const handleShoppingList = async () => {
    await handleAddToCalendar();
    setOpenList(true);
  };

  const handleRecipeChange = (day, meal, recipe) => {
    setSelectedRecipes({
      ...selectedRecipes,
      [day]: { ...selectedRecipes[day], [meal]: recipe },
    });
  };

  const handleAddToCalendar = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiUrl + "/api/weeks/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ ...selectedRecipes }),
      });

      if (response.ok) {
        enqueueSnackbar("The plan was created successfully.", {
          variant: "success",
        });
        setPlan({ ...selectedRecipes, lastUpdate: new Date() });
      } else {
        enqueueSnackbar("An error occurred while creating the plan.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      enqueueSnackbar("An error occurred while creating the plan.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownloadPlan = async () => {
    try {
      // Selecciona el contenedor que deseas capturar
      const container = document.querySelector("#calendar");

      // Captura el contenido del contenedor
      const canvas = await html2canvas(container);
      const dataURL = canvas.toDataURL("image/png");

      // Crea un blob a partir del dataURL y lo descarga
      const blob = await (await fetch(dataURL)).blob();
      saveAs(blob, "meal-plan.png");
    } catch (error) {
      console.error("Error capturing plan:", error);
    }
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

  const addMealToCalendar = async (meal, timeOfTheDay, hour) => {
    try {
      setIsLoading(true);
      const fechaActual = new Date();
      const horas = fechaActual.getHours();
      const minutos = fechaActual.getMinutes();
      const horaFormateada = `${horas < 10 ? "0" : ""}${horas}:${
        minutos < 10 ? "0" : ""
      }${minutos}`;

      if (meal && meal !== []) {
        const mealToAdd = {
          name: meal.name,
          foods: meal.foods,
          date: fechaActual,
          hour: horaFormateada,
        };

        const response = await fetch(apiUrl + "/api/meals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(mealToAdd),
        });

        if (response.ok) {
          enqueueSnackbar("The meal was created successfully.", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("An error occurred while saving the meal.", {
            variant: "error",
          });
        }
      } else {
        enqueueSnackbar("An error occurred while saving the meal.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while saving the meal.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
    await handleAddToCalendar();
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
    const fechaObjeto = new Date(fecha);
    const horas = fechaObjeto.getHours();
    const minutos = fechaObjeto.getMinutes();
    const dia = fechaObjeto.getDate();
    const mes = fechaObjeto.getMonth() + 1;
    const anio = fechaObjeto.getFullYear();
    return `${horas < 10 ? "0" : ""}${horas}:${
      minutos < 10 ? "0" : ""
    }${minutos} ${dia}/${mes}/${anio}`;
  }

  return (
    <Container
      id="calendar"
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
                    day &&
                    (selectedRecipes[day] || {}).breakfast && (
                      <Tooltip title="Add to meals">
                        <IconButton
                          onClick={() => {
                            handleAddMeal(
                              (selectedRecipes[day] || {}).breakfast,
                              "Breakfast: ",
                              "10:00"
                            );
                          }}
                          disabled={isLoading}
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
                    day &&
                    (selectedRecipes[day] || {}).lunch && (
                      <Tooltip title="Add to meals">
                        <IconButton
                          onClick={() => {
                            handleAddMeal(
                              (selectedRecipes[day] || {}).lunch,
                              "Lunch: ",
                              "12:00"
                            );
                          }}
                          disabled={isLoading}
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
                    day &&
                    (selectedRecipes[day] || {}).snack && (
                      <Tooltip title="Add to meals">
                        <IconButton
                          onClick={() => {
                            handleAddMeal(
                              (selectedRecipes[day] || {}).snack,
                              "Snack: ",
                              "16:00"
                            );
                          }}
                          disabled={isLoading}
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
                    day &&
                    (selectedRecipes[day] || {}).dinner && (
                      <Tooltip title="Add to meals">
                        <IconButton
                          onClick={() => {
                            handleAddMeal(
                              (selectedRecipes[day] || {}).dinner,
                              "Dinner: ",
                              "20:00"
                            );
                          }}
                          disabled={isLoading}
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
          endIcon={<ShoppingCartCheckoutIcon />}
          style={{ marginRight: "10px" }}
          onClick={handleShoppingList}
          disabled={isLoading}
        >
          View Cart
        </Button>
        <Button
          variant="contained"
          type="submit"
          aria-label="search"
          onClick={handleAddToCalendar}
          endIcon={<SaveIcon />}
          style={{ marginLeft: "10px" }}
          disabled={isLoading}
        >
          Save Plan
        </Button>
        <Button
          variant="contained"
          type="submit"
          aria-label="search"
          style={{ marginLeft: "10px" }}
          endIcon={<SaveAltIcon />}
          disabled={isLoading}
          onClick={handleDownloadPlan}
        >
          Download
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
