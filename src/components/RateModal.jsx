import React, { useState } from "react";
import { Button, Modal, Box, IconButton, Rating } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../helpers/apiConfig";
import { useSnackbar } from "notistack";
const apiUrl = getApiUrl();
export default function RateModal({ open, setOpen, row, setLoaded }) {
  const [value, setValue] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const [userRatings, setUserRatings] = useState({});
  const [userRatedRecipes, setUserRatedRecipes] = useState(new Set());
  const handleRatingChange = async (recipeId, newRating) => {
    try {
      // Verificar si el usuario ya calificó esta receta
      /* if (userRatedRecipes.has(recipeId)) {
        console.log("Ya has calificado esta receta");
        return;
      } */

      // Llamar al endpoint para agregar la calificación
      setIsLoading(true);
      const response = await fetch(apiUrl + `/api/recipes/rate/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          rate: newRating,
          id: recipeId,
        }),
      }).then(function (response) {
        if (response.status === 401) {
          // Token ha expirado, desloguear al usuario
          localStorage.removeItem("token");
          localStorage.setItem("sessionExpired", "true");
          window.location.href = "/";
          return;
        }
        if (response.status === 200) {
          enqueueSnackbar("Rate was added successfully", {
            variant: "success",
          });
        } else if (response.status === 401) {
          enqueueSnackbar("You have already rate this recipe", {
            variant: "error",
          });
        } else {
          enqueueSnackbar("An error occurred while saving the rating.", {
            variant: "error",
          });
        }
      });
      //const data = await response.json();
      setIsLoading(false);
      setLoaded(true);
    } catch (error) {
      // Manejar el error según tus necesidades
    }
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
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
          maxWidth: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "2%",
        }}
      >
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />
        <IconButton
          aria-label="Close"
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            top: "3%",
            right: "10px",
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: "#373D20",
            "&:hover": { backgroundColor: "#373D20" },
            fontWeight: "bold",
          }}
          fullWidth
          onClick={() => {
            handleRatingChange(row._id, value);
            setValue(0);
            setOpen(false);
          }}
          disabled={isLoading}
        >
          Rate
        </Button>
      </Box>
    </Modal>
  );
}
