import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTimer } from 'react-use-precision-timer';

type TimerProps = {
  timeout: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Timer = ({ timeout, open, setOpen }: TimerProps) => {
  const [countdown, setCountdown] = useState(timeout);
  const timer = useTimer({
    delay: 1000,
    callback: doCountDown,
  });

  function doCountDown() {
    if (countdown > 0) {
      setCountdown(countdown - 1);
    } else {
      timer.stop();
    }
  }

  useEffect(() => {
    if (open) {
      setCountdown(timeout);
      timer.start();
    }
  }, [open]);

  function format(time: number) {
    return time < 10 ? '0' + time : time;
  }

  function printCountDown(time: number) {
    return format(minutes(time)) + ':' + format(seconds(time));
  }

  function minutes(time: number) {
    return Math.floor(time / 60);
  }

  function seconds(time: number) {
    return time % 60;
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Timer</DialogTitle>
      <DialogContent>
        <Typography noWrap={true} variant="h1">
          {printCountDown(countdown)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            timer.stop();
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
