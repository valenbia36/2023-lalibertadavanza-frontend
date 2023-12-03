import React, { useState, useEffect } from "react";
import Drawer from "../components/Drawer";
import { useTheme } from "@mui/material/styles";
import LabelBottomNavigation from "../components/BottomMenu";
import {
  Button,
  Grid,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import Confetti from "react-confetti";
import getApiUrl from "../helpers/apiConfig";
import { useSnackbar } from "notistack";
import IntermittentFastingForm from "../components/Forms/IntermittentFastingForm";

const apiUrl = getApiUrl();

const Nutritionist = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [openIntermittentFastingModal, setOpenIntermittentFastingModal] =
    useState(false);
  const [nutritionistList, setNutritionistList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [myNutritionist, setMyNutritionist] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [flagToRender, setFlagToRender] = useState(false);

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

  const closeModal = () => {
    setOpenIntermittentFastingModal(false);
  };

  const actions = [
    { icon: <LocalDrinkIcon />, name: "Water", onClick: handleWaterGlassClick },
    {
      icon: <NotificationsActiveIcon />,
      name: "Intermittent Fasting",
      onClick: handleIntermittentFasting,
    },
  ];

  useEffect(() => {
    handleGetAvailableNutritionists();
    hanldeMyNutritionist();
    handleGetSentRelationshipRequest();
  }, [flagToRender]);

  const hanldeMyNutritionist = async () => {
    const response = await fetch(
      apiUrl +
        "/api/auth/nutritionistByUserId/" +
        localStorage.getItem("userId"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    setMyNutritionist(data.data.nutritionist);
  };

  const handleGetAvailableNutritionists = async () => {
    const response = await fetch(apiUrl + "/api/auth/nutritionistUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setNutritionistList(data.data);
  };

  const handleGetSentRelationshipRequest = async () => {
    const response = await fetch(
      apiUrl +
        "/api/relationshipRequest/getSentRelationshipRequestByUserId/" +
        localStorage.getItem("userId"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    console.log(data.data);
    setSentRequests(data.data);
  };

  const handleSendRequest = async (
    nutritionistId,
    nutritionistFirstName,
    nutritionistLastName,
    nutritionistEmail
  ) => {
    if (myNutritionist) {
      enqueueSnackbar("You already have a nutritionist", {
        variant: "error",
      });
    } else {
      await fetch(apiUrl + "/api/relationshipRequest/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          nutritionist: nutritionistId,
          user: localStorage.getItem("userId"),
          status: "Sent",
          nutritionistUserName:
            nutritionistFirstName + " " + nutritionistLastName,
          nutritionistEmail: nutritionistEmail,
          userName: localStorage.getItem("username"),
        }),
      }).then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("Request sended", {
            variant: "success",
          });
          setFlagToRender(!flagToRender);
        }
      });
    }
  };

  const handleCancelNutritionistRelationship = async () => {
    await fetch(
      apiUrl +
        "/api/auth/assign-nutritionist/" +
        localStorage.getItem("userId"),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ nutritionistId: null }),
      }
    ).then(function (response) {
      if (response.status === 200) {
        enqueueSnackbar("Relation removed", {
          variant: "success",
        });
        setMyNutritionist(null);
        setFlagToRender(!flagToRender);
      } else {
        enqueueSnackbar("An error occurred", {
          variant: "error",
        });
      }
    });
  };

  const boxStyle = {
    border: "1px solid black",
    borderRadius: "5px",
    padding: "10px",
    margin: "10px",
    backgroundColor: "#f9f9f9",
    fontSize: "18px",
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  };

  const actionContainerStyle = {
    maxHeight: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
  };

  return (
    <div className="container">
      {!isMobile ? (
        <Drawer user={localStorage.getItem("username")} />
      ) : (
        <LabelBottomNavigation />
      )}
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <SpeedDial
        ariaLabel="SpeedDial basic example"
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

      {myNutritionist && (
        <Grid container justifyContent="center" sx={{ marginBottom: 2 }}>
          <Grid item xs={12} md={6}>
            <h2
              style={{
                fontWeight: "bold",
                color: "black",
                textAlign: "center",
              }}
            >
              MY CURRENT NUTRITIONIST
            </h2>
            <div style={boxStyle}>
              <div style={rowStyle}>
                <p style={{ color: "black", margin: 0 }}>
                  Name: {myNutritionist.firstName} {myNutritionist.lastName}
                </p>
                <p style={{ color: "black", margin: 0 }}>
                  Email: {myNutritionist.email}
                </p>
              </div>
              <div style={rowStyle}>
                <p style={{ color: "black", margin: 0 }}>
                  Sex: {myNutritionist.sex}
                </p>
                <p style={{ color: "black", margin: 0 }}>
                  Age: {myNutritionist.age}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleCancelNutritionistRelationship()}
                  sx={{
                    mt: 1,
                    mb: 2,
                    backgroundColor: "#373D20",
                    "&:hover": { backgroundColor: "#373D20" },
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      )}
      <Grid sx={{ textAlign: "center" }}>
        <TextField
          label="Search Nutritionist"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "50%", mb: 2 }}
        />

        <Grid container spacing={2}>
          {nutritionistList
            .filter(
              (nutritionist) =>
                !myNutritionist ||
                (myNutritionist && nutritionist._id !== myNutritionist._id)
            )
            .filter((nutritionist) => {
              const fullName =
                `${nutritionist.firstName} ${nutritionist.lastName}`.toLowerCase();
              return fullName.includes(searchTerm.toLowerCase());
            })
            .map((nutritionist) => {
              const requestSent = sentRequests.some(
                (request) => request.nutritionist === nutritionist._id
              );
              return (
                <Grid item xs={12} md={6} key={nutritionist._id}>
                  <div style={boxStyle}>
                    <div style={rowStyle}>
                      <p style={{ color: "black", margin: 0 }}>
                        Name: {nutritionist.firstName} {nutritionist.lastName}
                      </p>
                      <p style={{ color: "black", margin: 0 }}>
                        Email: {nutritionist.email}
                      </p>
                    </div>
                    <div style={rowStyle}>
                      <p style={{ color: "black", margin: 0 }}>
                        Sex: {nutritionist.sex}
                      </p>
                      <p style={{ color: "black", margin: 0 }}>
                        Age: {nutritionist.age}
                      </p>
                    </div>
                    {requestSent ? (
                      <div style={actionContainerStyle}>
                        <p
                          style={{
                            textAlign: "center",
                            marginTop: "10px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          Your request has already been sent
                        </p>
                      </div>
                    ) : (
                      <div style={actionContainerStyle}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleSendRequest(
                              nutritionist._id,
                              nutritionist.firstName,
                              nutritionist.lastName,
                              nutritionist.email
                            )
                          }
                          sx={{
                            mt: 1,
                            mb: 2,
                            backgroundColor: "#373D20",
                            "&:hover": { backgroundColor: "#373D20" },
                            fontWeight: "bold",
                          }}
                        >
                          Send Request
                        </Button>
                      </div>
                    )}
                  </div>
                </Grid>
              );
            })}
        </Grid>
      </Grid>

      <IntermittentFastingForm
        openIntermittentFastingModal={openIntermittentFastingModal}
        closeModal={closeModal}
      />
    </div>
  );
};

export default Nutritionist;
