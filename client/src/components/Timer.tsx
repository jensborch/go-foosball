import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ColorHex, CountdownCircleTimer } from "react-countdown-circle-timer";
import { theme } from "./Theming";

type TimerProps = {
  timeout: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Timer = ({ timeout, open, setOpen }: TimerProps) => {
  const primary = theme.palette.secondary.main as ColorHex;
  const light = theme.palette.secondary.light as ColorHex;
  const dark = theme.palette.secondary.dark as ColorHex;
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Timer</DialogTitle>
      <DialogContent>
        <CountdownCircleTimer
          isPlaying
          duration={timeout}
          colors={[light, primary, dark]}
          colorsTime={[40, 80, 120]}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Timer;
