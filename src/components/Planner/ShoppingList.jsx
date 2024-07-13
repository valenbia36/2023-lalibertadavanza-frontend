import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  Grid,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../../helpers/apiConfig";

const apiUrl = getApiUrl();
export function ShoppingList({ open, setOpen }) {
  useEffect(() => {
    handleGetShoppingList();
  }, [open]);
  const closeModal = () => {
    setOpen(false);
  };
  const [purchaseAmount, setPurchaseAmount] = useState({});
  const [weeklyTotalConsumed, setweeklyTotalConsumed] = useState({});
  const handleGetShoppingList = async () => {
    const response = await fetch(apiUrl + "/api/shoppingList", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setweeklyTotalConsumed(data.shoppingList.weeklyTotal);
    console.log(data);
  };

  const handlePurchaseChange = (event, foodName) => {
    const { value } = event.target;
    const updatedPurchaseAmount = {
      ...purchaseAmount,
      [foodName]: value,
    };
    setPurchaseAmount(updatedPurchaseAmount);
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
          width: "100%",
          maxWidth: 580,
          bgcolor: "background.paper",
          maxHeight: "80vh !important",
          overflowY: "auto !important",
          boxShadow: 24,
          p: 5,
          borderRadius: "2%",
        }}
      >
        <IconButton
          aria-label="Close"
          onClick={closeModal}
          sx={{
            position: "absolute",
            top: "3%",
            right: "10px",
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
        <div>
          <Typography variant="h6" gutterBottom>
            Weekly Total:
          </Typography>
          <List>
            {Object.keys(weeklyTotalConsumed).map((index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${weeklyTotalConsumed[index].foodId.name}: ${weeklyTotalConsumed[index].weightConsumed} grams/ml`}
                />
                {console.log(weeklyTotalConsumed)}
                <TextField
                  label="Purchased Amount"
                  type="number"
                  value={purchaseAmount[index] || ""}
                  onChange={(event) => handlePurchaseChange(event, index)}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Box>
    </Modal>
  );
}
