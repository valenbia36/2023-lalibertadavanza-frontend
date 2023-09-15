import * as React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import QuantityInput from './Quantity';

export default function FreeSolo() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={top100Films.map((option) => option.title)}
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

const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 }]