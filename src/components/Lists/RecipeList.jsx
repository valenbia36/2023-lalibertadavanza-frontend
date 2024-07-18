import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import RecipeTable from "../Tables/RecipeTable";
import { useTheme } from "@mui/material/styles";

const RecipeList = () => {
  const [isModalRecipeOpen, setIsModalRecipeOpen] = useState(false);
  const [tableWidth, setTableWidth] = useState("100%");
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= theme.breakpoints.values.sm);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <Box
      sx={{
        textAlign: "center",
        color: "black",
        //maxWidth: "100%",
        margin: "auto",
        //bgcolor: "grey",
        //width: tableWidth,
        minWidth: isMobile ? 300 : 600,
        minHeight: 800,
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
          //overflowX: "auto",
          //margin: "auto",
          widht: "100%",
          minHeight: "100%",
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
