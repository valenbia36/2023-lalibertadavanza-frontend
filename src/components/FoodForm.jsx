import React, {  useState } from 'react';
import Grid from '@mui/material/Grid';
import { TextField, Button, Modal, Box, } from '@mui/material';

const initialFoodState = {
  name: '',
  calories: '',
  weight: '',
};

const FoodForm = ({open,setOpen}) => {
  const [newFood, setNewFood] = useState(initialFoodState);
  const [errorMessage, setErrorMessage] = useState(false);

  const closeModal = () => {
    setOpen(false);
    setErrorMessage(false)
    setNewFood(initialFoodState);
  };

  const handleCaloriesInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewFood({ ...newFood, calories: inputValue });
    } else {
      setNewFood({ ...newFood, calories: '' }); // Deja el campo de entrada vacío
    }
  };

  const handleWeightInputChange = (e, index) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setNewFood({ ...newFood, weight: inputValue });
    } else {
      setNewFood({ ...newFood, weight: '' }); // Deja el campo de entrada vacío
    }
  };

  const handleAddFood = () => {
    if ( newFood.name === ''|| newFood.calories === '' || newFood.weight === '' ) { //ACA DEBERIA SER
      setErrorMessage(true);
      return;
  } else{
      fetch('http://localhost:3001/api/foods', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem('token')
          },
          body: JSON.stringify(newFood)
      }).then(function(response) {
          if(response.status === 200){
              console.log("Se creo el alimento")
              closeModal();
              
          }
          else{
              setErrorMessage(true);
              console.log("Hubo un error creando el alimento")
          } 
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
          width: 400,
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
        value={newFood.name}
        onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
      />

      <TextField
        InputProps={{
          inputProps: {
            step: 1, // Establece el incremento/decremento en 1
          },
        }}
        label={`Calories`}
        type='number'
        variant="outlined"
        fullWidth
        value={newFood.calories}
        onChange={(e) => handleCaloriesInputChange(e)}
        style={{ marginBottom: '7px' }}
      />

    <TextField
        InputProps={{
          inputProps: { min: 1 }
        }}
        label={`Weight`}
        type='number'
        variant="outlined"
        fullWidth
        value={newFood.weight}
        onChange={(e) => handleWeightInputChange(e)}
      />

      <Grid container justifyContent="center">
              {errorMessage && <p style={{color: 'red', fontSize: '14px', justifyContent: 'center', textAlign: 'center'}}>
                Please review your input. There are errors in one or more fields.</p>}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddFood}
        sx={{ mt: 3, mb: 2, backgroundColor: '#373D20', '&:hover': {backgroundColor: '#373D20'}, fontWeight: 'bold' }}
        fullWidth
      >
        Add Food
      </Button>
    </div>
    </Box>
    </Modal>
  );
};

export default FoodForm;