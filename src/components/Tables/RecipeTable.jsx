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
import RecipeForm from "../Forms/Recipe/RecipeForm";
import PicsModal from "../Forms/Recipe/PicsModal";
import SearchBar from "../SearchBar";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import RateModal from "../RateModal";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DialogMessage from "../DialogMessage";

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

export default function RecipeTable({ filterOpen, modalOpen, setModalOpen }) {
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
  const [openDialog, setDialogOpen] = useState(false);

  const filteredRecipes = recipes.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  useEffect(() => {
    setNoResults(filteredRecipes.length === 0);
  }, [filteredRecipes]);

  const getRecipes = async () => {
    const response = await fetch(apiUrl + "/api/recipes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    const sortedRecipes = data.data.sort((a, b) => {
      const ratingA = calculateAverageRating(a.ratings);
      const ratingB = calculateAverageRating(b.ratings);
      return ratingB - ratingA; // Sort in descending order
    });

    setRecipes(data.data);
    setTotalItems(data.data.length);
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
    setDialogOpen(true);
  };
  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: "100%",
        margin: "auto",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
      }}
    >
      <SearchBar setSearchQuery={handleSearch} />
      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", minHeight: "450px", minWidth: "200px" }}
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
                Ingredients
              </TableCell>
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
              (filteredRecipes && 5 > 0
                ? filteredRecipes.slice(page * 5, page * 5 + 5)
                : filteredRecipes
              ).map((row) => (
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
                      value={calculateAverageRating(row.ratings)}
                      precision={0.5}
                      readOnly={true}
                    />
                    {!row.ratings.find(
                      (rating) =>
                        rating.userId === localStorage.getItem("userId")
                    ) && (
                      <IconButton
                        aria-label="edit row"
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

                  <TableCell align="center">
                    {row.creator === localStorage.getItem("userId") ? (
                      <IconButton
                        aria-label="edit row"
                        size="small"
                        onClick={() => handleEditClick(row)}
                      >
                        <EditIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="edit row"
                        size="small"
                        onClick={() => handleEditClick(row)}
                        disabled
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="edit row"
                      size="small"
                      onClick={() => setDialogOpen(true)}
                    >
                      <ReceiptLongIcon />
                    </IconButton>
                    <DialogMessage
                      open={openDialog}
                      setOpen={setDialogOpen}
                      ingredients={row.ingredients}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      aria-label="edit row"
                      size="small"
                      onClick={() => handleInfoClick(row)}
                    >
                      <InfoIcon />
                    </IconButton>
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
          setRecipeOpen={setIsModalRecipeOpen}
          initialData={editMeal}
          foodModal={isModalFoodOpen}
          setOpenFoodModal={setIsModalFoodOpen}
        />
        <PicsModal
          open={isPicModalOpen}
          setOpen={setIsPicModalOpen}
          initialData={infoMeal}
        />
        <RateModal
          open={isRateModalOpen}
          setOpen={setIsRateModalOpen}
          row={selectedRow}
        />
      </TableContainer>
    </div>
  );
}
