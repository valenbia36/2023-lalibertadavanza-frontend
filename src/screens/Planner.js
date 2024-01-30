import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Drawer from "../components/Menu/Drawer";
import LabelBottomNavigation from "../components/Menu/BottomMenu";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import Confetti from "react-confetti";
import getApiUrl from "../helpers/apiConfig";
import { useSnackbar } from "notistack";
import IntermittentFastingForm from "../components/Forms/IntermittentFastingForm";
import ViewingMessage from "../components/ViewingMessage";
import Calendar from "../components/Planner/Calendar";

const apiUrl = getApiUrl();

const Planner = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [plan, setPlan] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [openIntermittentFastingModal, setOpenIntermittentFastingModal] =
    useState(false);

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
  }, []);
  const renderCalendar = () => {
    if (isDataLoaded) {
      return <Calendar initialData={plan} recipes={recipes} />;
    } else {
      // Puedes mostrar un mensaje de carga o cualquier otro indicador mientras esperas los datos
      return <p>Loading...</p>;
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
        userId: localStorage.getItem("userId"),
      }),
    }).then(function (response) {
      if (response.status === 200) {
        enqueueSnackbar("The water glass was add successfully.", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("An error occurred while adding the water glss.", {
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

  const handleIntermittentFasting = () => {
    setOpenIntermittentFastingModal(true);
  };
  const getPlan = async () => {
    const response = await fetch(
      apiUrl + `/api/weeks/${localStorage.getItem("userId")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((response) => response.json())
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
      .then((response) => response.json())
      .then((data) => setRecipes(data.data));
  };
  useEffect(() => {
    getPlan();
    getRecipes();
  }, []);

  const actions = [
    { icon: <LocalDrinkIcon />, name: "Water", onClick: handleWaterGlassClick },
    {
      icon: <NotificationsActiveIcon />,
      name: "Intermittent Fasting",
      onClick: handleIntermittentFasting,
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
      {localStorage.getItem("viewAs") === "false" && (
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
      )}
      {localStorage.getItem("viewAs") === "true" && (
        <ViewingMessage
          patientUserName={localStorage.getItem("patientUserName")}
        />
      )}
      {renderCalendar()}

      <IntermittentFastingForm
        openIntermittentFastingModal={openIntermittentFastingModal}
        closeModal={closeModal}
      />
    </div>
  );
};

export default Planner;
