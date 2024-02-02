//Aca guardo lo que estaba reemplazando
//Esto es el nameField
{
  /* <Grid item xs={12}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={mealData.name}
              onChange={(e) =>
                setMealData({ ...mealData, name: e.target.value })
              }
            />
          </Grid> */
}

//Esto es StepField
{
  /* <Grid item xs={10}>
                <TextField
                  id={`step-${index}`}
                  label={`Step ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  value={mealData.steps[index].text}
                  onChange={(e) =>
                    handleStepChange(
                      index,
                      e.target.value,
                      mealData.steps[index].images
                    )
                  }
                />
              </Grid> */
}
//Add button
{
  /* {index === 0 && (
                <Grid
                  item
                  xs={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconButton color="primary" onClick={handleAddStepInput}>
                    <AddCircleRoundedIcon />
                  </IconButton>
                </Grid>
              )} */
}
{
  /* {index === 0 && (
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconButton color="primary" onClick={handleAddFoodInput}>
                    <AddCircleRoundedIcon />
                  </IconButton>
                </Grid>
              )} */
}

//Add meal Button
{
  /* <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddMeal}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#373D20",
                "&:hover": { backgroundColor: "#373D20" },
                fontWeight: "bold",
              }}
              fullWidth
            >
              {initialData ? "Update Meal" : "Add Meal"}
            </Button>
          </Grid> */
}
//Remove Button
{
  /* {index > 0 && (
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleRemoveFoodInput(index)}
                  >
                    <RemoveCircleRoundedIcon />
                  </IconButton>
                </Grid>
              )} */
}
{/* index > 0 && (
  <Grid
    item
    xs={1}
    sx={{ display: "flex", alignItems: "center" }}
  >
    <IconButton
      color="primary"
      onClick={() => handleRemoveStepInput(index)}
    >
      <RemoveCircleRoundedIcon />
    </IconButton>
  </Grid>
)} */

//Food autocomplete
{/* <Grid item xs={6}>
                <Autocomplete
                  id={`food-autocomplete-${index}`}
                  options={foodOptions}
                  value={
                    foodOptions.find((option) => option.name === food.name) ||
                    null
                  }
                  onChange={(e, newValue) =>
                    handleFoodInputChange(newValue, index)
                  }
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Food"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                  noOptionsText="No foods available."
                  ListboxProps={{
                    style: {
                      maxHeight: 110,
                    },
                  }}
                />
              </Grid> */}