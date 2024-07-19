import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Drawer from "../components/Menu/Drawer";
import LabelBottomNavigation from "../components/Menu/BottomMenu";
import {
  CircularProgress,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Confetti from "react-confetti";
import getApiUrl from "../helpers/apiConfig";
import { useSnackbar } from "notistack";
import IntermittentFastingForm from "../components/Forms/IntermittentFastingForm";
import Calendar from "../components/Planner/Calendar";
import RecipeForm from "../components/Forms/Recipe/RecipeForm";

const apiUrl = getApiUrl();

const Planner = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [plan, setPlan] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isModalFoodOpen, setIsModalFoodOpen] = useState(false);
  const [isModalRecipeOpen, setIsModalRecipeOpen] = useState(false);
  const [openIntermittentFastingModal, setOpenIntermittentFastingModal] =
    useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= theme.breakpoints.values.sm);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  useEffect(() => {
    async function fetchData() {
      await Promise.all([getPlan(), getRecipes()]);
      setIsDataLoaded(true);
    }

    fetchData();

    // Check local storage to see if the user opted to not show the dialog again
    const dontShow = localStorage.getItem("dontShowPopup");
    if (!dontShow) {
      setOpenDialog(true);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getRecipes();
      setIsDataLoaded(true);
    }
    fetchData();
  }, [isModalRecipeOpen]);

  const handleCloseDialog = () => {
    if (dontShowAgain) {
      localStorage.setItem("dontShowPopup", "true");
    }
    setOpenDialog(false);
  };

  const renderCalendar = () => {
    if (isDataLoaded) {
      return (
        <Calendar
          initialData={plan}
          recipes={recipes}
          isMobile={isMobile}
          setPlan={setPlan}
          isModalRecipeOpen={isModalRecipeOpen}
          getRecipes={getRecipes}
        />
      );
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      );
    }
  };

  const handleCreateWaterGlass = () => {
    fetch(apiUrl + "/api/waterGlass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        date: new Date(),
      }),
    }).then(function (response) {
      if (response.status === 401) {
        // Token ha expirado, desloguear al usuario
        localStorage.removeItem("token");
        localStorage.setItem("sessionExpired", "true");
        window.location.href = "/";
      }
      if (response.status === 200) {
        enqueueSnackbar("The water glass was added successfully.", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("An error occurred while adding the water glass.", {
          variant: "error",
        });
      }
    });
  };

  const handleWaterGlassClick = () => {
    setShowConfetti(true);
    handleCreateWaterGlass();
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const handelOpenMealForm = async () => {
    setIsModalRecipeOpen(true);
  };

  const handleIntermittentFasting = () => {
    setOpenIntermittentFastingModal(true);
  };

  const getPlan = async () => {
    const response = await fetch(apiUrl + `/api/weeks/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.status === 401) {
          // Token ha expirado, desloguear al usuario
          localStorage.removeItem("token");
          localStorage.setItem("sessionExpired", "true");
          window.location.href = "/";
        }
        response.json();
      })
      .then((data) => {
        setPlan(data[0]);
      });
  };

  const getRecipes = async () => {
    const response = await fetch(apiUrl + "/api/recipes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.status === 401) {
          // Token ha expirado, desloguear al usuario
          localStorage.removeItem("token");
          localStorage.setItem("sessionExpired", "true");
          window.location.href = "/";
        }
        response.json();
      })
      .then((data) => setRecipes(data.data));
  };

  const actions = [
    { icon: <LocalDrinkIcon />, name: "Water", onClick: handleWaterGlassClick },
    {
      icon: <NotificationsActiveIcon />,
      name: "Intermittent Fasting",
      onClick: handleIntermittentFasting,
    },
    {
      icon: <RestaurantIcon />,
      name: "Add Recipe",
      onClick: handelOpenMealForm,
    },
  ];

  const closeModal = () => {
    setOpenIntermittentFastingModal(false);
  };

  return (
    <div className="container">
      {isMobile ? (
        <LabelBottomNavigation />
      ) : (
        <Drawer user={localStorage.getItem("username")} />
      )}
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      {
        <SpeedDial
          ariaLabel="SpeedDial"
          sx={{ position: "fixed", bottom: "70px", right: "25px" }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      }

      {renderCalendar()}

      <IntermittentFastingForm
        openIntermittentFastingModal={openIntermittentFastingModal}
        closeModal={closeModal}
      />
      <RecipeForm
        openRecipe={isModalRecipeOpen}
        setRecipeOpen={(value) => {
          setIsModalRecipeOpen(value);
          if (!value) {
            getRecipes();
          }
        }}
        foodModal={isModalFoodOpen}
        setOpenFoodModal={(value) => {
          setIsModalFoodOpen(value);
          if (!value) {
            getRecipes();
          }
        }}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Welcome to the Planner</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is your dashboard to manage your daily meals. You can add more
            recipes using the menu in the right bottom. To save the dashboard,
            press the Save Plan button. You can view and interact with your
            shopping list based on the dashboard by pressing the View Cart
            button.
          </DialogContentText>
          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
            }
            label="Don't show this again"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Planner;
