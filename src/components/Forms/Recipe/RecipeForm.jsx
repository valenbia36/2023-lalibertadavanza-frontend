import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  IconButton,
  Grid,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import getApiUrl from "../../../helpers/apiConfig";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import CloseButton from "./CloseButton";
import NameField from "./NameField";
import StepField from "./StepField";
import AddButton from "./AddButton";
import AddMealButton from "./AddMealButton";
import RemoveButton from "./RemoveButton";
import AddPhoto from "./AddPhoto";
import FoodForm from "../FoodForm";
import { Autocomplete } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import FoodBankIcon from "@mui/icons-material/FoodBank";

const apiUrl = getApiUrl();

const initialMealState = {
  name: "",
  steps: [{ text: "", images: [] }],
  foods: [{ foodId: "", weightConsumed: "" }],
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
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [showInstructions, setShowInstructions] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [foodsLoaded, setFoodsLoaded] = useState(false); // Estado para controlar la carga de alimentos
  const [loadingFoods, setLoadingFoods] = useState(false); // Estado para controlar el estado de carga de alimentos en Autocomplete
  // Cargar alimentos al montar el componente
  useEffect(() => {
    if (!foodsLoaded && !initialData) {
      getFoods();
    }
  }, [foodsLoaded, initialData]);
  useEffect(() => {
    getFoods();
  }, [foodModal]);

  // Inicializar mealData cuando cambia initialData o foodOptions
  useEffect(() => {
    if (initialData && foodsLoaded) {
      initializeForm(initialData);
    } else {
      initializeForm(initialMealState);
    }
  }, [initialData, foodOptions]);

  const initializeForm = (data) => {
    const initialTime = new Date(`2023-01-01T${data.hour}`);
    const initialDate = new Date(data.date + "T10:00:00Z");
    const initialFoods = data.foods.map((food) => ({
      foodId: food.foodId._id,
      weightConsumed: food.weightConsumed,
    }));
    setMealData({
      ...data,
      hour: initialTime,
      date: initialDate,
      foods: initialFoods,
    });
  };

  const getFoods = async () => {
    setLoadingFoods(true);
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl + "/api/foods/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFoodOptions(data.data);
        setFoodsLoaded(true); // Marcar que los alimentos se han cargado correctamente
      } else {
        throw new Error("Failed to fetch food options");
      }
    } catch (error) {
      console.error("Error fetching food options:", error);
      enqueueSnackbar("Failed to load food options.", { variant: "error" });
    } finally {
      setIsLoading(false);
      setLoadingFoods(false);
    }
  };

  useEffect(() => {
    const showInstructionsPreference = localStorage.getItem("showInstructions");
    if (showInstructionsPreference !== "false") {
      setShowInstructions(true);
    }
  }, []);

  const handleDontShowAgainChange = (event) => {
    setDontShowAgain(event.target.checked);
  };

  const handleCloseInstructions = () => {
    if (dontShowAgain) {
      localStorage.setItem("showInstructions", "false");
    }
    setShowInstructions(false);
  };

  const handleAddRecipe = () => {
    setIsLoading(true);
    if (
      mealData.name === "" ||
      !mealData.foods.every(
        (food) => food.foodId !== "" && Number(food.weightConsumed) > 0
      ) ||
      !mealData.steps.every((step) => step.text.trim().length > 0)
    ) {
      setIsLoading(false);
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    } else {
      const requestBody = JSON.stringify(mealData);
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
      setIsLoading(false);
    }
  };

  const handleOpenFoodModal = () => {
    setOpenFoodModal(true);
  };

  const closeModal = () => {
    setRecipeOpen(false);

    setMealData({
      name: "",
      steps: [{ text: "", images: [] }],
      foods: [{ foodId: "", weightConsumed: "" }],
    });
  };

  const handleAddFoodInput = () => {
    const updatedFoods = [
      ...mealData.foods,
      { foodId: "", weightConsumed: "" },
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
      updatedFoods[index].foodId = newValue._id ? newValue._id : "";
    } else {
      updatedFoods[index].foodId = "";
    }

    setMealData({ ...mealData, foods: updatedFoods });
  };

  const handleQuantityInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    const updatedFoods = [...mealData.foods];
    if (!isNaN(inputValue) && inputValue >= 1) {
      updatedFoods[index].weightConsumed = inputValue;
      setMealData({ ...mealData, foods: updatedFoods });
    } else {
      updatedFoods[index].weightConsumed = "";
    }
  };

  return (
    <>
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
            <Grid
              container
              spacing={1}
              marginTop={2}
              marginLeft={1}
              alignItems="center"
            >
              {mealData.foods.map((food, index) => (
                <Grid container item spacing={2} key={index}>
                  <Grid item xs={6}>
                    <Autocomplete
                      id={`food-autocomplete-${index}`}
                      sx={{ display: "flex", alignItems: "center" }}
                      options={foodOptions}
                      loading={loadingFoods}
                      value={
                        food.foodId
                          ? foodOptions.find(
                              (option) => option._id === food.foodId
                            )
                          : null
                      }
                      onChange={(e, newValue) =>
                        handleFoodInputChange(newValue, index)
                      }
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Food"
                          variant="outlined"
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingFoods ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                      noOptionsText="No foods available."
                      ListboxProps={{
                        style: {
                          maxHeight: 110,
                        },
                      }}
                    />
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
                  <Grid
                    item
                    xs={1}
                    sm={0}
                    direction="row"
                    spacing={0}
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    {index === 0 && (
                      <Grid item xs="auto">
                        <IconButton
                          color="primary"
                          onClick={handleAddFoodInput}
                        >
                          <AddCircleRoundedIcon />
                        </IconButton>
                      </Grid>
                    )}
                    {index > 0 && (
                      <Grid item xs="auto">
                        <IconButton
                          color="primary"
                          onClick={() => handleRemoveFoodInput(index)}
                        >
                          <RemoveCircleRoundedIcon />
                        </IconButton>
                      </Grid>
                    )}
                    {!food.foodId && (
                      <Grid item xs="auto">
                        <IconButton
                          color="primary"
                          onClick={handleOpenFoodModal}
                        >
                          <FoodBankIcon />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <FoodForm open={foodModal} setOpen={setOpenFoodModal} />
            <AddMealButton
              initialData={initialData}
              handleAddMeal={handleAddRecipe}
              disable={isLoading}
            />
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default RecipeForm;
