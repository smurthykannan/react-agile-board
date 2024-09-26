import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import UploadIcon from "@mui/icons-material/Upload";
import { useParams } from "react-router-dom";
import { LocalStorageAdaptor } from "../../../services/adaptors";
import TasksService from "../../../services/task-service";

const taskService = new TasksService(new LocalStorageAdaptor());

const RowWidget = ({ title, children }) => {
    return (
        <Grid container spacing={2} sx={{ marginBottom: "8px" }}>
            <Grid size={3}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
            </Grid>
            <Grid size={9}>
                {children}
            </Grid>

        </Grid>
    )
};


const TaskDetails = () => {

    const { id } = useParams();
    const [task, setTask] = useState(null);

    const fetchTask = () => {
        try {
            const item = taskService.getTask(id);
            setTask(item)
        } catch (error) {
            console.log("error:", error.message);
        }
    };

    const handleImageUpload = (event) => {
        try {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const model = {
                    ...task,
                    attachment: reader.result
                }

                taskService.updateTask(model);
                fetchTask();
            };

            if (file) {
                reader.readAsDataURL(file);
            }


        } catch (err) {
            console.log(err)
        }
    };

    const renderChipStyle = () => {
        let color = "#f64e60"
        let bgColor = "#ffe2e5"

        if (task.priority === "low") {
            color = "#6993ff",
                bgColor = "#e1e9ff"
        } else if (task.priority === "medium") {
            color = "#ffa800",
                bgColor = "#fff4de"
        }

        return {
            m: 1,
            minWidth: "70px",
            maxHeight: "25px",
            background: bgColor,
            color: color,
            borderColor: color
        }
    }

    useEffect(() => {
        if (id) {
            fetchTask();
        }
    }, [id])

    if (!task) {
        return null
    }

    return (

        <div className="task-details">
            <Grid container spacing={2}>
                <Grid size={8}>
                    <Card>
                        <CardContent>

                            <RowWidget title={"Title"}>
                                <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                    {task.title}
                                </Typography>
                            </RowWidget>

                            <RowWidget title={"Description"}>
                                <Typography variant="body1" >
                                    {task.description}
                                </Typography>
                            </RowWidget>

                            <RowWidget title={"Due Date"}>
                                <Typography variant="body1">
                                    {task.deadLine}
                                </Typography>
                            </RowWidget>

                            <RowWidget title={"Priority"}>
                                <Chip
                                    label={task.priority
                                        .charAt(0)
                                        .toUpperCase() +
                                        task.priority.slice(1)}
                                    sx={renderChipStyle()}
                                    variant="outlined"
                                />
                            </RowWidget>

                            <RowWidget title={"Assigned To"}>
                                <Typography variant="body1">
                                    {task.assignedTo}
                                </Typography>
                            </RowWidget>

                            <RowWidget title={"Attachment"}>
                                <Typography variant="h5">
                                    <Box mt={2}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            startIcon={<UploadIcon />}
                                        >
                                            Upload Image
                                            <input hidden type="file" onChange={handleImageUpload} />
                                        </Button>
                                    </Box>
                                    {task.attachment && (
                                        <Box mt={2} display="flex" justifyContent="center">
                                            <img
                                                src={task.attachment}
                                                alt="Uploaded"
                                                className="attachment"
                                            />
                                        </Box>
                                    )}
                                </Typography>
                            </RowWidget>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};


export default TaskDetails;
