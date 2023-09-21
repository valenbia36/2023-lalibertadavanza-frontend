import React, { useState } from 'react';
import { TextField, Button, Modal, Box, IconButton, Grid } from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';

const initialMealState = {
  name: '',
  date: '',
  hour: '',
  foods: [{ name: '', quantity: '' }], // Inicialmente, un solo campo de alimentos con cantidad
};

const MealForm = ({ open, setOpen }) => {
  const [newMeal, setNewMeal] = useState(initialMealState);
  const [errorMessage, setErrorMessage] = useState(false);

  const closeModal = () => {
    setOpen(false);
    // Restablecer los valores del estado al valor inicial
    setNewMeal(initialMealState);
  };

  const handleAddFoodInput = () => {
    // Agregar un nuevo campo de alimentos con cantidad
    const updatedFoods = [...newMeal.foods, { name: '', quantity: '' }];
    setNewMeal({ ...newMeal, foods: updatedFoods });
  };

  const handleRemoveFoodInput = (index) => {
    // Eliminar un campo de alimentos en el índice especificado
    const updatedFoods = [...newMeal.foods];
    updatedFoods.splice(index, 1);
    setNewMeal({ ...newMeal, foods: updatedFoods });
  };

  const handleFoodInputChange = (event, index) => {
    const updatedFoods = [...newMeal.foods];
    updatedFoods[index].name = event.target.value;
    setNewMeal({ ...newMeal, foods: updatedFoods });
  };

  const handleQuantityInputChange = (event, index) => {
    const updatedFoods = [...newMeal.foods];
    updatedFoods[index].quantity = event.target.value;
    setNewMeal({ ...newMeal, foods: updatedFoods });
  };

  const handleAddMeal = () => {
    if (newMeal.name === '') {
      setErrorMessage(true);
      return;
    } else {
      console.log(JSON.stringify(newMeal));
      fetch('http://localhost:3001/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(newMeal),
      })
        .then(function (response) {
          if (response.status === 200) {
            console.log('Se creó la comida');
            closeModal();
          } else {
            setErrorMessage(true);
            console.log('Hubo un error creando la comida');
          }
        })
        .catch(function (error) {
          console.error('Error:', error);
          setErrorMessage(true);
        });
    }
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
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
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
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
          />
          <TextField
            label="Date (DD/MM/AAAA)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newMeal.date}
            onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
          />
          <TextField
            label="Hour (MM:HH)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newMeal.hour}
            onChange={(e) => setNewMeal({ ...newMeal, hour: e.target.value })}
          />

          {newMeal.foods.map((food, index) => (
            <Grid container spacing={1} alignItems="center" key={index}>
              <Grid item xs={7}>
                <TextField
                  label={`Food ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={food.name}
                  onChange={(e) => handleFoodInputChange(e, index)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label={`Quantity ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={food.quantity}
                  onChange={(e) => handleQuantityInputChange(e, index)}
                />
              </Grid>
              {index > 0 && (
                <Grid item xs={2}>
                  <IconButton
                    color="primary"
                    onClick={() => handleRemoveFoodInput(index)}
                  >
                    <RemoveCircleRoundedIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}

          <IconButton
            color="primary"
            onClick={handleAddFoodInput}
          >
            <AddCircleRoundedIcon />
          </IconButton>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMeal}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#373D20',
              '&:hover': { backgroundColor: '#373D20' },
              fontWeight: 'bold',
            }}
            fullWidth
          >
            Agregar
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default MealForm;
