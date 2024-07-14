import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";
import { useSnackbar } from "notistack";

const apiUrl = getApiUrl();

export function ShoppingList({ open, setOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [purchaseAmount, setPurchaseAmount] = useState({});
  const [weeklyTotalConsumed, setWeeklyTotalConsumed] = useState({});

  useEffect(() => {
    if (open) {
      handleGetShoppingList();
    }
  }, [open]);

  const closeModal = () => {
    setOpen(false);
  };

  const handleGetShoppingList = async () => {
    setIsLoading(true);
    const response = await fetch(apiUrl + "/api/shoppingList", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setWeeklyTotalConsumed(data.shoppingList.weeklyTotal);
    setIsLoading(false);
  };

  const handlePurchaseChange = (event, foodId) => {
    const { value } = event.target;
    const updatedPurchaseAmount = {
      ...purchaseAmount,
      [foodId]: value,
    };
    setPurchaseAmount(updatedPurchaseAmount);
  };

  const handlePurchaseSubmit = (foodId) => {
    const purchaseData = {
      foodId,
      quantityToBuy: purchaseAmount[foodId] || 0,
    };
    console.log(purchaseAmount);
    // Send purchaseData to the backend API
    fetch(apiUrl + "/api/shoppingList", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(purchaseData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Purchase data submitted: ", data);
        // Optionally, refresh the list after submission
        handleGetShoppingList();
      })
      .catch((error) => {
        console.error("Error submitting purchase data: ", error);
        enqueueSnackbar("Error submitting quantity data", {
          variant: "erro",
        });
      });
    setPurchaseAmount(0);
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "70%", lg: "60%", xl: "50%" },
          maxWidth: "600px",
          bgcolor: "background.paper",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: 24,
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: "8px",
        }}
      >
        <IconButton
          aria-label="Close"
          onClick={closeModal}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <Typography variant="h6" gutterBottom>
              Weekly Total:
            </Typography>
            <List>
              {Object.keys(weeklyTotalConsumed).map((foodId) => (
                <ListItem
                  key={foodId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: { xs: "wrap", md: "nowrap" },
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={`${weeklyTotalConsumed[foodId].foodId.name}: ${
                      weeklyTotalConsumed[foodId].weightConsumed -
                      weeklyTotalConsumed[foodId].quantityToBuy
                    } grams/ml`}
                    sx={{
                      flex: { xs: "1 1 100%", md: "0 0 auto" },
                      mb: { xs: 1, md: 0 },
                      mr: { md: 2 },
                    }}
                  />
                  {weeklyTotalConsumed[foodId].weightConsumed -
                    weeklyTotalConsumed[foodId].quantityToBuy >
                    0 && (
                    <TextField
                      label="Purchased Amount"
                      type="number"
                      onChange={(event) =>
                        handlePurchaseChange(
                          event,
                          weeklyTotalConsumed[foodId].foodId
                        )
                      }
                      sx={{
                        flex: { xs: "1 1 100%", md: "0 0 auto" },
                        mb: { xs: 1, md: 0 },
                        mr: { md: 2 },
                      }}
                    />
                  )}
                  {weeklyTotalConsumed[foodId].weightConsumed -
                    weeklyTotalConsumed[foodId].quantityToBuy >
                    0 && (
                    <Button
                      variant="contained"
                      onClick={() =>
                        handlePurchaseSubmit(weeklyTotalConsumed[foodId])
                      }
                      sx={{ flex: { xs: "1 1 100%", md: "0 0 auto" } }}
                    >
                      Submit
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>
          </div>
        )}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="contained" type="submit" aria-label="save">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
