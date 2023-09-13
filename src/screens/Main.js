import React from 'react';
import Drawer from '../components/Drawer';
import FoodList from '../components/FoodList'

const Main = () => {

  return(
    <div>
        <Drawer user={localStorage.getItem('username')}/>
        <FoodList/>
    </div>
  ); 
}

export default Main;
