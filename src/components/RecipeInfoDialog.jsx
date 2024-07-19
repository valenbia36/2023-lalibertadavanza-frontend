import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
} from "@mui/material";

const RecipeInfoDialog = ({ open, onClose, recipe }) => {
  if (!recipe) return null; // Si no hay receta, no renderiza nada
  console.log(recipe);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Recipe Information</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          {recipe.name}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Steps:</strong>
        </Typography>
        <List>
          {recipe.steps.map((step) => (
            <ListItem key={step._id}>
              <Typography>{step.text}</Typography>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeInfoDialog;
