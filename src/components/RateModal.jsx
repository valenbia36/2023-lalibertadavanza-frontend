import React, { useState } from "react";
import { Button, Modal, Box, IconButton, Rating } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../helpers/apiConfig";
const apiUrl = getApiUrl();
export default function RateModal({ open, setOpen, row, setLoaded }) {
  const [value, setValue] = React.useState(0);
  const [userRatings, setUserRatings] = useState({});
  const [userRatedRecipes, setUserRatedRecipes] = useState(new Set());
  const handleRatingChange = async (recipeId, newRating) => {
    try {
      // Verificar si el usuario ya calificó esta receta
      if (userRatedRecipes.has(recipeId)) {
        console.log("Ya has calificado esta receta");
        return;
      }
      console.log({
        rate: newRating,
        userId: localStorage.getItem("userId"),
        id: recipeId,
      });

      // Llamar al endpoint para agregar la calificación
      const response = await fetch(apiUrl + `/api/recipes/rate/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          rate: newRating,
          userId: localStorage.getItem("userId"),
          id: recipeId,
        }),
      });
      const data = await response.json();
      setLoaded(true);
    } catch (error) {
      console.error("Error al calificar la receta", error);
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
        >
          Rate
        </Button>
      </Box>
    </Modal>
  );
}
