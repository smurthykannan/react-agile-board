import React from 'react';
import Grid from "@mui/material/Grid2";
import {Typography} from "@mui/material";

const NotFound = () => {
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
        >
            <Grid item>
                <img
                    src="/images/not-found.png"
                    alt="not-found"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
                <Typography variant="h6" align="center">
                    The page does not exist.
                </Typography>
            </Grid>
        </Grid>
    )
};

export default NotFound;