import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import MealForm from "../Forms/MealForm";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import getApiUrl from "../../helpers/apiConfig";
import { CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
const apiUrl = getApiUrl();

function Row(props) {
  const { row, onEditClick } = props;
  const [open, setOpen] = React.useState(false);
  const [isModalRecipeOpen, setIsModalRecipeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteClick = (meal) => {
    try {
      setIsLoading(true);
      fetch(apiUrl + "/api/meals/" + meal._id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("The meal was deleted successfully.", {
            variant: "success",
          });

          props.onDelete(meal);

          // Adjust page if necessary
          if (props.endIndex >= props.totalMeals - 1) {
            const newPage = props.page === 0 ? 0 : props.page - 1;
            props.onPageChange(newPage);
          }
        } else {
          enqueueSnackbar("An error occurred while deleting the meal.", {
            variant: "error",
          });
        }
      });
      setIsLoading(false);
    } catch (error) {
      enqueueSnackbar("An error occurred while deleting the meal.", {
        variant: "error",
      });
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset", height: "79px" } }}>
        <TableCell
          width={5}
          align="center"
          sx={{ textAlign: "center" }}
          style={{ width: 160, border: "1px solid #ddd", padding: "6px" }}
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          align="center"
          style={{ width: 160, border: "1px solid #ddd", padding: "6px" }}
        >
          {row.name}
        </TableCell>
        <TableCell
          align="center"
          style={{ width: 160, border: "1px solid #ddd", padding: "6px" }}
        >
          {row.date}
        </TableCell>
        <TableCell
          align="center"
          style={{ width: 160, border: "1px solid #ddd", padding: "6px" }}
        >
          {row.hour}
        </TableCell>
        {
          <TableCell
            align="center"
            style={{ width: 160, border: "1px solid #ddd", padding: "6px" }}
          >
            <IconButton
              aria-label="edit row"
              size="small"
              onClick={() => onEditClick(row)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete row"
              size="small"
              disabled={isLoading}
              onClick={() => handleDeleteClick(row)}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        }
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Calories
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Carbs
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Proteins
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Fats
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Weight (gr/ml)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.foods.map((foodRow) => (
                    <TableRow key={foodRow._id}>
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        style={{
                          width: 160,
                          border: "1px solid #ddd",
                          padding: "6px",
                        }}
                      >
                        {foodRow.foodId.name}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          width: 160,
                          border: "1px solid #ddd",
                          padding: "6px",
                        }}
                      >
                        {foodRow.caloriesPerFood}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          width: 160,
                          border: "1px solid #ddd",
                          padding: "6px",
                        }}
                      >
                        {foodRow.carbsPerFood}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          width: 160,
                          border: "1px solid #ddd",
                          padding: "6px",
                        }}
                      >
                        {foodRow.proteinsPerFood}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          width: 160,
                          border: "1px solid #ddd",
                          padding: "6px",
                        }}
                      >
                        {foodRow.fatsPerFood}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          width: 160,
                          border: "1px solid #ddd",
                          padding: "6px",
                        }}
                      >
                        {foodRow.weightConsumed}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "bold" }}
                      style={{
                        width: 160,
                        border: "1px solid #ddd",
                        padding: "6px",
                      }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        width: 160,
                        border: "1px solid #ddd",
                        padding: "6px",
                      }}
                    >
                      {row.totalCalories}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        width: 160,
                        border: "1px solid #ddd",
                        padding: "6px",
                      }}
                    >
                      {row.totalCarbs}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        width: 160,
                        border: "1px solid #ddd",
                        padding: "6px",
                      }}
                    >
                      {row.totalProteins}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        width: 160,
                        border: "1px solid #ddd",
                        padding: "6px",
                      }}
                    >
                      {row.totalFats}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rowsPerPage = 5;

export default function MealTable({ modalOpen }) {
  const [page, setPage] = useState(0);
  const [meals, setMeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMeal, setEditMeal] = useState(null);
  const [totalMeals, setTotalMeals] = useState(0);
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);
  const theme = useTheme();

  const rowsPerPage = 5; // Asumiendo un número de filas por página

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  useEffect(() => {
    getMeals();
  }, [isModalOpen, modalOpen, page]);

  const getMeals = async () => {
    setIsLoadingMeals(true); // Activar el spinner

    try {
      const response = await fetch(apiUrl + "/api/meals/user/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await response.json();
      const mealsWithShortenedDates = data.data.map((meal) => {
        return {
          ...meal,
          date: meal.date.substring(0, 10),
        };
      });
      setMeals(mealsWithShortenedDates);
      setTotalMeals(mealsWithShortenedDates.length);
    } catch (error) {
      console.error("Error fetching meals:", error);
      // Manejar errores aquí si es necesario
    } finally {
      setIsLoadingMeals(false); // Desactivar el spinner
    }
  };

  const handleEditClick = (meal) => {
    setEditMeal(meal);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = (deletedMeal) => {
    const updatedMeals = meals.filter((meal) => meal._id !== deletedMeal._id);
    setMeals(updatedMeals);
    setTotalMeals(updatedMeals.length); // Update totalMeals
    // Adjust page if necessary
    if (page > 0 && updatedMeals.length <= rowsPerPage * page) {
      setPage(page - 1);
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ overflowX: "auto", minHeight: "512px", position: "relative" }}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "grey.200" }}
            />
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "grey.200" }}
            >
              Name
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "grey.200" }}
            >
              Date&nbsp;
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "grey.200" }}
            >
              Hours&nbsp;
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "grey.200" }}
            >
              Actions&nbsp;
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ textAlign: "center" }}>
          {isLoadingMeals ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ padding: "20px" }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : meals.length > 0 ? (
            meals
              .slice(startIndex, endIndex)
              .map((row) => (
                <Row
                  key={row._id}
                  row={row}
                  sx={{ textAlign: "center" }}
                  onEditClick={handleEditClick}
                  onDelete={handleDelete}
                  page={page}
                  endIndex={endIndex}
                  totalMeals={totalMeals}
                  onPageChange={handlePageChange}
                />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ padding: "10px" }}>
                No meals to show
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          padding: "8px", // Reducir padding para reducir el espacio
          backgroundColor: "white", // O el color que desees
          borderTop: "1px solid #ddd",
        }}
      >
        <IconButton
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          sx={{ color: theme.palette.primary.main }} // Utilizar theme aquí
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={() => handlePageChange(page + 1)}
          disabled={endIndex >= totalMeals}
          sx={{ color: theme.palette.primary.main }} // Utilizar theme aquí
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      <MealForm
        open={isModalOpen}
        setOpen={setIsModalOpen}
        initialData={editMeal}
      />
    </TableContainer>
  );
}
