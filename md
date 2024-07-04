<FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Is halfday?"
                />
              </FormGroup>

              <TextField
                    margin="0"
                    fullWidth
                    id="Suffix"
                    label="Suffix"
                    name="Suffix"
                    disabled
                    size="small"
                    value={formik.values.suffix || ""}
                    InputLabelProps={{ shrink: true }}

                  />


                  import React from 'react';
import { useFormik } from 'formik';
import { TextField, FormControlLabel, Checkbox, FormGroup } from '@material-ui/core';

const MyForm = () => {
  const formik = useFormik({
    initialValues: {
      isHalfday: false,
      suffix: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name="isHalfday"
              checked={formik.values.isHalfday}
              onChange={formik.handleChange}
            />
          }
          label="Is halfday?"
        />
      </FormGroup>

      {!formik.values.isHalfday && (
        <TextField
          margin="0"
          fullWidth
          id="Suffix"
          label="Suffix"
          name="suffix"
          size="small"
          value={formik.values.suffix}
          onChange={formik.handleChange}
          InputLabelProps={{ shrink: true }}
        />
      )}

      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;

