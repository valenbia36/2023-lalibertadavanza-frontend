import React, { useEffect, useState } from "react";
import { TextField, Modal, Box, IconButton, Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import getApiUrl from "../../../helpers/apiConfig";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import CloseButton from "./CloseButton";
import NameField from "./NameField";
import StepField from "./StepField";
import AddButton from "./AddButton";
import AddMealButton from "./AddMealButton";
import RemoveButton from "./RemoveButton";
import FoodAutocomplete from "./FoodAutocomplete";

const apiUrl = getApiUrl();

const initialMealState = {
  name: "",
  calories: 0,
  steps: [{ text: "", images: [] }],
  foods: [{ name: "", calories: "", weight: "", category: "" }],
  userId: localStorage.getItem("userId"),
};

const RecipeForm = ({ open, setOpen, initialData }) => {
  const [mealData, setMealData] = useState(initialMealState);
  const [foodOptions, setFoodOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (initialData) {
      setMealData({
        ...initialData,
      });
    } else {
      setMealData({
        name: "",
        calories: 0,
        steps: [{ text: "", images: [] }],
        foods: [{ name: "", calories: "", weight: "", category: "" }],
        userId: localStorage.getItem("userId"),
      });
    }
  }, [initialData]);

  useEffect(() => {
    getFoods();
  }, [open, mealData]);

  const getFoods = async () => {
    const response = await fetch(apiUrl + "/api/foods/", {
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
    if (
      mealData.name === "" ||
      !mealData.foods.every(
        (food) =>
          food.name !== "" &&
          food.weight !== "" &&
          Number(food.weightConsumed) > 0
      )
    ) {
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    } else {
      mealData.calories = mealData.foods
        .map((food) => parseInt(food.totalCalories))
        .reduce((acc, calories) => acc + calories, 0);

      mealData.carbs = mealData.foods
        .map((food) => parseInt(food.totalCarbs))
        .reduce((acc, carbs) => acc + carbs, 0);

      mealData.proteins = mealData.foods
        .map((food) => parseInt(food.totalProteins))
        .reduce((acc, proteins) => acc + proteins, 0);

      mealData.fats = mealData.foods
        .map((food) => parseInt(food.totalFats))
        .reduce((acc, fats) => acc + fats, 0);

      const url = initialData
        ? apiUrl + `/api/recipes/${initialData._id}`
        : apiUrl + "/api/recipes";
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
      calories: 0,
      steps: [{ text: "", images: [] }],
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
  const handleAddStepInput = () => {
    setMealData((prevMealData) => ({
      ...prevMealData,
      steps: [...prevMealData.steps, { text: "", images: [] }],
    }));
  };

  const handleRemoveStepInput = (indexToRemove) => {
    setMealData((prevMealData) => ({
      ...prevMealData,
      steps: prevMealData.steps.filter((_, index) => index !== indexToRemove),
    }));
  };
  const handleStepChange = (index, value, images) => {
    setMealData((prevMealData) => {
      const newSteps = [...prevMealData.steps];
      newSteps[index] = { text: value, images: images };
      return { ...prevMealData, steps: newSteps };
    });
  };
  const handleImageArrayChange = (e, stepIndex) => {
    const files = e.target.files;
    const updatedImages = [...mealData.steps[stepIndex].images];

    if (files.length > 0) {
      // Agregar nuevas imágenes
      for (const file of files) {
        const imageUrl = URL.createObjectURL(file);
        updatedImages.push(imageUrl);
      }
    } else {
      // Eliminar la última imagen si no se selecciona ningún archivo
      updatedImages.pop();
    }

    setMealData((prevMealData) => {
      const updatedSteps = [...prevMealData.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        images: updatedImages,
      };
      return { ...prevMealData, steps: updatedSteps };
    });
  };

  const handleRemoveImage = (stepIndex) => {
    console.log(mealData.steps);
    setMealData((prevMealData) => {
      const updatedSteps = [...prevMealData.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        images: [],
      };
      console.log(mealData.steps);
      return { ...prevMealData, steps: updatedSteps };
    });
  };

  const handleFoodInputChange = (newValue, index) => {
    const updatedFoods = [...mealData.foods];
    if (newValue) {
      updatedFoods[index].name = newValue.name ? newValue.name : "";
      updatedFoods[index].calories = newValue.calories;
      updatedFoods[index].carbs = newValue.carbs;
      updatedFoods[index].proteins = newValue.proteins;
      updatedFoods[index].fats = newValue.fats;
      updatedFoods[index].weight = newValue.weight;
      updatedFoods[index].category = newValue.category;
      if (updatedFoods[index].weightConsumed) {
        updatedFoods[index].totalCalories = Math.round(
          updatedFoods[index].weightConsumed *
            (updatedFoods[index].calories / updatedFoods[index].weight)
        );

        updatedFoods[index].totalCarbs = Math.round(
          updatedFoods[index].weightConsumed *
            (updatedFoods[index].carbs / updatedFoods[index].weight)
        );

        updatedFoods[index].totalProteins = Math.round(
          updatedFoods[index].weightConsumed *
            (updatedFoods[index].proteins / updatedFoods[index].weight)
        );

        updatedFoods[index].totalFats = Math.round(
          updatedFoods[index].weightConsumed *
            (updatedFoods[index].fats / updatedFoods[index].weight)
        );
      }
    } else {
      updatedFoods[index].name = "";
      updatedFoods[index].calories = 0;
      updatedFoods[index].weight = 0;
      updatedFoods[index].category = "";
    }
    setMealData({ ...mealData, foods: updatedFoods });
  };

  const handleQuantityInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    const updatedFoods = [...mealData.foods];
    if (!isNaN(inputValue) && inputValue >= 1) {
      updatedFoods[index].weightConsumed = inputValue;
      updatedFoods[index].totalCalories = Math.round(
        inputValue * (updatedFoods[index].calories / updatedFoods[index].weight)
      );
      updatedFoods[index].totalCarbs = Math.round(
        updatedFoods[index].weightConsumed *
          (updatedFoods[index].carbs / updatedFoods[index].weight)
      );

      updatedFoods[index].totalProteins = Math.round(
        updatedFoods[index].weightConsumed *
          (updatedFoods[index].proteins / updatedFoods[index].weight)
      );

      updatedFoods[index].totalFats = Math.round(
        updatedFoods[index].weightConsumed *
          (updatedFoods[index].fats / updatedFoods[index].weight)
      );
      setMealData({ ...mealData, foods: updatedFoods });
    } else {
      updatedFoods[index].weightConsumed = "";
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
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "2%",
        }}
      >
        <CloseButton closeModal={closeModal} />
        <Grid container spacing={2}>
          <NameField mealData={mealData} setMealData={setMealData} />
          {mealData.steps.map((step, index) => (
            <React.Fragment key={index}>
              <StepField
                mealData={mealData}
                handleStepChange={handleStepChange}
                index={index}
              />
              <AddButton index={index} handleInput={handleAddStepInput} />
              <RemoveButton
                index={index}
                handleRemove={handleRemoveStepInput}
              />
              {mealData.steps[index].images.length === 0 ? (
                <Grid
                  item
                  xs={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    accept="image/*"
                    id={`icon-button-file-${index}`}
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageArrayChange(e, index)}
                  />
                  <label htmlFor={`icon-button-file-${index}`}>
                    <IconButton
                      color="primary"
                      component="span"
                      onClick={() => handleRemoveImage(index)} // Add this line
                    >
                      <AddPhotoAlternateIcon />
                    </IconButton>
                  </label>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <CancelPresentationIcon />
                  </IconButton>
                </Grid>
              )}
            </React.Fragment>
          ))}

          {mealData.foods.map((food, index) => (
            <React.Fragment key={index}>
              <FoodAutocomplete
                food={food}
                foodOptions={foodOptions}
                index={index}
                handleFoodInputChange={handleFoodInputChange}
              />
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
              <AddButton index={index} handleInput={handleAddFoodInput} />
              <RemoveButton
                index={index}
                handleRemove={handleRemoveFoodInput}
              />
            </React.Fragment>
          ))}
          <AddMealButton
            initialData={initialData}
            handleAddMeal={handleAddMeal}
          />
        </Grid>
      </Box>
    </Modal>
  );
};

export default RecipeForm;
