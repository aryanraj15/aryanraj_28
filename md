<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>

                <DatePicker
                  margin="0"
                  id="LeaveStartDate"
                  name="LeaveStartDate"
                  minDate={today}
                  shouldDisableDate={isWeekend}
                  label="Leave Start Date"
                  sx={{ width: "100%" }}
                  // maxDate={new Date()}
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      margin="0"
                      required
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>



<Grid item xs={12} sm={4} md={4} lg={4}>
                <Autocomplete
                  margin="0"
                  id="Leave"
                  name="Leave"
                  options={values}
                  sx={{ width: "100%" }}
                  required
                  fullWidth
                  onChange={formik.handleChange}
                  renderInput={(params) => 
                  <TextField 
                    {...params}
                    label="Leave"
                    required
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.errors.Leave && formik.touched.Leave ? formik.errors.Leave : null
                    }
                    error={
                      formik.errors.Leave && formik.touched.Leave ? true : false
                    }
                  />}
                />
              </Grid>

              onChange={(event, newValue) => {
      formik.setFieldValue('Leave', newValue); // Set the field value in Formik
    }}




  const values = [
    {
      id: 1,
      label: "Sick Leave",
    },
    {
      id: 2,
      label: " Normal Leave",
    },
  ];
