import { Button, Grid } from '@mui/material';
import FullScreenDialog from './FullScreenDialog';
import PlayersGrid from './PlayersGrid';

type AddPlayersProps = {
  tournament: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AddPlayers = ({ tournament, open, setOpen }: AddPlayersProps) => {
  return (
    <FullScreenDialog
      open={open}
      setOpen={setOpen}
    >
        <Grid spacing={2} container direction="column">
          <Grid item>
            <PlayersGrid tournament={tournament} />
          </Grid>
          <Grid item>
            <Button
              sx={{ margin: (theme) => theme.spacing(2) }}
              variant="contained"
              color="secondary"
              onClick={() => setOpen(false)}
            >
              Dismiss
            </Button>
          </Grid>
        </Grid>
    </FullScreenDialog>
  );
};

export default AddPlayers;
