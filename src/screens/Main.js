import React from "react";
import Drawer from "../components/Drawer";
import MealList from "../components/MealList";
import FoodList from "../components/FoodList";

const Main = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-1">
          <Drawer user={localStorage.getItem("username")} />
        </div>
        <div className="col-md-11">
          <div className="d-flex justify-content-center">
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
    </div>
  );
};

export default Main;
