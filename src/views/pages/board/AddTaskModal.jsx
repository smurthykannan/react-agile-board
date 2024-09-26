import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Grid2";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl, InputLabel, Select, MenuItem, Typography, FormHelperText
} from "@mui/material";
import { LocalStorageAdaptor } from "../../../services/adaptors";
import TasksService from "../../../services/task-service";

const service = new TasksService(new LocalStorageAdaptor());

const Schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  deadLine: Yup.string().required("Due Date is required"),
  priority: Yup.string().required("Priority is required"),
  assignedTo: Yup.string().required("Assigned To is required"),
});

const INITIALVALUES = {
  title: "",
  description: "",
  deadLine: "",
  priority: "",
  assignedTo: "",
};

const AddTaskModal = ({ isOpen, onClose, item }) => {
  const [initialValues, setInitialValues] = useState(INITIALVALUES);
  const [error, setError] = useState(null);

  const onSubmit = (values) => {
    try {
      if (item !== null && item.id) {
        service.updateTask({
          ...item,
          ...values
        });
      } else {
        const model = {
          ...values,
          id: uuidv4(),
          state: "defined"
        };
        service.createTask(model);
      }
      onClose(true);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (item) {
      setInitialValues({
        title: item.title,
        description: item.description,
        deadLine: item.deadLine,
        priority: item.priority,
        assignedTo: item.assignedTo
      });
    } else {
      setInitialValues(INITIALVALUES);
    }
  }, [item]);

  return (
    <Dialog open={isOpen} onClose={(event, reason) => {
      if (reason === 'backdropClick') {
        return;
      }
      onClose();
    }}>
      <DialogTitle>{item != null ? "Update Task" : "Create Task"}</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={Schema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ handleChange, values, errors, touched }) => (
            <Form>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                type="text"
                name="title"
                fullWidth
                variant="outlined"
                size="small"
                value={values.title}
                onChange={handleChange}
                error={Boolean(errors.title && touched.title)}
                helperText={touched.title && errors.title ? errors.title : ""}
              />

              <TextField
                autoFocus
                margin="dense"
                label="Description"
                type="text"
                name="description"
                fullWidth
                variant="outlined"
                size="small"
                multiline
                rows={3}
                value={values.description}
                onChange={handleChange}
                error={Boolean(errors.description && touched.description)}
                helperText={touched.description && errors.description ? errors.description : ""}
              />

              <TextField
                autoFocus
                margin="dense"
                label="Due Date"
                type="text"
                name="deadLine"
                fullWidth
                variant="outlined"
                size="small"
                value={values.deadLine}
                onChange={handleChange}
                error={Boolean(errors.deadLine && touched.deadLine)}
                helperText={touched.deadLine && errors.deadLine ? errors.deadLine : ""}
              />

              <FormControl
                fullWidth
                error={Boolean(errors.priority && touched.priority)}
                size="small"
              >
                <InputLabel id="priority-select-label" htmlFor="Priority">Priority</InputLabel>
                <Select
                  labelId="priority-select-label"
                  id="priority-select"
                  value={values.priority}
                  label="Priority"
                  onChange={handleChange}
                  name="priority"
                >
                  <MenuItem value={"low"}>Low</MenuItem>
                  <MenuItem value={"medium"}>Medium</MenuItem>
                  <MenuItem value={"high"}>High</MenuItem>
                </Select>
                {touched.priority && errors.priority && (
                  <FormHelperText>{errors.priority}</FormHelperText>
                )}
              </FormControl>

              <TextField
                autoFocus
                margin="dense"
                label="Assigned To"
                type="text"
                name="assignedTo"
                fullWidth
                variant="outlined"
                size="small"
                value={values.assignedTo}
                onChange={handleChange}
                error={Boolean(errors.assignedTo && touched.assignedTo)}
                helperText={touched.assignedTo && errors.assignedTo ? errors.assignedTo : ""}
              />
              {error != null && (
                <Typography variant="subtitle1" color="red">{error}</Typography>
              )}

              <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={onClose}>
                  Close
                </Button>
                <Button variant="contained" type="submit" sx={{ ml: 1 }}>
                  {item !== null ? "Update" : "Create"}
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;

