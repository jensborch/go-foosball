import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

const styles = {
  paper: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '70%',
    height: '70%',
    backgroundColor: (theme: any) => theme.palette.background.paper,
    boxShadow: (theme: any) => theme.shadows[5],
    display: 'flex',
    flexFlow: 'column',
  },
  content: {
    textAlign: 'center',
    padding: (theme: any) => theme.spacing.unit * 4,
    flex: 1,
  },
  button: {
    align: 'center',
    padding: (theme: any) => theme.spacing.unit * 3,
  },
};

type TimerProps = {
  timeout: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Timer = ({ timeout, open, setOpen }: TimerProps) => {
  const [countdown, setCountdown] = useState(timeout);

  useEffect(() => {
    const t = setInterval(timer, 1000);
    return () => clearInterval(t)
  });

  function timer() {
    if (countdown >= 0) {
      setCountdown(countdown - 1);
    }
  }

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
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Timer;
