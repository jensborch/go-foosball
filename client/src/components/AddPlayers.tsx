import { Button, Grid, Modal, Paper } from '@mui/material';
import { useState } from 'react';
import PlayersGrid from './PlayersGrid';

type AddPlayersProps = {
  tournament: string
}

const AddPlayers = ({tournament}: AddPlayersProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Paper>
        <Grid
          sx={{ overflow: 'auto' }}
          container={true}
          direction="column"
          spacing={8}
        >
          <PlayersGrid
            tournament={tournament}
          />
          <Button
            sx={{ margin: (theme) => theme.spacing(2) }}
            variant="contained"
            color="secondary"
            onClick={() => setOpen(false)}
          >
            Dismiss
          </Button>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default AddPlayers;
