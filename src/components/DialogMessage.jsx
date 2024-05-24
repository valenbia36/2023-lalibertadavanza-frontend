import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DialogMessage({ open, setOpen, ingredients }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {console.log(ingredients)}
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">{"Ingredients"}</DialogTitle>
        <DialogContent>
          {ingredients.map((ingredient, index) => (
            <DialogContentText key={index} id="alert-dialog-description">
              {`- ${ingredient.foodId} - ${ingredient.weightConsumed} gr/ml`}
            </DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
