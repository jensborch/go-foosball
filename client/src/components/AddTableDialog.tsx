import {
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
} from "@mui/material";
import {
  useTableMutation,
  useTables,
  useTournamentTableMutation,
} from "../api/hooks";
import { Error } from "./Error";
import AddIcon from "@mui/icons-material/Add";
import FullScreenDialog from "./FullScreenDialog";
import { ChangeEvent, useState } from "react";
import ErrorSnackbar from "./ErrorSnackbar";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import * as Api from "../api/Api";

type AddTableProps = {
  tournament: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AddTableDialog = ({ tournament, open, setOpen }: AddTableProps) => {
  const { status, error, data } = useTables(Number.parseInt(tournament));
  const {
    mutate: mutateTable,
    error: mutateError,
    isError: isMutateError,
  } = useTableMutation();
  const {
    mutate: mutateTourTable,
    error: mutateTourError,
    isError: isMutateTourError,
  } = useTournamentTableMutation(tournament);
  const [table, setTable] = useState("");
  const [right, setRight] = useState("");
  const [left, setLeft] = useState("");
  function handleSelect(id: number): void {
    mutateTourTable(id);
  }
  function handleAdd(event: ChangeEvent<HTMLFormElement>): void {
    event.preventDefault();
    mutateTable({
      name: table,
      color: {
        left,
        right,
      },
    });
    setTable("");
    setRight("");
    setLeft("");
  }
  return (
    <FullScreenDialog setOpen={setOpen} open={open} title="Add table">
      {isMutateError && <ErrorSnackbar msg={mutateError.message} />}
      {isMutateTourError && <ErrorSnackbar msg={mutateTourError.message} />}
      {status === "pending" && <CircularProgress />}
      {status === "error" && <Error msg={error?.message} />}
      {status === "success" && (
        <List>
          {data?.map((table: Api.Table) => (
            <ListItemButton
              key={table.id}
              onClick={() => handleSelect(table.id)}
            >
              <ListItemIcon>
                <IconButton>
                  <TableRestaurantIcon />
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={table.name}
                secondary={`${table.color.right}/${table.color.left}`}
              />
            </ListItemButton>
          ))}
          {(data ? data.length > 0 : false) && <Divider />}
          <ListSubheader>
            <form onSubmit={handleAdd}>
              <ListItem>
                <TextField
                  sx={{ m: 2 }}
                  type="string"
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  label="New table"
                  variant="standard"
                />
                <TextField
                  sx={{ m: 2 }}
                  type="string"
                  value={right}
                  onChange={(e) => setRight(e.target.value)}
                  label="Right color"
                  variant="standard"
                />
                <TextField
                  type="string"
                  value={left}
                  onChange={(e) => setLeft(e.target.value)}
                  label="Left color"
                  variant="standard"
                />
                <IconButton type="submit">
                  <AddIcon />
                </IconButton>
              </ListItem>
            </form>
          </ListSubheader>
        </List>
      )}
    </FullScreenDialog>
  );
};

export default AddTableDialog;
