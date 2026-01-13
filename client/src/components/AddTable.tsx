import { Button, Grid, TextField } from "@mui/material";
import { SetStateAction, useState } from "react";

const AddTable = () => {
  const [name, setName] = useState("");
  const [leftColor, setLeftColor] = useState("");
  const [rightColor, setRightColor] = useState("");
  function create(): void {}
  return (
    <Grid container direction="column">
      <Grid>
        <TextField
          helperText="Name"
          value={name}
          onChange={(event: { target: { value: SetStateAction<string> } }) =>
            setName(event.target.value)
          }
        />
      </Grid>
      <Grid>
        <TextField
          helperText="Right Color"
          value={rightColor}
          onChange={(event: { target: { value: SetStateAction<string> } }) =>
            setRightColor(event.target.value)
          }
        />
      </Grid>
      <Grid>
        <TextField
          helperText="Left Color"
          value={leftColor}
          onChange={(event: { target: { value: SetStateAction<string> } }) =>
            setLeftColor(event.target.value)
          }
        />
      </Grid>
      <Grid>
        <Button variant="outlined" onClick={create}>
          Create
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddTable;
