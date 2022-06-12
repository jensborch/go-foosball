import { Fab } from '@mui/material';
import { useState } from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import Timer from './Timer';

const Start = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Fab color="default" aria-label="add" onClick={() => setOpen(true)}>
        <LaunchIcon />
      </Fab>
      <Timer
        timeout={2 * 60}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default Start;
