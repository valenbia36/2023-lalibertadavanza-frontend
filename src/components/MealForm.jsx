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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";

const initialMealState = {
  name: "",
  date: new Date(),
  hour: new Date(),
  calories: 0,
  foods: [{ name: "", calories: "", weight: "", category: "" }],
  userId: localStorage.getItem("userId"),
};

const MealForm = ({ open, setOpen, initialData }) => {
  const [mealData, setMealData] = useState(initialMealState);
  const [foodOptions, setFoodOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (initialData) {
      const initialTime = new Date(`2023-01-01T${initialData.hour}`);
      const initialDate = new Date(initialData.date + "T10:00:00Z");
      setMealData({
        ...initialData,
        hour: initialTime,
        date: initialDate,
      });
    } else {
      setMealData({
        name: "",
        date: new Date(),
        hour: new Date(),
        calories: 0,
        foods: [{ name: "", calories: "", weight: "", category: "" }],
        userId: localStorage.getItem("userId"),
      });
    }
  }, [initialData]);

  useEffect(() => {
    getFoods();
  }, [open]);

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

  const handleAddMeal = () => {
    if ( mealData.name === "" || mealData.date === "" || mealData.hour === "" || !mealData.foods.every((food) => food.name !== "" && food.weight !== "" && Number(food.weightConsumed) > 0)) {
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    } else {
      mealData.calories = mealData.foods
        .map((food) => parseInt(food.totalCalories))
        .reduce((acc, calories) => acc + calories, 0);
      mealData.hour = mealData.hour.toTimeString().slice(0, 5);

      const url = initialData
        ? `http://localhost:3001/api/meals/${initialData._id}`
        : "http://localhost:3001/api/meals";
      const method = initialData ? "PUT" : "POST";

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

  const closeModal = () => {
    setOpen(false);
    setMealData({
      name: "",
      date: new Date(),
      hour: new Date(),
      calories: 0,
      foods: [{ name: "", calories: "", weight: "", category: "" }],
      userId: localStorage.getItem("userId"),
    });
  };

  const handleAddFoodInput = () => {
    const updatedFoods = [
      ...mealData.foods,
      { name: "", calories: "", weight: "", category: "" },
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
    updatedFoods[index].weight = result ? result.weight : "";
    updatedFoods[index].category = result ? result.category : "";
    setMealData({ ...mealData, foods: updatedFoods });
  };

  const handleQuantityInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
      const updatedFoods = [...mealData.foods];
      updatedFoods[index].weightConsumed = inputValue;
      updatedFoods[index].totalCalories =  Math.round(inputValue * (updatedFoods[index].calories / updatedFoods[index].weight));
      setMealData({ ...mealData, foods: updatedFoods });
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
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: '2%'
        }}
      >
        <IconButton
          aria-label="Close"
          onClick={closeModal}
          sx={{
            position: "absolute",
            top: "3%",
            right: "10px",
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disableFuture
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 60,
                  }}
                  value={mealData.date}
                  onChange={(newDate) =>
                    setMealData({ ...mealData, date: newDate })
                  }
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Hour"
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
                      hour: newTime,
                    })
                  }
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          {mealData.foods.map((food, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id={`food-label-${index}`}>Food</InputLabel>
                  <Select
                    labelId={`food-label-${index}`}
                    id={`food-select-${index}`}
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
              <Grid item xs={4}>
                <TextField
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  label={`Weight (gr/ml)`}
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={food.weightConsumed}
                  onChange={(e) => handleQuantityInputChange(e, index)}
                />
              </Grid>
              {index === 0 && (
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
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
            </React.Fragment>
          ))}
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default MealForm;
