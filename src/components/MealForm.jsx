import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  IconButton,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import { useSnackbar } from "notistack";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

const initialMealState = {
  name: "",
  date: "",
  hour: new Date(),
  calories: 0,
  foods: [{ name: "", calories: "", quantity: "" }],
  userId: localStorage.getItem("userId"),
};

const MealForm = ({ open, setOpen, initialData }) => {
  const [mealData, setMealData] = useState(initialMealState);
  const [foodOptions, setFoodOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (initialData) {
      const initialTime = new Date(`2023-01-01T${initialData.hour}`);
      setMealData({
        ...initialData,
        hour: initialTime,
      });
    } else {
      setMealData(initialMealState);
    }
  }, [initialData]);

  const getFoods = async () => {
    const response = await fetch("http://localhost:3001/api/foods/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setFoodOptions(data.data);
  };

  useEffect(() => {
    getFoods();
  }, []);

  const closeModal = () => {
    setOpen(false);
    setMealData({
      name: "",
      date: "",
      hour: new Date(),
      calories: 0,
      foods: [{ name: "", calories: "", quantity: "" }],
      userId: localStorage.getItem("userId"),
    });

  };

  const handleAddFoodInput = () => {
    const updatedFoods = [
      ...mealData.foods,
      { name: "", calories: "", quantity: "" },
    ];
    setMealData({ ...mealData, foods: updatedFoods });
  };

  const handleRemoveFoodInput = (index) => {
    const updatedFoods = [...mealData.foods];
    updatedFoods.splice(index, 1);
    setMealData({ ...mealData, foods: updatedFoods });
  };

  const handleFoodInputChange = (event, index) => {
    const updatedFoods = [...mealData.foods];
    updatedFoods[index].name = event.target.value;
    let result = foodOptions.find((item) => item.name === event.target.value);
    updatedFoods[index].calories = result ? result.calories : "";
    setMealData({ ...mealData, foods: updatedFoods });
  };

  const handleQuantityInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      const updatedFoods = [...mealData.foods];
      updatedFoods[index].quantity = inputValue;
      setMealData({ ...mealData, foods: updatedFoods });
    } else {
      const updatedFoods = [...mealData.foods];
      updatedFoods[index].quantity = "";
      setMealData({ ...mealData, foods: updatedFoods });
    }
  };

  const handleAddMeal = () => {
    if (
      mealData.name === "" ||
      mealData.date === "" ||
      mealData.hour === "" ||
      !mealData.foods.every((food) => food.name !== "" && food.quantity !== "")
    ) {
      enqueueSnackbar("Please complete all the fields.", {
        variant: "error",
      });
      return;
    } else {
      mealData.calories = mealData.foods
        .map((food) => parseInt(food.calories) * parseInt(food.quantity))
        .reduce((acc, calories) => acc + calories, 0);
      
      mealData.hour = mealData.hour.toTimeString().slice(0, 5);

      const url = initialData
        ? `http://localhost:3001/api/meals/${initialData._id}`
        : "http://localhost:3001/api/meals";
      const method = initialData ? "PUT" : "POST";

      console.log(JSON.stringify(mealData))

      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(mealData),
      })
        .then(function (response) {
          if (response.status === 200) {
            enqueueSnackbar(
              initialData
                ? "The meal was updated successfully."
                : "The meal was created successfully.",
              {
                variant: "success",
              }
            );
            closeModal();
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
    }
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={mealData.name}
            onChange={(e) =>
              setMealData({ ...mealData, name: e.target.value })
            }
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            label="Date"
            variant="outlined"
            fullWidth
            margin="normal"
            type="date"
            value={mealData.date}
            onChange={(e) =>
              setMealData({ ...mealData, date: e.target.value })
            }
          />
          <FormControl fullWidth>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Hour (HH:mm)" // Cambia la etiqueta para reflejar el formato
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 60,
              }}
              value={mealData.hour}
              onChange={(newTime) =>
                setMealData({
                  ...mealData,
                  hour: newTime
                })
              }
            />
          </LocalizationProvider>
          </FormControl>
          {mealData.foods.map((food, index) => (
            <Grid
              container
              spacing={1}
              alignItems="center"
              key={index}
              sx={{ marginTop: "2%" }}
            >
              <Grid item xs={7}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Food</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={food.name}
                    label="Food"
                    onChange={(e) => handleFoodInputChange(e, index)}
                  >
                    {Array.isArray(foodOptions) && foodOptions.length > 0 ? (
                      foodOptions.map((option) => (
                        <MenuItem key={option.id} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No hay alimentos disponibles</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  label={`Quantity`}
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={food.quantity}
                  onChange={(e) => handleQuantityInputChange(e, index)}
                />
              </Grid>
              {index === 0 && (
                <Grid item xs={2}>
                  <IconButton color="primary" onClick={handleAddFoodInput}>
                    <AddCircleRoundedIcon />
                  </IconButton>
                </Grid>
              )}
              {index > 0 && (
                <Grid item xs={2}>
                  <IconButton
                    color="primary"
                    onClick={() => handleRemoveFoodInput(index)}
                  >
                    <RemoveCircleRoundedIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMeal}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
            }}
            fullWidth
          >
            {initialData ? "Update Meal" : "Add Meal"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default MealForm;