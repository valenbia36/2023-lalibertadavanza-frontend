import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Divider from "@mui/material/Divider";

export default function TitlebarBelowImageList({ data }) {
  const imageStyle = {
    width: "100%", // Establece el ancho al 100% para que se ajuste al contenedor
    height: "100%", // Establece la altura al 100% para que se ajuste al contenedor
    objectFit: "cover", // Ajusta el tamaño de la imagen para cubrir completamente el contenedor
  };

  return (
    <ImageList
      sx={{
        width: 500,
        height: 450,
        maxWidth: "100%",
      }}
      cols={1}
      gap={6}
    >
      {data.steps?.map((item, index) => (
        <ImageListItem key={item.images[0]}>
          {item.images[0] ? (
            <div style={{ height: "60%", textAlign: "center" }}>
              <span style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                {`Step ${index + 1}`}
              </span>
              <img
                srcSet={item.images[0]}
                src={item.images[0]}
                loading="lazy"
                style={imageStyle}
                alt={`Step ${index + 1}`}
              />

              <span style={{ fontSize: "1em", fontWeight: "bold" }}>
                {`${data.steps[index].text}`}
              </span>
              <Divider />
            </div>
          ) : (
            <div style={{ height: "100%", textAlign: "center" }}>
              <span style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                {`Step ${index + 1}`}
              </span>
              <br />
              <span style={{ fontSize: "1em", fontWeight: "bold" }}>
                {`${data.steps[index].text}`}
              </span>
              <Divider />
            </div>
          )}
        </ImageListItem>
      ))}
    </ImageList>
  );
}
