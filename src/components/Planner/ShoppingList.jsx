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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

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
    if (response.status === 401) {
      // Token ha expirado, desloguear al usuario
      localStorage.removeItem("token");
      localStorage.setItem("sessionExpired", "true");
      window.location.href = "/";
      return;
    }
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
    const quantityToBuy = parseFloat(purchaseAmount[foodId]);
    if (quantityToBuy <= 0) {
      enqueueSnackbar("The purchased amount must be greater than 0", {
        variant: "error",
      });
      return;
    }

    const purchaseData = {
      foodId,
      quantityToBuy,
    };

    fetch(apiUrl + "/api/shoppingList", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(purchaseData),
    })
      .then((response) => {
        if (response.status === 401) {
          // Token ha expirado, desloguear al usuario
          localStorage.removeItem("token");
          localStorage.setItem("sessionExpired", "true");
          window.location.href = "/";
          return;
        }
        response.json();
        if (response.status === 400) {
          enqueueSnackbar("Quantity to buy exceeds the weight consumed", {
            variant: "error",
          });
        }
      })
      .then((data) => {
        handleGetShoppingList();
      })
      .catch((error) => {
        console.error("Error submitting purchase data: ", error);
        enqueueSnackbar("Error submitting quantity data", {
          variant: "error",
        });
      });
    setPurchaseAmount((prevState) => ({
      ...prevState,
      [foodId]: 0,
    }));
  };

  const handleResetQuantities = () => {
    setIsLoading(true);
    fetch(apiUrl + "/api/shoppingList/reset", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.status === 401) {
          // Token ha expirado, desloguear al usuario
          localStorage.removeItem("token");
          localStorage.setItem("sessionExpired", "true");
          window.location.href = "/";
          return;
        }
        response.json();
      })
      .then((data) => {
        handleGetShoppingList();
        enqueueSnackbar("Quantities to buy reset successfully", {
          variant: "success",
        });
        setIsLoading(false);
        setResetDialogOpen(false);
      })
      .catch((error) => {
        setIsLoading(false);
        enqueueSnackbar("Error resetting quantities to buy", {
          variant: "error",
        });
      });
  };

  const downloadShoppingList = () => {
    const header = "Food,Quantity to Buy\n";
    const rows = Object.keys(weeklyTotalConsumed)
      .map((foodId) => {
        const food = weeklyTotalConsumed[foodId];
        return `${food.foodId.name},${
          food.weightConsumed - food.quantityToBuy
        }`;
      })
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + header + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "shopping_list.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the file
    document.body.removeChild(link); // Clean up
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
                    secondary={`Purchased: ${
                      weeklyTotalConsumed[foodId].quantityToBuy || 0
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
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={downloadShoppingList}>
            Download Shopping List
          </Button>
          <Button variant="contained" onClick={() => setResetDialogOpen(true)}>
            Reset Food Amounts
          </Button>
        </Box>
        <Dialog
          open={resetDialogOpen}
          onClose={() => setResetDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Reset"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to reset the quantities to buy for all
              foods?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleResetQuantities} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
}
