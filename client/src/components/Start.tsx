import { Fab } from '@mui/material';
import { useState } from 'react';
import Timer from './Timer';
import TimerIcon from '@mui/icons-material/Timer';

const Start = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Fab onClick={() => setOpen(true)} color="default" aria-label="Start">
        <TimerIcon />
      </Fab>
      <Timer timeout={2 * 60} open={open} setOpen={setOpen} />
    </>
  );
};

export default Start;
