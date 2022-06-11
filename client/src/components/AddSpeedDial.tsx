import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import AddPlayers from './AddPlayers';
import AddTableDialog from './AddTableDialog';

type AddSpeedDialProps = {
  tournament: string;
};

const AddSpeedDial = ({ tournament }: AddSpeedDialProps) => {
  const [open, setOpen] = useState(false);
  const [playersOpen, setPlayersOpen] = useState(false);
  const [tablesOpen, setTablesOpen] = useState(false);
  return (
    <>
      <SpeedDial
        sx={{
          margin: (theme) => theme.spacing(),
          position: 'absolute',
          bottom: '20px',
          right: '20px',
        }}
        ariaLabel="Add"
        icon={<SpeedDialIcon />}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        direction="up"
        open={open}
      >
        <SpeedDialAction
          tooltipTitle="Add player"
          icon={<PersonIcon />}
          onClick={() => {
            setOpen(false);
            setPlayersOpen(true);
          }}
        />
        <SpeedDialAction
          tooltipTitle="Add table"
          icon={<AddIcon />}
          onClick={() => {
            setOpen(false);
            setTablesOpen(true);
          }}
        />
      </SpeedDial>
      <AddPlayers
        open={playersOpen}
        setOpen={setPlayersOpen}
        tournament={tournament}
      />
      <AddTableDialog
        open={tablesOpen}
        setOpen={setTablesOpen}
        tournament={tournament}
      />
    </>
  );
};

export default AddSpeedDial;
