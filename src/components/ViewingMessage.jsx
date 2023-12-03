import { Grid } from "@mui/material";
import React from "react";

const ViewingMessage = ({patientUserName}) => {
    return (
        <Grid sx={{ justifyContent: "center", textAlign: "center" }}>
            <p
                style={{ color: "black", fontStyle: "italic", marginBottom: "5%" }}
            >
                Viewing {patientUserName} profile
            </p>
        </Grid>
    );
}

export default ViewingMessage;