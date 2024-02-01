import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, Grid, TableRow } from "@mui/material";
import { useSnackbar } from "notistack";
import getApiUrl from "../../../helpers/apiConfig";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import CloseButton from "./CloseButton";
import NameField from "./NameField";
import StepField from "./StepField";
import AddButton from "./AddButton";
import AddMealButton from "./AddMealButton";
import RemoveButton from "./RemoveButton";
import FoodAutocomplete from "./FoodAutocomplete";
import WeightField from "./WeightField";
import AddPhoto from "./AddPhoto";
import FoodForm from "../FoodForm";
import FoodBankIcon from "@mui/icons-material/FoodBank";

const apiUrl = getApiUrl();

const initialMealState = {
  name: "",
  calories: 0,
  steps: [{ text: "", images: [] }],
  foods: [{ name: "", calories: "", weight: "", category: "" }],
  userId: localStorage.getItem("userId"),
};

const RecipeForm = ({
  openRecipe,
  setRecipeOpen,
  initialData,
  foodModal,
  setOpenFoodModal,
}) => {
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
  }, [foodModal]);

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

  const handleAddRecipe = () => {
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
      const requestBody = JSON.stringify(mealData);

      /*  // Imprimir el tamaño del cuerpo de la solicitud en bytes
      console.log(
        "Tamaño del cuerpo de la solicitud:",
        new Blob([requestBody]).size,
        "bytes"
      ); */

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
                ? "The recipe was updated successfully."
                : "The recipe was created successfully.",
              {
                variant: "success",
              }
            );
            closeModal();
          } else {
            enqueueSnackbar("An error occurred while saving the recipe.", {
              variant: "error",
            });
          }
        })
        .catch(function (error) {
          enqueueSnackbar("An error occurred while saving the recipe.", {
            variant: "error",
          });
        });
    }
  };
  const handleOpenFoodModal = () => {
    setOpenFoodModal(true);
  };

  const closeModal = () => {
    setRecipeOpen(false);

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
  const handleImageArrayChange = async (e, stepIndex) => {
    const files = e.target.files;

    const compressAndConvertToBase64 = async (file) => {
      try {
        const compressedBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");

              const maxWidth = 400;
              const maxHeight = 400;

              let width = img.width;
              let height = img.height;

              if (width > maxWidth || height > maxHeight) {
                const aspectRatio = width / height;
                if (width > maxWidth) {
                  width = maxWidth;
                  height = width / aspectRatio;
                }
                if (height > maxHeight) {
                  height = maxHeight;
                  width = height * aspectRatio;
                }
              }

              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);

              const compressedBase64 = canvas.toDataURL("image/jpeg", 0.2);
              resolve(compressedBase64);
            };
          };

          reader.readAsDataURL(file);
        });

        return compressedBase64;
      } catch (error) {
        console.error("Error converting image to base64:", error);
        throw error;
      }
    };

    const processImage = async (file) => {
      try {
        const base64Image = await compressAndConvertToBase64(file);
        setMealData((prevMealData) => {
          const updatedSteps = [...prevMealData.steps];
          updatedSteps[stepIndex] = {
            ...updatedSteps[stepIndex],
            images: [...updatedSteps[stepIndex].images, base64Image],
          };
          return { ...prevMealData, steps: updatedSteps };
        });
      } catch (error) {
        console.error("Error processing image:", error);
      }
    };

    if (files.length > 0) {
      await Promise.all(Array.from(files).map(processImage));
    }
  };

  const handleRemoveImage = (stepIndex) => {
    setMealData((prevMealData) => {
      const updatedSteps = [...prevMealData.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        images: [],
      };

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
      open={openRecipe}
      onClose={closeModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      disableScrollLock={true}
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
          maxHeight: "80vh !important",
          overflowY: "auto !important",

          p: 4,
          borderRadius: "2%",
        }}
      >
        <CloseButton closeModal={closeModal} />
        <Grid container spacing={2}>
          <NameField mealData={mealData} setMealData={setMealData} />
          {mealData.steps &&
            mealData.steps.map((step, index) => (
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

                {mealData.steps[index] &&
                mealData.steps[index].images.length === 0 ? (
                  <AddPhoto
                    index={index}
                    handleImageArrayChange={handleImageArrayChange}
                    handleRemoveImage={handleRemoveImage}
                  />
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

              <WeightField
                food={food}
                index={index}
                handleQuantityInputChange={handleQuantityInputChange}
              />
              <AddButton index={index} handleInput={handleAddFoodInput} />
              <RemoveButton
                index={index}
                handleRemove={handleRemoveFoodInput}
              />
              {food.name === "" && (
                <Grid
                  item
                  xs={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconButton color="primary" onClick={handleOpenFoodModal}>
                    <FoodBankIcon />
                  </IconButton>
                </Grid>
              )}
            </React.Fragment>
          ))}
          <FoodForm open={foodModal} setOpen={setOpenFoodModal} />
          <AddMealButton
            initialData={initialData}
            handleAddMeal={handleAddRecipe}
          />
        </Grid>
      </Box>
    </Modal>
  );
};

export default RecipeForm;
