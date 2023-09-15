import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import FoodForm from './MealForm'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

const FoodList = () => {
  const [foods, setFoods] = useState([{name: "Carne con papas", day: "12-09-2023", hour: "23:00"}]);
  const [newFood, setNewFood] = useState({ name: '', category: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
   /*useEffect(() => {
    fetch('http://localhost:3001/api/auth/login'
      .then((response) => {
        setFoods(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar los alimentos:', error);
      });
  }, []);*/

  const handleAddFood = () => {
    //setFoods([...foods, response.data]);
    setNewFood({ name: '', category: '' });
    closeModal();
      
  }; 

  return (
    <div style={{ textAlign: 'center', marginBottom: '250px', color: 'black'}}> 
      <h2>Food Table</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth:'100%',}}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{textAlign: 'center'}}>Name</TableCell>
                <TableCell sx={{textAlign: 'center'}}>Day</TableCell>
                <TableCell sx={{textAlign: 'center'}}>Hour</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {foods.map((food) => (
                <TableRow key={food.id}>
                  <TableCell sx={{textAlign: 'center'}}>{food.name}</TableCell>
                  <TableCell sx={{textAlign: 'center'}}>{food.day}</TableCell>
                  <TableCell sx={{textAlign: 'center'}}>{food.hour}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Modal
      open={isModalOpen}
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
        <FoodForm onAddFood={handleAddFood} />
      </Box>
    </Modal>
      <IconButton
        color="primary"
        onClick={openModal}
      >
        <AddCircleRoundedIcon />
      </IconButton>
    </div>
  );
};

export default FoodList;