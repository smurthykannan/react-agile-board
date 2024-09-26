import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  IconButton,
  Typography,
  CardContent,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Grid2";
import { LocalStorageAdaptor } from "../../../services/adaptors";
import TasksService from "../../../services/task-service";

const taskService = new TasksService(new LocalStorageAdaptor());

const TaskCard = ({ key, item, fetchTask, onEditModalOpen }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onViewClick = (item) => {
    navigate(`/tasks/${item.id}`);
  };

  const onEditClick = (item) => {
    setAnchorEl(null);
    onEditModalOpen(item);
  };

  const onDeleteClick = (item) => {
    setAnchorEl(null);
    if (confirm("Would you like to delete this task ?")) {
      taskService.deleteTask(item.id);
      fetchTask();
    }
  };

  const handlePointerDown = (event) => {
    if (event.target.tagName === "svg" || event.target.tagName === "LI") {
      event.stopPropagation();
    }
  };

  const renderChipStyle = (task) => {
    let color = "#f64e60";
    let bgColor = "#ffe2e5";

    if (task.priority === "low") {
      (color = "#6993ff"), (bgColor = "#e1e9ff");
    } else if (task.priority === "medium") {
      (color = "#ffa800"), (bgColor = "#fff4de");
    }

    return {
      margin: "4px 0px",
      minWidth: "50px",
      maxHeight: "20px",
      background: bgColor,
      color: color,
      borderColor: color,
    };
  };

  return (
    <Card className="task-card" onPointerDown={handlePointerDown}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className="avatar">
            {item.assignedTo.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={item.assignedTo}
        action={
          <>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => onViewClick(item)}>View</MenuItem>
              <MenuItem onClick={() => onEditClick(item)}>Edit</MenuItem>
              <MenuItem onClick={() => onDeleteClick(item)}>Delete</MenuItem>
            </Menu>
          </>
        }
      />

      <CardContent className="content">
        <Typography className="content-title">
          {item.title}
        </Typography>

        <Grid
          container
          spacing={2}
          columns={12}
          sx={{ m: "15px 0 0" }}
          justifyContent={"space-between"}
        >
          <Grid item xs={4}>
            <div className="task-title">Priority</div>
            <span className="task-sub-title">
              <Chip
                label={
                  item.priority.charAt(0).toUpperCase() + item.priority.slice(1)
                }
                sx={renderChipStyle(item)}
                variant="outlined"
              />
            </span>
          </Grid>
          <Grid item xs={4}>
            <div className="task-title">Due Date</div>
            <span className="task-sub-title">{item.deadLine}</span>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
