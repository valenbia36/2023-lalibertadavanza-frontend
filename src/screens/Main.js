import React from 'react';
import Drawer from '../components/Drawer';
import MealList from '../components/MealList'
import FoodList from '../components/FoodList'

const Main = () => {

  return(
    <div>
        <Drawer user={localStorage.getItem('username')}/>
        <MealList />
    </div>
  ); 
}

export default Main;
