import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import PropTypes from 'prop-types';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  console.log(props)
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.date}</TableCell>
        <TableCell align="right">{row.hour}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Foods
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Calories</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.foods.map((foodRow) => (
                    <TableRow key={foodRow.name}>
                      <TableCell component="th" scope="row">
                        {foodRow.name}
                      </TableCell>
                      <TableCell>{foodRow.calories}</TableCell>
                      <TableCell align="right">{foodRow.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


const rowsPerPage = 2; // Number of rows per page

export default function MealTable() {
  const [page, setPage] = useState(0);
  const [meals, setMeals] = useState([]);
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


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Date&nbsp;</TableCell>
            <TableCell align="right">Hours&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(meals.length>0) && (meals.slice(startIndex, endIndex).map((row) => (
            <Row key={row.name} row={row} />
          )))}
        </TableBody>
      </Table>
      
      <div>
        <IconButton onClick={(e) => handleChangePage(e, page - 1)} disabled={page === 0}>
          <ArrowBackIosIcon/>
        </IconButton>
        <IconButton onClick={(e) => handleChangePage(e, page + 1)} disabled={endIndex >= meals.length}>
        <ArrowForwardIosIcon/>
        </IconButton>
      </div>
    </TableContainer>
  );
}
