import {
  CircularProgress,
  Dialog,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
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
  function handleSelect(id: number): void {}
  function handleAdd(): void {}
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
    </FullScreenDialog>
  );
};

export default AddTableDialog;
