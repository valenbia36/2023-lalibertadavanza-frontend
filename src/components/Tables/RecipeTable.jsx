import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { TableHead } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import InfoIcon from "@mui/icons-material/Info";
import getApiUrl from "../../helpers/apiConfig";
import EditIcon from "@mui/icons-material/Edit";
import Rating from "@mui/material/Rating";

const apiUrl = getApiUrl();

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, onPageChange } = props;

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <ArrowForwardIosIcon />
        ) : (
          <ArrowBackIosIcon />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / 5) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <ArrowBackIosIcon />
        ) : (
          <ArrowForwardIosIcon />
        )}
      </IconButton>
    </Box>
  );
}

export default function RecipeTable({ filterOpen, modalOpen }) {
  const [recipes, setRecipes] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = React.useState(0);
  const [noResults, setNoResults] = useState(false);
  const [userRatings, setUserRatings] = useState({});
  const [userRatedRecipes, setUserRatedRecipes] = useState(new Set());

  function calculateAverageRating(ratingsArray) {
    if (!Array.isArray(ratingsArray) || ratingsArray.length === 0) {
      return 0; // Manejar el caso en que el array esté vacío o no sea un array
    }

    const totalRatings = ratingsArray.reduce((accumulator, ratingObj) => {
      return accumulator + ratingObj.rate;
    }, 0);

    return totalRatings / ratingsArray.length;
  }

  useEffect(() => {
    getRecipes();
  }, [recipes]);

  const getRecipes = async () => {
    const response = await fetch(apiUrl + "/api/recipes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setRecipes(data.data);
    setTotalItems(data.data.length);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleRatingChange = async (recipeId, newRating) => {
    try {
      // Verificar si el usuario ya calificó esta receta
      if (userRatedRecipes.has(recipeId)) {
        console.log("Ya has calificado esta receta");
        return;
      }
      console.log(localStorage.getItem("userId"));

      // Llamar al endpoint para agregar la calificación
      const response = await fetch(apiUrl + `/api/recipes/rate/${recipeId}`, {
        method: "POST",
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

      // Actualizar el estado de las calificaciones del usuario
      setUserRatedRecipes(new Set([...userRatedRecipes, recipeId]));

      // Puedes mantener la lógica anterior para actualizar el estado visual
      setUserRatings((prevRatings) => ({
        ...prevRatings,
        [recipeId]: newRating,
      }));
    } catch (error) {
      console.error("Error al calificar la receta", error);
      // Manejar el error según tus necesidades
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: "100%",
        margin: "auto",
        minHeight: "400px",
        overflowY: "auto",
      }}
    >
      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", minHeight: "450px" }}
      >
        <Table aria-label="custom pagination table">
          <TableHead sx={{ fontWeight: "bold" }}>
            <TableRow sx={{ fontWeight: "bold" }}>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Rating
              </TableCell>
              {
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              }
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Info
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noResults ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No results found.{" "}
                </TableCell>
              </TableRow>
            ) : (
              (5 > 0 ? recipes.slice(page * 5, page * 5 + 5) : recipes).map(
                (row) => (
                  <TableRow key={row.name}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: 160 }}
                      align="center"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: 160 }}
                      align="center"
                    >
                      <Rating
                        name={`rating-${row._id}`}
                        value={calculateAverageRating(row.ranking)}
                        onChange={(event, newRating) =>
                          handleRatingChange(row._id, newRating)
                        }
                        precision={0.5}
                        readOnly={modalOpen} // Set readOnly based on modalOpen
                      />
                    </TableCell>
                    {row.creator === localStorage.getItem("userId") && (
                      <TableCell align="center">
                        <IconButton aria-label="edit row" size="small">
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <IconButton aria-label="edit row" size="small">
                        <InfoIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TablePaginationActions
            count={totalItems}
            page={page}
            onPageChange={handleChangePage}
          />
        </Box>
      </TableContainer>
    </div>
  );
}
