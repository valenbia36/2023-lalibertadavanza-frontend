import React, { useState } from "react";
import { TextField, Button, Modal, Box } from "@mui/material";
import { useSnackbar } from "notistack";

const initialCategoryState = {
  name: "",
};

const CategoryForm = ({ open, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [newCategory, setNewCategory] = useState(initialCategoryState);

  const handleAddCategory = () => {
    if (
      newCategory.name === ""
    ) {
      enqueueSnackbar("Please complete all the fields.", { variant: "error" });
      return;
    } else {
      fetch("http://localhost:3001/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(newCategory),
      }).then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("The category was created successfully.", {
            variant: "success",
          });
          closeModal();
        } else {
          enqueueSnackbar("An error occurred while creating the category.", {
            variant: "error",
          });
        }
      });
    }
  };

  const closeModal = () => {
    setOpen(false);
    setNewCategory(initialCategoryState);
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
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleAddCategory();
              }
            }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
            }}
            fullWidth
          >
            Add Category
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CategoryForm;