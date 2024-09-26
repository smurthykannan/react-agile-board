import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar } from "@mui/material";

const Header = () => {
    return (
        <AppBar className="header">
            <Toolbar>
                <Typography variant="h6" component="div" className="logo">
                    Agile Progressive Board
                </Typography>
                <Box>
                    <IconButton color="inherit">
                        <Avatar alt="Kannan" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQNvWDvQb_rCtRL-p_w329CtzHmfzfWP0FIw&s" />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )

};

export default Header;