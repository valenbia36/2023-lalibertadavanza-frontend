import React from 'react';
import Drawer from '../components/Drawer';
import MealList from '../components/MealList2';
import FoodList from '../components/FoodList';


const Main = () => {
  return (
    <div className="container">
      <Drawer user={localStorage.getItem('username')} />
      <div className="row justify-content-center">
        <div className="col-md-6.5">
          <div className="row">
            <div className="col-md-4">
              <FoodList />
            </div>
            <div className="col-md-8">
              <MealList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
