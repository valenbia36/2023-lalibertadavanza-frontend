import React, { useState, useEffect } from "react";
import Drawer from "../components/Drawer";

import { useTheme } from "@mui/material/styles";
import LabelBottomNavigation from "../components/BottomMenu";
import PieChartContainer from "../components/Charts/PieChartContainer";
import LineChartContainer from "../components/Charts/LineChartContainer";
import { Col, Container, Row } from "react-bootstrap";
import RangeDatePicker from "../components/RangeDatePicker";

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
      <Row>
        <Col
          xs={12}
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <div style={{ marginBottom: "30%" }}>
            <PieChartContainer />
          </div>
        </Col>
        <Col
          xs={12}
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <div style={{ marginBottom: "20%" }}>
            <LineChartContainer />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Statistics;
