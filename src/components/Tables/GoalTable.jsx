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
import Modal from "@mui/material/Modal";
import getApiUrl from "../../helpers/apiConfig";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import GoalForm from "../../components/Forms/GoalForm";

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

export default function GoalTable() {
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = React.useState(0);
  const [noResults, setNoResults] = useState(false);
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    handleGetGoals();
  }, [goals]);

  const handleGetGoals = async () => {
    const response = await fetch(
      apiUrl + "/api/goals/" + localStorage.getItem("userId"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const data = await response.json();
    setGoals(data.data);
    setTotalItems(data.data.length);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowClick = (goal) => {
    setSelectedGoal(goal);
  };

  const calculateGoalStatus = (goal) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const goalStartDate = new Date(goal.startDate);
    goalStartDate.setHours(0, 0, 0, 0);

    const goalEndDate = new Date(goal.endDate);
    goalEndDate.setHours(0, 0, 0, 0);

    if (today < goalStartDate) {
      return "Not started";
    } else if (today >= goalStartDate && today <= goalEndDate) {
      return "In progress";
    } else {
      return "Expired";
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 200, minHeight: 500 }}
          aria-label="custom pagination table"
        >
          <TableHead sx={{ fontWeight: "bold" }}>
            <TableRow sx={{ fontWeight: "bold" }}>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Start Date <br />
                End Date
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                Goal/Progress
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noResults ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              (5 > 0 ? goals.slice(page * 5, page * 5 + 5) : goals).map(
                (row) => (
                  <TableRow key={row.name} onClick={() => handleRowClick(row)}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: 160 }}
                      align="center"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell style={{ width: 150 }} align="center">
                      {`${row.startDate.split("T")[0]}`}
                      <br />
                      {`${row.endDate.split("T")[0]}`}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="center">
                      {`${row.calories}/...`}
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

      <Modal open={selectedGoal !== null} onClose={() => setSelectedGoal(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 5,
            borderRadius: "2%",
          }}
        >
          <IconButton
            aria-label="Close"
            onClick={() => setSelectedGoal(null)}
            sx={{
              position: "absolute",
              top: "3%",
              right: "10px",
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedGoal && (
            <div>
              <h2>Detalles del Objetivo: {selectedGoal.name}</h2>
              <p>Estado: {calculateGoalStatus(selectedGoal)}</p>
              <p>Fecha de Inicio: {selectedGoal.startDate.split("T")[0]}</p>
              <p>Fecha de Finalización: {selectedGoal.endDate.split("T")[0]}</p>
              {calculateGoalStatus(selectedGoal) == "Not started" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsModalOpen(true)}
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "#373D20",
                    "&:hover": { backgroundColor: "#373D20" },
                    fontWeight: "bold",
                  }}
                  fullWidth
                >
                  Edit Goal
                </Button>
              )}
              <GoalForm
                open={isModalOpen}
                setOpen={setIsModalOpen}
                initialData={selectedGoal}
              />
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
