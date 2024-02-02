import React from "react";
import { TextField, Modal, Box, IconButton, Grid } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
export default function AddPhoto({
  index,
  handleImageArrayChange,
  handleRemoveImage,
}) {
  return (
    <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
      <form>
        <input
          accept=".jpeg, .png, .jpg"
          id={`icon-button-file-${index}`}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => handleImageArrayChange(e, index)}
        />
        <label htmlFor={`icon-button-file-${index}`}>
          <IconButton
            color="primary"
            component="span"
            onClick={() => handleRemoveImage(index)}
          >
            <AddPhotoAlternateIcon />
          </IconButton>
        </label>
      </form>
    </Grid>
  );
}
