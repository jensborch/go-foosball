import { Button, Grid, Modal, Paper } from '@mui/material';
import PlayersGrid from './PlayersGrid';

type AddPlayersProps = {
  tournament: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AddPlayers = ({ tournament, open, setOpen }: AddPlayersProps) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        //position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Paper>
        <Grid
          //sx={{ overflow: 'auto', margin: (theme) => theme.spacing(2) }}
          //spacing={10}
          spacing={2}
          container
          direction="column"
        >
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
      </Paper>
    </Modal>
  );
};

export default AddPlayers;
