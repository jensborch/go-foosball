import FullScreenDialog from "./FullScreenDialog";
import * as Api from "../api/Api";
import {
  CircularProgress,
  TextField,
  Box,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { Error } from "./Error";
import {
  useTableMutation,
  useTables,
  useTournament,
  useTournamentTableMutation,
  useTournamentTableDeleteMutation,
  useTournamentTables,
} from "../api/hooks";
import ErrorSnackbar from "./ErrorSnackbar";
import { StyledCard, StyledCardHeader } from "./Styled";
import { useState, ChangeEvent, useEffect } from "react";

type ExistingTableProps = {
  tournament: string;
  table: Api.Table;
  tournamentTable?: Api.TournamentTable;
};

const ExistingTable = ({ tournament, table }: Readonly<ExistingTableProps>) => {
  const {
    mutate: mutateTourTable,
    error,
    isError,
    isPending,
  } = useTournamentTableMutation(tournament);

  const handleTableSelect = () => {
    mutateTourTable(table.id);
  };

  return (
    <>
      {isError && <ErrorSnackbar msg={error?.message} />}
      <TableRow
        sx={{
          "&:hover": { backgroundColor: "action.hover" },
        }}
      >
        <TableCell>{table.name}</TableCell>
        <TableCell>{table.color.right}</TableCell>
        <TableCell>{table.color.left}</TableCell>
        <TableCell align="right" sx={{ pr: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleTableSelect}
              disabled={isPending}
              sx={{ minWidth: 90, width: 90 }}
            >
              <Typography variant="button">Add</Typography>
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

type RemoveTableProps = {
  tournament: string;
  table: Api.TournamentTable;
};

const RemoveTable = ({ tournament, table }: Readonly<RemoveTableProps>) => {
  const {
    mutate: removeTable,
    error,
    isError,
    isPending,
  } = useTournamentTableDeleteMutation(tournament, table.table.id.toString());

  const handleTableRemove = () => {
    removeTable();
  };

  return (
    <>
      {isError && <ErrorSnackbar msg={error?.message} />}
      <TableRow
        sx={{
          "&:hover": { backgroundColor: "action.hover" },
        }}
      >
        <TableCell>{table.table.name}</TableCell>
        <TableCell>{table.table.color.right}</TableCell>
        <TableCell>{table.table.color.left}</TableCell>
        <TableCell align="right" sx={{ pr: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              onClick={handleTableRemove}
              disabled={isPending}
              sx={{ minWidth: 90, width: 90 }}
            >
              <Typography variant="button">Remove</Typography>
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

const NewTable = () => {
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
    },
  };

  const [name, setName] = useState("");
  const [right, setRight] = useState("");
  const [left, setLeft] = useState("");

  const { mutate, error, isError, isPending, isSuccess, reset } =
    useTableMutation();

  useEffect(() => {
    if (isSuccess) {
      setName("");
      setRight("");
      setLeft("");
      reset();
    }
  }, [isSuccess, reset]);

  const handleTableCreate = () => {
    mutate({
      name,
      color: {
        right,
        left,
      },
    });
  };

  return (
    <>
      {isError && <ErrorSnackbar msg={error?.message} />}
      <TableRow
        sx={{
          "&:hover": { backgroundColor: "action.hover" },
        }}
      >
        <TableCell>
          <TextField
            size="small"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder="Table name*"
            required
            sx={textFieldSx}
          />
        </TableCell>
        <TableCell>
          <TextField
            size="small"
            value={right}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRight(e.target.value)
            }
            placeholder="Right color*"
            required
            sx={textFieldSx}
          />
        </TableCell>
        <TableCell>
          <TextField
            size="small"
            value={left}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLeft(e.target.value)
            }
            placeholder="Left color*"
            required
            sx={textFieldSx}
          />
        </TableCell>
        <TableCell align="right" sx={{ pr: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handleTableCreate}
              disabled={
                !name.trim() || !right.trim() || !left.trim() || isPending
              }
              sx={{ minWidth: 90, width: 90 }}
            >
              <Typography variant="button">Create</Typography>
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

type AvailableTablesCardProps = {
  tournament: string;
};

const AvailableTablesCard = ({ tournament }: AvailableTablesCardProps) => {
  const {
    data: tables,
    status: tablesStatus,
    error: tablesError,
  } = useTables();
  const {
    data: tournamentTables,
    status: tournamentTablesStatus,
    error: tournamentTablesError,
  } = useTournamentTables(tournament);

  const isLoading =
    tablesStatus === "pending" || tournamentTablesStatus === "pending";
  const isError =
    tablesStatus === "error" || tournamentTablesStatus === "error";
  const errorMessage = tablesError?.message || tournamentTablesError?.message;

  return (
    <StyledCard elevation={2}>
      <StyledCardHeader
        title={`Available Tables ${tables ? "(" + tables.length + ")" : ""}`}
      />
      <CardContent>
        {isLoading && (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        )}
        {isError && <Error msg={errorMessage} />}
        {!isLoading && !isError && (
          <TableContainer component={Paper} elevation={0}>
            <Table size="small" aria-label="available tables table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      Right Color
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      Left Color
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold">
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tournamentTables
                  ?.slice()
                  .sort((a, b) => a.table.name.localeCompare(b.table.name))
                  .map((table) => (
                    <RemoveTable
                      key={table.id}
                      tournament={tournament}
                      table={table}
                    />
                  ))}
                {tables
                  ?.slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((table) => {
                    const tournamentTable = tournamentTables?.find(
                      (tt) => tt.table.id === table.id
                    );
                    if (tournamentTable) return null;
                    return (
                      <ExistingTable
                        key={table.id}
                        tournament={tournament}
                        table={table}
                        tournamentTable={tournamentTable}
                      />
                    );
                  })}
                <NewTable />
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </StyledCard>
  );
};

type AddTableProps = {
  tournament: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AddTableDialog = ({ tournament, open, setOpen }: AddTableProps) => {
  const { status, error } = useTournament(tournament);

  return (
    <FullScreenDialog setOpen={setOpen} open={open} title="Add table">
      {status === "pending" && <CircularProgress />}
      {status === "error" && <Error msg={error?.message} />}
      {status === "success" && (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          <AvailableTablesCard tournament={tournament} />
        </Box>
      )}
    </FullScreenDialog>
  );
};

export default AddTableDialog;
