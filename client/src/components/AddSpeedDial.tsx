import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";

type AddSpeedDialProps = {
  tournament?: string;
};

const AddSpeedDial = ({ tournament }: AddSpeedDialProps) => {
  const [state, setState] = useState({
    open: false,
    playersOpen: false,
    tablesOpen: false,
  });
  const open = () => {
    setState((s) => ({ ...s, open: true }));
  };
  const close = () => {
    setState((s) => ({ ...s, open: false }));
  };
  const openPlayer = () => {
    setState((s) => ({ ...s, playerOpen: true }));
  };
  const closePlayer = () => {
    setState((s) => ({ ...s, playerOpen: false }));
  };
  const openTable = () => {
    setState((s) => ({ ...s, tableOpen: true }));
  };
  const closeTable = () => {
    setState((s) => ({ ...s, tableOpen: false }));
  };

  return (
    <SpeedDial
      sx={{
        margin: (theme) => theme.spacing(),
        position: "absolute",
        bottom: "20px",
        right: "20px",
      }}
      ariaLabel="Add"
      color="green"
      icon={<SpeedDialIcon />}
      onOpen={open}
      onClose={close}
      direction="up"
      open={state.open}
    >
      <SpeedDialAction
        tooltipTitle="Add player"
        icon={<PersonIcon />}
        onClick={openPlayer}
      />
      <SpeedDialAction
        tooltipTitle="Add table"
        icon={<AddIcon />}
        onClick={openTable}
      />
    </SpeedDial>
  );
};

export default AddSpeedDial;
