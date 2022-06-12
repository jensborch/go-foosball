import { Button, Modal, Typography } from '@mui/material';
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
}

type TimerProps = {
  timeout: number
  open: boolean
  setOpen: (open: boolean) => void 
}

const Timer = ({timeout, open, setOpen}: TimerProps) => {
  const [countdown ,setCountdown] = useState(timeout);

  useEffect(() => {
    setInterval(timer, 1000);
  });

  function timer() {
    if (timeout >= 0) {
    setCountdown(--timeout);
    }
  }

  function format(time: number) {
    return time < 10 ? '0' + time : time;
  }

  function printCountDown(time: number) {
    return (
      format(minutes(time)) +
      ':' +
      format(seconds(time))
    );
  }

  function minutes(time: number) {
    return Math.floor(time / 60);
  }

  function seconds(time: number) {
    return time % 60;
  }

    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          <div>
            <Typography noWrap={true} variant="h2">
              Timer
            </Typography>
            <Typography noWrap={true} variant="h1">
              {printCountDown(countdown)}
            </Typography>
          </div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }


export default Timer;
