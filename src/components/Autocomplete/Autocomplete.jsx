import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import QuantityInput from './Quantity';

const FreeSolo = () => {
const [foods, setFoods] = useState([]);

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
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={foods.map((option) => option.name)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Food"
              InputProps={{
                ...params.InputProps,
                type: 'search',
              }}
              fullWidth // Makes the TextField take up the full width available in the Grid item
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <QuantityInput  />
      </Grid>
    </Grid>

    
  );
}

export default FreeSolo;
