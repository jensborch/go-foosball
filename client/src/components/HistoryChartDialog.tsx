import { Fab } from "@mui/material";
import { useState } from "react";
import TimelineIcon from "@mui/icons-material/Timeline";
import FullScreenDialog from "./FullScreenDialog";
import HistoryChart from "./HistoryChart";

const HistoryChartDialog = ({ tournament }: { tournament: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fab onClick={() => setOpen(true)} color="default" aria-label="Start">
        <TimelineIcon />
      </Fab>
      <FullScreenDialog setOpen={setOpen} open={open} title="History chart">
        <HistoryChart tournament={tournament} />
      </FullScreenDialog>
    </>
  );
};

export default HistoryChartDialog;
