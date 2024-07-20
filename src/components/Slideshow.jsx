import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";

const Slideshow = ({ images, interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [currentIndex, images, interval]);

  return (
    <Grid
      item
      xs={false}
      sm={4}
      md={7}
      sx={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          top: 0,
          left: 0,
        }}
      />
    </Grid>
  );
};

export default Slideshow;
