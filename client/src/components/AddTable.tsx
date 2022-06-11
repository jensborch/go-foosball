import {
  Button,
  Grid,
  TextField,
} from '@mui/material';
import { useState } from 'react';

const AddTable = () => {
  const [name, setName] = useState('');
  const [leftColor, setLeftColor] = useState('');
  const [rightColor, setRightColor] = useState('');
  function create(): void {}
  return (
    <Grid item container direction="column">
      <Grid item>
        <TextField
          helperText="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          helperText="Right Color"
          value={rightColor}
          onChange={(event) => setRightColor(event.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          helperText="Left Color"
          value={leftColor}
          onChange={(event) => setLeftColor(event.target.value)}
        />
      </Grid>
      <Grid item>
        <Button variant="outlined" onClick={create}>
          Create
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddTable;
