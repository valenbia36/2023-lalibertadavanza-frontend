import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import RecipeTable from "../Tables/RecipeTable";

const RecipeList = () => {
  const [isModalRecipeOpen, setIsModalRecipeOpen] = useState(false);
  const [tableWidth, setTableWidth] = useState("100%");

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      // Ajusta el ancho de la tabla dependiendo del tamaño de la ventana
      if (windowWidth >= 1200) {
        setTableWidth("100%");
      } else {
        setTableWidth("1200px"); // Ajusta este valor según tus necesidades
      }
    };

    handleResize(); // Llama a la función una vez al inicio para establecer el ancho inicial

    window.addEventListener("resize", handleResize); // Agrega el event listener para manejar cambios de tamaño de ventana

    return () => {
      window.removeEventListener("resize", handleResize); // Limpia el event listener al desmontar el componente
    };
  }, []);

  return (
    <Box
      sx={{
        textAlign: "center",
        color: "black",
        //maxWidth: "100%",
        margin: "auto",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="0%"
      >
        RECIPES TABLE
      </Typography>
      <br />
      <Box
        sx={{
          overflowX: "auto",
          maxWidth: "100%",
          margin: "auto",
        }}
      >
        <RecipeTable
          modalOpen={isModalRecipeOpen}
          setModalOpen={setIsModalRecipeOpen}
          tableWidth={tableWidth} // Pasa el ancho de la tabla como prop
        />
      </Box>
    </Box>
  );
};

export default RecipeList;
