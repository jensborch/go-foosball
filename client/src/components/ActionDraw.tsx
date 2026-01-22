import {
  Drawer as MuiDrawer,
  List,
  ListItemButton,
  ListItemIcon as MuiListItemIcon,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import TimelineIcon from "@mui/icons-material/Timeline";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { MenuOffset } from "./Styled";
import { useState } from "react";
import AddPlayersDialog from "./AddPlayersDialog";
import AddTableDialog from "./AddTableDialog";
import HistoryChartDialog from "./HistoryChartDialog";

type ActionDrawProps = {
  tournament: string;
};

import { styled, type Theme } from "@mui/material/styles";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop: string) => prop !== "open",
})(({ theme }: { theme: Theme }) => ({
  width: theme.spacing(10),
  boxSizing: "border-box",
}));

const ListItemIcon = styled(MuiListItemIcon, {
  shouldForwardProp: (prop: string) => prop !== "open",
})(() => ({
  minWidth: 0,
}));

const ActionDraw = ({ tournament }: ActionDrawProps) => {
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
          <Tooltip title="Statistics">
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
          </Tooltip>
          <Tooltip title="Add players">
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
          </Tooltip>
          <Tooltip title="Add table">
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
          </Tooltip>
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
