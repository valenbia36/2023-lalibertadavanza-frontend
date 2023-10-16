import React, { useState } from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  Grid,
  IconButton,
  FormControl,
} from "@mui/material";
import { useSnackbar } from "notistack";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CategoryForm from "./CategoryForm";
import CategorySelect from "./CategorySelect";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const initialGoalState = {
  name: "",
  calories: "",
  userId: localStorage.getItem("userId"),
  startDate: "",
  endDate: "",
};

const GoalForm = ({ open, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    calories: "",
    userId: localStorage.getItem("userId"),
    startDate: "",
    endDate: "",
  });
  const [goals, setGoals] = useState([]);

  const handleAddGoal = () => {
    if (
      newGoal.name === "" ||
      newGoal.calories === "" ||
      newGoal.userId === "" ||
      newGoal.startDate === "" ||
      newGoal.endDate === ""
    ) {
      enqueueSnackbar("Please complete all the fields correctly.", {
        variant: "error",
      });
      return;
    } else {
      fetch("http://localhost:3001/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(newGoal),
      }).then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("The goal was created successfully.", {
            variant: "success",
          });
          closeModal();
        } else {
          enqueueSnackbar("An error occurred while creating the goal.", {
            variant: "error",
          });
        }
      });
    }
  };

  const closeModal = () => {
    setOpen(false);
    setNewGoal(initialGoalState);
  };

  const handleCaloriesInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewGoal({ ...newGoal, calories: inputValue });
    } else {
      setNewGoal({ ...newGoal, calories: "" });
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
          p: 5,
          borderRadius: "2%",
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
        <div>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleAddGoal();
              }
            }}
          />

          <TextField
            InputProps={{
              inputProps: { min: 1 },
            }}
            label="Goal (calories)"
            type="number"
            variant="outlined"
            fullWidth
            value={newGoal.weight}
            onChange={(e) => handleCaloriesInputChange(e)}
            style={{ marginBottom: "7px" }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleAddGoal();
              }
            }}
          />

          <Grid item xs={12}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disablePast
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 60,
                  }}
                  style={{ marginBottom: "7px" }}
                  value={newGoal.startDate}
                  onChange={(newDate) =>
                    setNewGoal({ ...newGoal, startDate: newDate })
                  }
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disablePast
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 60,
                  }}
                  value={newGoal.endDate}
                  onChange={(newDate) =>
                    setNewGoal({ ...newGoal, endDate: newDate })
                  }
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGoal}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
            }}
            fullWidth
          >
            Add Goal
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default GoalForm;
