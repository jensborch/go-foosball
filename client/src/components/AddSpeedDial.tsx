import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import AddPlayers from './AddPlayers';

type AddSpeedDialProps = {
  tournament: string;
};

const AddSpeedDial = ({ tournament }: AddSpeedDialProps) => {
  const [open, setOpen] = useState(false);
  const [playersOpen, setPlayersOpen] = useState(false);
  const [tablesOpen, setTablesOpen] = useState(false);
  return (
    <SpeedDial
      sx={{
        margin: (theme) => theme.spacing(),
        position: 'absolute',
        bottom: '20px',
        right: '20px',
      }}
      ariaLabel="Add"
      color="green"
      icon={<SpeedDialIcon />}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      direction="up"
      open={open}
    >
      <SpeedDialAction
        tooltipTitle="Add player"
        icon={<PersonIcon />}
        onClick={() => setPlayersOpen(true)}
      />
      <SpeedDialAction
        tooltipTitle="Add table"
        icon={<AddIcon />}
        onClick={() => setTablesOpen(true)}
      />
      <AddPlayers tournament={tournament} />
    </SpeedDial>
  );
};

export default AddSpeedDial;
