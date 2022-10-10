import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import TimelineIcon from "@mui/icons-material/Timeline";
import AddPlayersDialog from "./AddPlayersDialog";
import AddTableDialog from "./AddTableDialog";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import HistoryChartDialog from "./HistoryChartDialog";

type AddSpeedDialProps = {
  tournament: string;
};

const AddSpeedDial = ({ tournament }: AddSpeedDialProps) => {
  const [open, setOpen] = useState(false);
  const [playersOpen, setPlayersOpen] = useState(false);
  const [tablesOpen, setTablesOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  return (
    <>
      <SpeedDial
        ariaLabel="Add"
        icon={<SpeedDialIcon />}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        direction="down"
        open={open}
      >
        <SpeedDialAction
          tooltipTitle="History chart"
          icon={<TimelineIcon />}
          onClick={() => {
            setOpen(false);
            setChartOpen(true);
          }}
        />
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
          icon={<TableRestaurantIcon />}
          onClick={() => {
            setOpen(false);
            setTablesOpen(true);
          }}
        />
      </SpeedDial>
      <AddPlayersDialog
        open={playersOpen}
        setOpen={setPlayersOpen}
        tournament={tournament}
      />
      <AddTableDialog
        open={tablesOpen}
        setOpen={setTablesOpen}
        tournament={tournament}
      />
      <HistoryChartDialog
        open={chartOpen}
        setOpen={setChartOpen}
        tournament={tournament}
      />
    </>
  );
};

export default AddSpeedDial;
