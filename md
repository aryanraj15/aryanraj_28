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
