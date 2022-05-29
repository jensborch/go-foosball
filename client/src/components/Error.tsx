import { Alert } from "@mui/material";

export interface ErrorProps {
  msg?: string;
}

export const Error = ({ msg }: ErrorProps) => {
  return <Alert severity="error">{msg}</Alert>;
};
