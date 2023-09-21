import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import MealForm from './MealForm'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

const MealList = () => {
  const [meals, setMeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getMeals = async () => {
      const response = await fetch('http://localhost:3001/api/meals/', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setMeals(data.data);
  }
  useEffect(() => {
      getMeals();
  }, [meals]);


  return (
    <div style={{ textAlign: 'center', marginBottom: '250px', color: 'black'}}> 
      <h2>Meals Table</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth:'100%',}}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{textAlign: 'center'}}>Name</TableCell>
                <TableCell sx={{textAlign: 'center'}}>Date</TableCell>
                <TableCell sx={{textAlign: 'center'}}>Hour</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meals.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell sx={{textAlign: 'center'}}>{meal.name}</TableCell>
                  <TableCell sx={{textAlign: 'center'}}>{meal.date}</TableCell>
                  <TableCell sx={{textAlign: 'center'}}>{meal.hour}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      
      <React.Fragment>
        <MealForm  open={isModalOpen} setOpen={setIsModalOpen}/>
      </React.Fragment >
      <IconButton
        color="primary"
        onClick={()=> {setIsModalOpen(true)}}
      >
        <AddCircleRoundedIcon />
      </IconButton>
    </div>
  );
};

export default MealList;