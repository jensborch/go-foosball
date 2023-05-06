import {
  Drawer as MuiDrawer,
  List,
  ListItemButton,
  ListItemIcon as MuiListItemIcon,
  styled,
  Divider,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import TimelineIcon from "@mui/icons-material/Timeline";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { MenuOffset } from "./Styled";
import { useState } from "react";
import AddPlayersDialog from "./AddPlayersDialog";
import AddTableDialog from "./AddTableDialog";
import HistoryChartDialog from "./HistoryChartDialog";
import { useQueryClient } from "react-query";
import { CacheKeys } from "../api/hooks";
import Start from "./Start";

type ActionDrawProps = {
  tournament: string;
};

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: theme.spacing(10),
  boxSizing: "border-box",
}));

const ListItemIcon = styled(MuiListItemIcon, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  minWidth: 0,
}));

const ActionDraw = ({ tournament }: ActionDrawProps) => {
  const queryClient = useQueryClient();
  const [playersOpen, setPlayersOpen] = useState(false);
  const [tablesOpen, setTablesOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  return (
    <>
      <Drawer variant="permanent" open={true}>
        <List
          sx={{
            alignContent: "center",
          }}
        >
          <MenuOffset />
          <ListItemButton>
            <ListItemIcon>
              <Start tournament={tournament} />
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <RefreshIcon
                onClick={() =>
                  queryClient.invalidateQueries(CacheKeys.RandomGames)
                }
                fontSize="large"
              />
            </ListItemIcon>
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemIcon>
              <TimelineIcon
                onClick={() => {
                  setChartOpen(true);
                }}
                fontSize="large"
              />
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon
                onClick={() => {
                  setPlayersOpen(true);
                }}
                fontSize="large"
              />
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <TableRestaurantIcon
                onClick={() => {
                  setTablesOpen(true);
                }}
                fontSize="large"
              />
            </ListItemIcon>
          </ListItemButton>
        </List>
      </Drawer>
      <AddPlayersDialog
        open={playersOpen}
        setOpen={setPlayersOpen}
        tournament={tournament}
      />
      <AddTableDialog
        open={tablesOpen}
        setOpen={setTablesOpen}
        tournament={tournament}
      />
      <HistoryChartDialog
        open={chartOpen}
        setOpen={setChartOpen}
        tournament={tournament}
      />
    </>
  );
};

export default ActionDraw;
