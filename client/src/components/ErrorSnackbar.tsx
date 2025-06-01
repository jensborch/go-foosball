import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import { useState } from "react";

export interface ErrorSnakbarProps {
  msg?: string;
  severity?: AlertColor;
  autoHideDuration?: number;
}

const ErrorSnackbar = ({
  msg,
  severity = "error",
  autoHideDuration = 6000,
}: ErrorSnakbarProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default ErrorSnackbar;
