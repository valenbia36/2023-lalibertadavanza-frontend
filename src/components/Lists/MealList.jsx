import React, { useState } from "react";
import { IconButton, Tooltip, Typography, Button } from "@mui/material";
import MealForm from "../Forms/MealForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import MealTable from "../Tables/MealTable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";

const MealList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const navigatePlanerScreen = () => {
    navigate("/myPlanner", { replace: true });
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "250px", color: "black" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="2%"
      >
        MEALS TABLE
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Alinea los elementos al centro horizontalmente
          maxWidth: "100%",
          marginBottom: "10px", // Agregamos margen inferior para separar del resto del contenido
        }}
      >
        <MealTable modalOpen={isModalOpen} />
      </div>
      <React.Fragment>
        <MealForm open={isModalOpen} setOpen={setIsModalOpen} />
      </React.Fragment>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {" "}
        {/* Estilo de flexbox para centrar los botones */}
        <IconButton
          onClick={() => {
            setIsModalOpen(true);
          }}
          style={{ marginRight: "10px" }} // Agregamos margen a la derecha para separar los botones
        >
          <AddCircleRoundedIcon fontSize="small" />{" "}
          {/* Definimos un tamaño más pequeño */}
        </IconButton>
        <Tooltip title="Plan Meals">
          <Button
            variant="contained"
            size="small" // Definimos un tamaño más pequeño para el botón
            endIcon={
              <IconButton
                size="small" // Definimos un tamaño más pequeño para el icono
              >
                <CalendarMonthIcon />
              </IconButton>
            }
            onClick={() => {
              navigatePlanerScreen();
            }}
          >
            Plan your Meals
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default MealList;
