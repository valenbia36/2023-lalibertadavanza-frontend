import React, { useState } from "react";
import { TextField, Button, Modal, Box } from "@mui/material";
import { useSnackbar } from "notistack";

const initialFoodState = {
  name: "",
  calories: "",
  weight: "",
  category: "",
};

const FoodForm = ({ open, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [newFood, setNewFood] = useState(initialFoodState);

  const closeModal = () => {
    setOpen(false);
    setNewFood(initialFoodState);
  };

  const handleCaloriesInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewFood({ ...newFood, calories: inputValue });
    } else {
      setNewFood({ ...newFood, calories: "" }); // Deja el campo de entrada vacío
    }
  };

  const handleWeightInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewFood({ ...newFood, weight: inputValue });
    } else {
      setNewFood({ ...newFood, weight: "" }); // Deja el campo de entrada vacío
    }
  };

  const handleAddFood = () => {
    if (
      newFood.name === "" ||
      newFood.calories === "" ||
      newFood.weight === "" ||
      newFood.category === ""
    ) {
      enqueueSnackbar("Please complete all the fields.", { variant: "error" });
      return;
    } else {
      fetch("http://localhost:3001/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(newFood),
      }).then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("The food was created successfully.", {
            variant: "success",
          });
          closeModal();
        } else {
          enqueueSnackbar("An error occurred while creating the food.", {
            variant: "error",
          });
        }
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
          width: 400,
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
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
          />

          <TextField
            InputProps={{
              inputProps: { min: 1 },
            }}
            label={`Weight (gr/ml)`}
            type="number"
            variant="outlined"
            fullWidth
            value={newFood.weight}
            onChange={(e) => handleWeightInputChange(e)}
            style={{ marginBottom: "7px" }}
          />

          <TextField
            InputProps={{
              inputProps: {
                step: 1, // Establece el incremento/decremento en 1
              },
            }}
            label={`Calories`}
            type="number"
            variant="outlined"
            fullWidth
            value={newFood.calories}
            onChange={(e) => handleCaloriesInputChange(e)}
          />

          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newFood.category}
            onChange={(e) =>
              setNewFood({ ...newFood, category: e.target.value })
            }
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddFood}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
            }}
            fullWidth
          >
            Add Food
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default FoodForm;
