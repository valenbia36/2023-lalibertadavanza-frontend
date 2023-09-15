import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const FoodForm = ({ onAddFood }) => {
  const [newFood, setNewFood] = useState({ name: '', category: '' });

  const handleAddFood = () => {
    if (newFood.name.trim() !== '' && newFood.category.trim() !== '') {
      // Lógica para agregar comida
      onAddFood(newFood);
      setNewFood({ name: '', category: '' });
    }
  };

  return (
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
        label="Date"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newFood.category}
        onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
      />
      <TextField
        label="Hour"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newFood.category}
        onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
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
  );
};

export default FoodForm;



