import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Grid2";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import { LocalStorageAdaptor } from "../../../services/adaptors";
import AppSettingService from "../../../services/app-settings-service";

const service = new AppSettingService(new LocalStorageAdaptor());

const Schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

const initialValues = {
  name: "",
  description: "",
};

const AddColumnModal = ({ isOpen, onClose }) => {

  const [error, setError] = useState(null);

  const onSubmit = (values) => {
    try {
      const model = {
        ...values,
        id: values.name.trim().toLowerCase().replace(/ /g, '_'),
      };
      service.createColumn(model);
      onClose(true);
    } catch (error) {
      setError(error.message)
    }
  };

  return (
    <Dialog open={isOpen} onClose={(event, reason) => {
      if (reason === 'backdropClick') {
        return;
      }
      onClose();
    }}>
      <DialogTitle>Add Column</DialogTitle>

      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={Schema}
          onSubmit={onSubmit}
        >
          {({ handleChange, values, errors, touched,handleSubmit }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                name="name"
                fullWidth
                autoComplete="off"
                variant="outlined"
                size="small"
                value={values.name}
                onChange={handleChange}
                error={Boolean(errors.name && touched.name)}
                helperText={touched.name && errors.name ? errors.name : ""}
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
                rows={4}
                value={values.description}
                onChange={handleChange}
                error={Boolean(errors.description && touched.description)}
              />

              {error != null && (
                <Typography variant="subtitle1" color="red">{error}</Typography>
              )}
              <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={onClose}>
                  Close
                </Button>
                <Button variant="contained" type="submit" sx={{ ml: 1 }}>
                  Add
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddColumnModal;
