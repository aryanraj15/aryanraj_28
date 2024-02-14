<Grid item xs={12} sm={4} md={4} lg={4}>
  <Autocomplete
    margin="0"
    id="LeavestartTime"
    name="LeavestartTime"
    options={time}
    getOptionLabel={(option) => option.label}
    sx={{ width: "100%" }}
    required
    fullWidth
    value={time.find((option) => option.id === formik.values.LeavestartTime)}
    onChange={(_, newValue) => {
      formik.setFieldValue("LeavestartTime", newValue ? newValue.id : "");
    }}
    renderInput={(params) => <TextField {...params} label="Time" required />}
  />
</Grid>

<Grid item xs={12} sm={4} md={4} lg={4}>
  <Autocomplete
    margin="0"
    id="LeaveEndTime"
    name="LeaveEndTime"
    options={time}
    getOptionLabel={(option) => option.label}
    sx={{ width: "100%" }}
    required
    fullWidth
    value={time.find((option) => option.id === formik.values.LeaveEndTime)}
    onChange={(_, newValue) => {
      formik.setFieldValue("LeaveEndTime", newValue ? newValue.id : "");
    }}
    renderInput={(params) => <TextField {...params} label="Time" required />}
  />
</Grid>
