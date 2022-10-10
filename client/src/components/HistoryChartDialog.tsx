import FullScreenDialog from "./FullScreenDialog";
import HistoryChart from "./HistoryChart";

type HistoryChartDialogProps = {
  tournament: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const HistoryChartDialog = ({
  open,
  setOpen,
  tournament,
}: HistoryChartDialogProps) => {
  return (
    <FullScreenDialog setOpen={setOpen} open={open} title="History chart">
      <HistoryChart tournament={tournament} />
    </FullScreenDialog>
  );
};

export default HistoryChartDialog;
