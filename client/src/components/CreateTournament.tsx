import { Fab } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import CreateTournamentDialog from './CreateTournamentDialog';

export const CreateTournament = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Fab
        color="default"
        aria-label="Create tournament"
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>
      <CreateTournamentDialog open={open} setOpen={setOpen} />
    </>
  );
};
