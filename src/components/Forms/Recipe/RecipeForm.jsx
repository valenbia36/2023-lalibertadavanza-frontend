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
  /* const [foodModal, setOpenFoodModal] = useState(false); // This controls CategoryForm */
  const { enqueueSnackbar } = useSnackbar();
  /* console.log("Recipe: " + openRecipe);
  console.log("Food: " + foodModal); */

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
  }, [openRecipe, mealData]);

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
    const updatedImages = [...mealData.steps[stepIndex].images];

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };

    const processImage = async (file) => {
      try {
        const base64Image = await convertToBase64(file);
        console.log(base64Image);
        updatedImages.push(base64Image);
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    };

    if (files.length > 0) {
      // Utilizar Promise.all para manejar las promesas de convertToBase64
      await Promise.all(Array.from(files).map(processImage));

      setMealData((prevMealData) => {
        const updatedSteps = [...prevMealData.steps];
        updatedSteps[stepIndex] = {
          ...updatedSteps[stepIndex],
          images: updatedImages,
        };
        return { ...prevMealData, steps: updatedSteps };
      });
    } else {
      // Eliminar la última imagen si no se selecciona ningún archivo
      updatedImages.pop();
      setMealData((prevMealData) => {
        const updatedSteps = [...prevMealData.steps];
        updatedSteps[stepIndex] = {
          ...updatedSteps[stepIndex],
          images: updatedImages,
        };
        return { ...prevMealData, steps: updatedSteps };
      });
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
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result); // Resuelve la promesa con el resultado directamente
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
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
      open={openRecipe}
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
              {<img src={step.images[0]} />}
              {console.log(step)}
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
                  <IconButton
                    color="primary"
                    onClick={() => setOpenFoodModal(true)}
                  >
                    <FoodBankIcon />
                  </IconButton>
                </Grid>
              )}
            </React.Fragment>
          ))}
          <FoodForm open={foodModal} setOpen={setOpenFoodModal} />
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
