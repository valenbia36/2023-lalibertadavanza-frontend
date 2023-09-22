import React, {  useState } from 'react';
import { TextField, Button, Modal, Box, } from '@mui/material';

const initialFoodState = {
  name: '',
  calories: ''
};

const FoodForm = ({open,setOpen}) => {
  const [newFood, setNewFood] = useState(initialFoodState);
  const [errorMessage, setErrorMessage] = useState(false);

  const closeModal = () => {
    setOpen(false);
    setNewFood(initialFoodState);
  };

  const handleAddFood = () => {
    if ( newFood.name === '') {
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
        label="Calories"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newFood.calories}
        onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddFood}
        sx={{ mt: 3, mb: 2, backgroundColor: '#373D20', '&:hover': {backgroundColor: '#373D20'}, fontWeight: 'bold' }}
        fullWidth
      >
        Agregar
      </Button>
    </div>
    </Box>
    </Modal>
  );
};

export default FoodForm;