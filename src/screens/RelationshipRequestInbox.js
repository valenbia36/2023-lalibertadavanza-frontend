import React, { useState, useEffect } from "react";
import DrawerNutritionist from "../components/Menu/DrawerNutritionist";
import LabelBottomNavigationNutritionist from "../components/Menu/BottomMenuNutritionist";
import { useTheme } from "@mui/material/styles";
import getApiUrl from "../helpers/apiConfig";
import { Grid, Button } from "@mui/material";
import { useSnackbar } from "notistack";

const apiUrl = getApiUrl();

const RelationshipRequestInbox = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [relationshipRequestList, setRelationshipRequestList] = useState([]);
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

  useEffect(() => {
    handleGetRelationshipRequestByNutritionist();
  }, [flagToRender]);

  const handleGetRelationshipRequestByNutritionist = async () => {
    const response = await fetch(
      apiUrl +
        "/api/relationshipRequest/getRelationshipRequestByNutritionistId/" +
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
    setRelationshipRequestList(data.data);
  };

  const handleAcceptNutritionistRelationship = async (id, userId) => {
    await fetch(apiUrl + "/api/relationshipRequest/update/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        nutritionistId: localStorage.getItem("userId"),
        userId: userId,
        status: "Accepted",
      }),
    }).then(function (response) {
      if (response.status === 200) {
        enqueueSnackbar("Request accepted", {
          variant: "success",
        });
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "60px",
    marginTop: "10px",
    marginBottom: "10px",
  };

  const noPatientsStyle = {
    textAlign: "center",
    margin: "20px",
    fontSize: "1.5rem",
    color: "grey",
  };

  return (
    <div className="container">
      {!isMobile ? (
        <DrawerNutritionist user={localStorage.getItem("username")} />
      ) : (
        <LabelBottomNavigationNutritionist />
      )}
      <h2
        style={{
          fontWeight: "bold",
          color: "black",
          textAlign: "center",
        }}
      >
        MY RELATIONSHIP requests
      </h2>
      {relationshipRequestList.length === 0 ? (
        <p style={noPatientsStyle}>
          You currently have no relationship requests.
        </p>
      ) : (
        <Grid container spacing={2}>
          {relationshipRequestList.map((relationshipRequest) => (
            <Grid item xs={12} md={6} key={relationshipRequest._id}>
              <div style={boxStyle}>
                <div style={rowStyle}>
                  <p style={{ color: "black", margin: 0 }}>
                    Name: {relationshipRequest.user.firstName}{" "}
                    {relationshipRequest.user.lastName}
                  </p>
                  <p style={{ color: "black", margin: 0 }}>
                    Email: {relationshipRequest.user.email}
                  </p>
                </div>
                <div style={rowStyle}>
                  <p style={{ color: "black", margin: 0 }}>
                    Sex: {relationshipRequest.user.sex}
                  </p>
                  <p style={{ color: "black", margin: 0 }}>
                    Age: {relationshipRequest.user.age} years
                  </p>
                </div>
                <div style={rowStyle}>
                  <p style={{ color: "black", margin: 0 }}>
                    Height: {relationshipRequest.user.height} cm
                  </p>
                  <p style={{ color: "black", margin: 0 }}>
                    Weight: {relationshipRequest.user.weight} kg
                  </p>
                </div>
                {relationshipRequest.status === "Sent" ? (
                  <div style={actionContainerStyle}>
                    <Grid container justifyContent="center" spacing={2}>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleAcceptNutritionistRelationship(
                              relationshipRequest._id,
                              relationshipRequest.user._id
                            )
                          }
                          sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: "#373D20",
                            "&:hover": { backgroundColor: "#373D20" },
                            fontWeight: "bold",
                          }}
                        >
                          Accept
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => {}}
                          sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: "#373D20",
                            "&:hover": { backgroundColor: "#373D20" },
                            fontWeight: "bold",
                          }}
                        >
                          Reject
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                ) : (
                  <div style={actionContainerStyle}>
                    <p
                      style={{ color: "black", margin: 0, fontWeight: "bold" }}
                    >
                      {relationshipRequest.status}
                    </p>
                  </div>
                )}
              </div>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default RelationshipRequestInbox;
