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
import MealTable from './Tables/MealTable';

const MealList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <div style={{ textAlign: 'center', marginBottom: '250px', color: 'black'}}> 
      <h2>Meals Table</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth:'100%',}}>
        <MealTable/>
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