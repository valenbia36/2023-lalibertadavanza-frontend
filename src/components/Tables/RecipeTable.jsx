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
import { TableHead, Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import InfoIcon from "@mui/icons-material/Info";
import getApiUrl from "../../helpers/apiConfig";
import EditIcon from "@mui/icons-material/Edit";
import Rating from "@mui/material/Rating";
import RecipeForm from "../Forms/Recipe/RecipeForm";
import PicsModal from "../Forms/Recipe/PicsModal";
import SearchBar from "../SearchBar";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import RateModal from "../RateModal";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DialogMessage from "../DialogMessage";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";

const apiUrl = getApiUrl();
const initialMealState = {
  name: "",
  date: new Date(),
  hour: new Date(),
  foods: [{ foodId: "", weightConsumed: "" }],
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

export default function RecipeTable({}) {
  const [recipes, setRecipes] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = React.useState(0);
  const [noResults, setNoResults] = useState(false);
  const [editMeal, setEditMeal] = useState(null);
  const [isModalRecipeOpen, setIsModalRecipeOpen] = useState(false);
  const [isModalFoodOpen, setIsModalFoodOpen] = useState(false);
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [infoMeal, setInfoMeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialogs, setOpenDialogs] = useState({});
  const [loaded, setLoaded] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [previousSearchQuery, setPreviousSearchQuery] = useState("");
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);

  const handleOpenForm = () => {
    setIsModalRecipeOpen(true);
    setEditMeal(null);
  };

  const filteredRecipes = recipes.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function calculateAverageRating(ratingsArray) {
    if (!Array.isArray(ratingsArray) || ratingsArray.length === 0) {
      return 0;
    }

    const totalRatings = ratingsArray.reduce((accumulator, ratingObj) => {
      return accumulator + ratingObj.rate;
    }, 0);

    return totalRatings / ratingsArray.length;
  }

  useEffect(() => {
    getRecipes();
    setLoaded(false);
  }, [isModalRecipeOpen, loaded]);

  useEffect(() => {
    if (previousSearchQuery !== searchQuery) {
      setPage(0);
      setPreviousSearchQuery(searchQuery);
    }
    setNoResults(filteredRecipes.length === 0);
    setTotalItems(filteredRecipes.length);
  }, [filteredRecipes, searchQuery, previousSearchQuery]);

  const getRecipes = async () => {
    setIsLoadingMeals(true);
    try {
      const response = await fetch(apiUrl + "/api/recipes/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (response.status === 401) {
        // Token ha expirado, desloguear al usuario
        localStorage.removeItem("token");
        localStorage.setItem("sessionExpired", "true");
        window.location.href = "/";
        return;
      }
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        // Ordena las recetas por rating
        const sortedRecipes = data.data.sort((a, b) => {
          const ratingA = calculateAverageRating(a.ratings);
          const ratingB = calculateAverageRating(b.ratings);
          return ratingB - ratingA;
        });

        setRecipes(sortedRecipes); // Actualiza el estado con las recetas ordenadas
      } else {
        setRecipes([]); // Establece un arreglo vacío si no hay datos
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      enqueueSnackbar("An error occurred while fetching recipes.", {
        variant: "error",
      });
    } finally {
      setIsLoadingMeals(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEditClick = (meal) => {
    setEditMeal(meal);
    setIsModalRecipeOpen(true);
  };

  const handleInfoClick = (meal) => {
    setInfoMeal(meal);
    setIsPicModalOpen(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleOpenDialog = (row) => {
    setSelectedRow(row);
    setOpenDialogs((prev) => ({ ...prev, [row._id]: true }));
  };

  const handleCloseDialog = () => {
    setOpenDialogs((prev) => ({ ...prev, [selectedRow._id]: false }));
  };

  const handleAddMeal = (meal) => {
    const fechaActual = new Date();
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const horaFormateada = `${horas < 10 ? "0" : ""}${horas}:${
      minutos < 10 ? "0" : ""
    }${minutos}`;
    if (meal && meal != []) {
      const mealToAdd = {
        name: meal.name,
        foods: meal.foods.map((food) => ({
          foodId: food.foodId._id,
          weightConsumed: food.weightConsumed,
        })),
        date: fechaActual,
        hour: horaFormateada,
      };
      setIsLoading(true);

      fetch(apiUrl + "/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(mealToAdd),
      })
        .then(function (response) {
          if (response.status === 401) {
            // Token ha expirado, desloguear al usuario
            localStorage.removeItem("token");
            localStorage.setItem("sessionExpired", "true");
            window.location.href = "/";
            return;
          }
          if (response.status === 200) {
            enqueueSnackbar("The meal was created successfully.", {
              variant: "success",
            });
          } else {
            enqueueSnackbar("An error occurred while saving the meal.", {
              variant: "error",
            });
          }
        })
        .catch(function (error) {
          enqueueSnackbar("An error occurred while saving the meal.", {
            variant: "error",
          });
        });
      setIsLoading(false);
    } else {
      setIsLoading(false);
      enqueueSnackbar("An error occurred while saving the meal.", {
        variant: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        //textAlign: "center",
        //margin: "auto",
        //display: "flex",
        //flexDirection: "column",
        //alignItems: "center",
        //overflowX: "auto",
        width: "100%",
        minHeight: "100%",
        //bgcolor: "blue", // Asegura que el contenedor ocupe todo el ancho disponible
      }}
    >
      <SearchBar setSearchQuery={handleSearch} />
      <TableContainer
        component={Paper}
        sx={{
          paddingBottom: "20px",
          marginTop: "20px",
          //width: "100%",
          //bgcolor: "red",
          width: "100%",
          minWidth: "100%",
          minHeight: "500px", // Asegura que el contenedor ocupe todo el ancho disponible
        }}
      >
        <Table
          aria-label="custom pagination table"
          sx={{
            "& .MuiTableCell-root": {
              textAlign: "center",
              fontWeight: "bold",
              padding: "8px",
            },
            "& .MuiTableCell-head": {
              backgroundColor: "#f5f5f5",
            },
            //width: "100%",
            //minHeight: "100%",
            //bgcolor: "yellow",
            minWidth: "100%",
            //height: "450px", // Asegura que la tabla ocupe todo el ancho disponible
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Ingredients</TableCell>
              <TableCell>Info</TableCell>
              <TableCell>Add to Meals</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingMeals ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : noResults ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              (filteredRecipes.length > 0
                ? filteredRecipes.slice(page * 5, page * 5 + 5)
                : filteredRecipes
              ).map((row) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>
                    <Rating
                      name={`rating-${row._id}`}
                      value={calculateAverageRating(row.ratings)}
                      precision={0.5}
                      readOnly
                    />
                    {row.ratings &&
                      !row.ratings.find(
                        (rating) =>
                          rating.userId.toString() ===
                          localStorage.getItem("userId")
                      ) && (
                        <IconButton
                          aria-label="rate recipe"
                          size="small"
                          onClick={() => {
                            setSelectedRow(row);
                            setIsRateModalOpen(true);
                          }}
                        >
                          <ThumbsUpDownIcon />
                        </IconButton>
                      )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit recipe"
                      size="small"
                      onClick={() => handleEditClick(row)}
                      disabled={row.creator !== localStorage.getItem("userId")}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="view ingredients"
                      size="small"
                      onClick={() => handleOpenDialog(row)}
                    >
                      <ReceiptLongIcon />
                    </IconButton>
                    <DialogMessage
                      open={openDialogs[row._id] || false}
                      setOpen={handleCloseDialog}
                      ingredients={row.foods}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="view info"
                      size="small"
                      onClick={() => handleInfoClick(row)}
                      disabled={
                        row.steps.length === 1 &&
                        row.steps[0].images.length === 0 &&
                        row.steps[0].text === ""
                      }
                    >
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Add Meal">
                      <IconButton
                        aria-label="add meal"
                        size="small"
                        onClick={() => handleAddMeal(row)}
                      >
                        <RestaurantIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
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
        <RecipeForm
          openRecipe={isModalRecipeOpen}
          setRecipeOpen={(value) => {
            setIsModalRecipeOpen(value);
            if (!value) {
              getRecipes();
            }
          }}
          initialData={editMeal}
          foodModal={isModalFoodOpen}
          setOpenFoodModal={(value) => {
            setIsModalFoodOpen(value);
            if (!value) {
              getRecipes();
            }
          }}
        />
        <PicsModal
          open={isPicModalOpen}
          setOpen={setIsPicModalOpen}
          initialData={infoMeal}
        />
        <RateModal
          open={isRateModalOpen}
          setOpen={(value) => {
            setIsRateModalOpen(value);
            if (!value) {
              getRecipes();
            }
          }}
          row={selectedRow}
          setLoaded={setLoaded}
        />
      </TableContainer>
      <IconButton onClick={handleOpenForm}>
        <AddCircleRoundedIcon />
      </IconButton>
    </Box>
  );
}
