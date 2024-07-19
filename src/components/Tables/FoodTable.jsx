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
import TableHead from "@mui/material/TableHead";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CategoryAutocomplete from "../CategoryAutocomplete";
import getApiUrl from "../../helpers/apiConfig";
import { CircularProgress } from "@mui/material";

const apiUrl = getApiUrl();
const initialSelectedCategoryState = {
  name: "",
};

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
        sx={{ color: theme.palette.primary.main }}
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
        sx={{ color: theme.palette.primary.main }}
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

export default function FoodTable({ filterOpen, modalOpen }) {
  const [foods, setFoods] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategoryState
  );
  const [page, setPage] = React.useState(0);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    selectedCategory && filterOpen ? getFoodByCategory() : getFoods();
  }, [selectedCategory, filterOpen]);

  useEffect(() => {
    if (!filterOpen) {
      setSelectedCategory(initialSelectedCategoryState);
      getFoods();
    }
  }, [filterOpen, modalOpen]);

  useEffect(() => {
    getFoods();
  }, []);

  const getFoods = async () => {
    setIsLoading(true);
    const response = await fetch(apiUrl + "/api/foods/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setNoResults(data.data.length === 0);
    setFoods(data.data);
    setTotalItems(data.data.length);
    setIsLoading(false);
  };

  const getFoodByCategory = async () => {
    setIsLoading(true);
    if (selectedCategory.name) {
      const response = await fetch(
        apiUrl + "/api/foods/category/" + selectedCategory.name,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setNoResults(data.data.length === 0);
      setFoods(data.data);
      setTotalItems(data.data.length);
    } else {
      getFoods();
    }
    setIsLoading(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(0);
  };

  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: "100%",
        margin: "auto",
        minHeight: "400px",
        overflowY: "auto",
        position: "relative", // Asegúrate de que el contenedor tenga posición relativa
        paddingBottom: "60px", // Ajusta esto según el alto de tus flechas de paginación
      }}
    >
      {filterOpen && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <CategoryAutocomplete
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      )}
      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
          minHeight: "450px",
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        <Table aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", bgcolor: "grey.200" }}
              >
                Name (gr/ml)
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", bgcolor: "grey.200" }}
              >
                Calories
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", bgcolor: "grey.200" }}
              >
                Carbs
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", bgcolor: "grey.200" }}
              >
                Proteins
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", bgcolor: "grey.200" }}
              >
                Fats
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", bgcolor: "grey.200" }}
              >
                Category
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ padding: "20px" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : noResults ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              (foods.length > 0
                ? foods.slice(page * 5, page * 5 + 5)
                : foods
              ).map((row) => (
                <TableRow key={row._id}>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      width: 160,
                      border: "1px solid #ddd",
                      paddingTop: "16px", // Padding en la parte superior
                      paddingBottom: "16px", // Padding en la parte inferior
                      paddingLeft: "8px", // Padding a la izquierda (ejemplo, ajustable)
                      paddingRight: "8px", // Padding a la derecha (ejemplo, ajustable)
                    }}
                    align="center"
                  >
                    {row.name + " " + row.weight + "(gr/ml)"}
                  </TableCell>
                  <TableCell
                    style={{
                      width: 160,
                      border: "1px solid #ddd",
                      paddingTop: "16px", // Padding en la parte superior
                      paddingBottom: "16px", // Padding en la parte inferior
                      paddingLeft: "8px", // Padding a la izquierda (ejemplo, ajustable)
                      paddingRight: "8px", // Padding a la derecha (ejemplo, ajustable)
                    }}
                    align="center"
                  >
                    {row.calories}
                  </TableCell>
                  <TableCell
                    style={{
                      width: 160,
                      border: "1px solid #ddd",
                      paddingTop: "16px", // Padding en la parte superior
                      paddingBottom: "16px", // Padding en la parte inferior
                      paddingLeft: "8px", // Padding a la izquierda (ejemplo, ajustable)
                      paddingRight: "8px", // Padding a la derecha (ejemplo, ajustable)
                    }}
                    align="center"
                  >
                    {row.carbs === "0" ? "-" : row.carbs}
                  </TableCell>
                  <TableCell
                    style={{
                      width: 160,
                      border: "1px solid #ddd",
                      paddingTop: "16px", // Padding en la parte superior
                      paddingBottom: "16px", // Padding en la parte inferior
                      paddingLeft: "8px", // Padding a la izquierda (ejemplo, ajustable)
                      paddingRight: "8px", // Padding a la derecha (ejemplo, ajustable)
                    }}
                    align="center"
                  >
                    {row.proteins === "0" ? "-" : row.proteins}
                  </TableCell>
                  <TableCell
                    style={{
                      width: 160,
                      border: "1px solid #ddd",
                      paddingTop: "16px", // Padding en la parte superior
                      paddingBottom: "16px", // Padding en la parte inferior
                      paddingLeft: "8px", // Padding a la izquierda (ejemplo, ajustable)
                      paddingRight: "8px", // Padding a la derecha (ejemplo, ajustable)
                    }}
                    align="center"
                  >
                    {row.fats === "0" ? "-" : row.fats}
                  </TableCell>
                  <TableCell
                    style={{
                      width: 160,
                      border: "1px solid #ddd",
                      paddingTop: "16px", // Padding en la parte superior
                      paddingBottom: "16px", // Padding en la parte inferior
                      paddingLeft: "8px", // Padding a la izquierda (ejemplo, ajustable)
                      paddingRight: "8px", // Padding a la derecha (ejemplo, ajustable)
                    }}
                    align="center"
                  >
                    {row.category.name}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Flechas de paginación fijas en la parte inferior */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            padding: "16px", // Reducir padding para reducir el espacio
            backgroundColor: "white", // O el color que desees
            borderTop: "1px solid #ddd",
          }}
        >
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
