import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ColorHex, CountdownCircleTimer } from "react-countdown-circle-timer";
import { theme } from "./Theming";
import Grid from "@mui/material/Grid";

type TimerProps = {
  timeout: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type RenderTimeProps = {
  remainingTime: number;
};

const renderTime = ({ remainingTime }: RenderTimeProps) => {
  if (remainingTime === 0) {
    return <Typography variant="h5">Game over</Typography>;
  }

  return (
    <>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography variant="caption">Remaining</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h2">{remainingTime}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption">seconds</Typography>
        </Grid>
      </Grid>
    </>
  );
};

type ColorsTimesType = { 0: number } & { 1: number } & number[];

const colorsTimes = (timeout: number, colors: number): ColorsTimesType => {
  const result = [];
  for (let i = 0; i < colors; i++) {
    result.push((timeout / colors) * i);
  }
  return [timeout, ...result, 0] as any;
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
          colorsTime={colorsTimes(timeout, 3)}
        >
          {renderTime}
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
