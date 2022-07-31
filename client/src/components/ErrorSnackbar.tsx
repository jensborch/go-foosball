import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState } from 'react';

export interface ErrorSnakbarProps {
  msg?: string;
}

const ErrorSnackbar = ({ msg }: ErrorSnakbarProps) => {
  const [open, setOpen] = useState(msg ? true : false);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default ErrorSnackbar;
