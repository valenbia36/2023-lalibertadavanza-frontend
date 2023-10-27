import React, { useState, useEffect } from "react";
import Drawer from "../components/Drawer";
import { useTheme } from "@mui/material/styles";
import LabelBottomNavigation from "../components/BottomMenu";
import PieChartContainer from "../components/Charts/PieChartContainer";
import LineChartContainer from "../components/Charts/LineChartContainer";
import { Col, Container, Row } from "react-bootstrap";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";

const actions = [
  { icon: <LocalDrinkIcon />, name: "Water" },
  { icon: <NotificationsActiveIcon />, name: "Intermittent Fasting" },
];

const Statistics = () => {
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
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

  return (
    <Container>
      {!isMobile ? (
        <Drawer user={localStorage.getItem("username")} />
      ) : (
        <LabelBottomNavigation />
      )}
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: "70px", right: "25px" }}
        icon={<SpeedDialIcon/>}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
      <Row>
        <Col
          xs={12}
          md={6}
          className="d-flex align-items-start justify-content-center"
          style={{ height: "500px" }}
        >
          <div>
            <PieChartContainer />
          </div>
        </Col>
        <Col
          xs={12}
          md={6}
          className="d-flex align-items-start justify-content-center"
          style={{ height: "600px" }}
        >
          <div>
            <LineChartContainer />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Statistics;
