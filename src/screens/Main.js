import React from 'react';
import Drawer from '../components/Drawer';
import MealList from '../components/MealList2';
import FoodList from '../components/FoodList2';


const Main = () => {
  return (
    <div className="container">
      <Drawer user={localStorage.getItem('username')} />
      <div className="row justify-content-center align-items-center">
        <div className="col-md-10 justify-content-center">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <FoodList />
            </div>
            <div className="col-md-7">
              <MealList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
