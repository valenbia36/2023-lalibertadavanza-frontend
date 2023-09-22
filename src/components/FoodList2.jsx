
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
import FoodForm from './FoodForm'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import FoodTable from './Tables/FoodTable';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getFoods = async () => {
      const response = await fetch('http://localhost:3001/api/foods/', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setFoods(data.data);
  }
  useEffect(() => {
      getFoods();
  }, [foods]);


  return (
    <div style={{ textAlign: 'center', color: 'black'}}> 
      <h2>Foods Table</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth:'100%',}}>
        <FoodTable rows={{foods}}/>
      </div>
      <React.Fragment>
        <FoodForm  open={isModalOpen} setOpen={setIsModalOpen}/>
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

export default FoodList;