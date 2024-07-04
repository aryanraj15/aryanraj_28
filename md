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
