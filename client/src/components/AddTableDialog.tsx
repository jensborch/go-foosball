import {
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useTables } from '../api/hooks';
import { Error } from './Error';
import AddIcon from '@mui/icons-material/Add';
import FullScreenDialog from './FullScreenDialog';

type AddTableProps = {
  tournament: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AddTableDialog = ({ tournament, open, setOpen }: AddTableProps) => {
  const { status, error, data } = useTables();
  const [name, setName] = useState('');
  const [leftColor, setLeftColor] = useState('');
  const [rightColor, setRightColor] = useState('');
  function handleSelect(id: number): void {}
  function handleAdd(): void {}
  function create(): void {}
  if (status === 'loading') {
    return (
      <Dialog onClose={() => setOpen(false)} open={open}>
        <CircularProgress />
      </Dialog>
    );
  }
  if (status === 'error') {
    return (
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Error msg={error?.message}></Error>
      </Dialog>
    );
  }
  return (
    <FullScreenDialog setOpen={setOpen} open={open} title="Add table">
      <div>
        <List>
          {data?.map((table) => (
            <ListItem
              key={table.id}
              button
              onClick={() => handleSelect(table.id)}
            >
              <ListItemText primary={table.name} />
            </ListItem>
          ))}
          {(data ? data.length > 0 : false) && <Divider />}
          <ListItem button onClick={() => handleAdd()}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New table" />
          </ListItem>
        </List>
        <Grid container direction="column">
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
      </div>
    </FullScreenDialog>
  );
};

export default AddTableDialog;
