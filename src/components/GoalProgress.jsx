import React from 'react';
import { CircularProgress, Typography, Box, Grid, Paper } from '@mui/material';

const GoalProgress = ({ goal, progress }) => {
  const percentage = (progress / goal) * 100;
  let color = '';

  if (percentage <= 25) {
    color = 'error.main';
  } else if (percentage <= 50) {
    color = 'info.main';
  } else if (percentage <= 75) {
    color = 'warning.main';
  } else {
    color = 'success.main';
  }

  return (
    <Grid color="black">
      <Typography variant="h5" fontWeight="bold" align='center' marginBottom='5%'>GOAL</Typography>
      <Box p={4} textAlign="center" sx={{position: 'relative'}}>
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={200}
          thickness={4}
          sx={{ color: color, margin: '0 auto' }}
        />
        <Typography
        variant="h6"
        component="div"
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold'
        }}
        >
        {`${Math.round(percentage)}%`}
        </Typography>
      </Box>
    </Grid>
  );
};

export default GoalProgress;
