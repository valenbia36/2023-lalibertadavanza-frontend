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
import MealForm from "../MealForm";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";

function Row(props) {
  const { row, onEditClick } = props;
  const [open, setOpen] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteClick = (meal) => {
    try {
      fetch("http://localhost:3001/api/meals/" + meal._id, {
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

          // Actualizamos la lista de comidas después de la eliminación
          props.onDelete(meal);

          // Verificamos si la página actual queda vacía
          if (props.endIndex >= props.totalMeals - 1) {
            // Si la página actual queda vacía, cambiamos a la página anterior o a la primera página
            const newPage = props.page === 0 ? 0 : props.page - 1;
            props.onPageChange(newPage);
          }
        } else {
          enqueueSnackbar("An error occurred while deleting the meal.", {
            variant: "error",
          });
        }
      });
    } catch (error) {
      enqueueSnackbar("An error occurred while deleting the meal.", {
        variant: "error",
      });
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {row.name}
        </TableCell>
        <TableCell align="center">{row.calories}</TableCell>
        <TableCell align="center">{row.date}</TableCell>
        <TableCell align="center">{row.hour}</TableCell>
        <TableCell align="center">
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
            onClick={() => handleDeleteClick(row)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Calories</TableCell>
                    <TableCell align="center">Weight (gr/ml)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.foods.map((foodRow) => (
                    <TableRow key={foodRow.name}>
                      <TableCell component="th" scope="row" align="center">
                        {foodRow.name}
                      </TableCell>
                      <TableCell align="center">{foodRow.totalCalories}</TableCell>
                      <TableCell align="center">{foodRow.weightConsumed}</TableCell>
                    </TableRow>
                  ))}
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

export default function MealTable() {
  const [page, setPage] = useState(0);
  const [meals, setMeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMeal, setEditMeal] = useState(null);
  const [totalMeals, setTotalMeals] = useState(0);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  useEffect(() => {
    getMeals();
  }, [meals]);

  const getMeals = async () => {
    const response = await fetch(
      "http://localhost:3001/api/meals/user/" + localStorage.getItem("userId"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();

    const mealsWithShortenedDates = data.data.map((meal) => {
      return {
        ...meal,
        date: meal.date.substring(0, 10),
      };
    });

    setMeals(mealsWithShortenedDates);
    setTotalMeals(mealsWithShortenedDates.length);
  };

  const handleEditClick = (meal) => {
    setEditMeal(meal);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = (deletedMeal) => {
    setMeals(meals.filter((meal) => meal._id !== deletedMeal._id));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Total Calories
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Date&nbsp;
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Hours&nbsp;
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Actions&nbsp;
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ textAlign: "center" }}>
          {meals.length > 0 ? (
            meals
              .slice(startIndex, endIndex)
              .map((row) => (
                <Row
                  key={row.name}
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
              <TableCell colSpan={5} align="center">
                No meals to show
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div>
        <IconButton
          onClick={(e) => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={(e) => handlePageChange(page + 1)}
          disabled={endIndex >= totalMeals}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>

      <MealForm
        open={isModalOpen}
        setOpen={setIsModalOpen}
        initialData={editMeal}
      />
    </TableContainer>
  );
}
