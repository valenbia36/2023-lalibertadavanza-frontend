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
        label="Nombre"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newFood.name}
        onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
      />
      <TextField
        label="Categoría"
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
        fullWidth
      >
        Agregar
      </Button>
    </div>
  );
};

export default FoodForm;



