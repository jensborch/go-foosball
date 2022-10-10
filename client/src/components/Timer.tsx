import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  Typography,
} from "@mui/material";
import { ColorHex, CountdownCircleTimer } from "react-countdown-circle-timer";
import { theme } from "./Theming";
import Grid from "@mui/material/Grid";
import { forwardRef, useEffect } from "react";
import { TransitionProps } from "react-transition-group/Transition";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type TimerProps = {
  reset: number;
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

const PRIMARY = theme.palette.secondary.main as ColorHex;
const LIGHT = theme.palette.secondary.light as ColorHex;
const DARK = theme.palette.secondary.dark as ColorHex;

const Timer = ({ reset, timeout, open, setOpen }: TimerProps) => {
  const onComplete = (elapsed: number) => {
    const start = new Audio(`${process.env.PUBLIC_URL}/sounds/finish.wav`);
    start.play();
    setTimeout(() => setOpen(false), 4000);
  };
  useEffect(() => {
    if (open) {
      const start = new Audio(
        `${process.env.PUBLIC_URL}/sounds/duke/${Math.floor(
          Math.random() * 8
        )}.wav`
      );
      start.play();
    }
  }, [reset, open]);

  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogContent>
        <CountdownCircleTimer
          onComplete={onComplete}
          key={reset}
          isPlaying
          duration={10}
          colors={[LIGHT, PRIMARY, DARK]}
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
