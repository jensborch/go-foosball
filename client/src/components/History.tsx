import CircularProgress from "@mui/material/CircularProgress";
import { useTournamentHistory } from "../api/hooks";
import { StyledCard, StyledCardHeader } from "./Styled";
import { Error } from "./Error";
import {
  Avatar,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Grid,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { TournamentHistory } from "../api/Api";
import isEqual from "date-fns/isEqual";

type HistoryProps = {
  tournament: string;
};

const findMin = (history: TournamentHistory[], nickname: string) => {
  const date = history
    .filter((h) => h.nickname === nickname)
    .map((h) => new Date(h.updated))
    .reduce((a, b) => (a < b ? a : b));
  return history.find(
    (h) => h.nickname === nickname && isEqual(new Date(h.updated), date)
  );
};

const findMax = (history: TournamentHistory[], nickname: string) => {
  const date = history
    .filter((h) => h.nickname === nickname)
    .map((h) => new Date(h.updated))
    .reduce((a, b) => (a > b ? a : b));
  return history.find(
    (h) => h.nickname === nickname && isEqual(new Date(h.updated), date)
  );
};

const historyDiff = (history?: TournamentHistory[]) => {
  const names = new Set(history?.map((p) => p.nickname));
  const result: [nickname: string, diff: number][] = [];
  names.forEach((n) => {
    const max = findMax(history!, n)?.ranking;
    const min = findMin(history!, n)?.ranking;
    if (min && max) {
      result.push([n, max - min]);
    }
  });
  return result.sort((a, b) => b[1] - a[1]);
};

const History = ({ tournament }: HistoryProps) => {
  const { status, error, data } = useTournamentHistory(tournament);
  const diff = historyDiff(data);
  return (
    <Grid item>
      <StyledCard sx={{ minWidth: "200px", maxHeight: "100vh" }}>
        <StyledCardHeader
          avatar={
            <Avatar>
              <EmojiEventsIcon />
            </Avatar>
          }
          title="History"
        />
        {status === "loading" && <CircularProgress />}
        {status === "error" && <Error msg={error?.message} />}
        {status === "success" && (
          <CardContent sx={{ overflow: "auto", maxHeight: "65vh" }}>
            <List dense={false}>
              {diff.map((p) => (
                <div key={p[1]}>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Badge
                        max={9999}
                        color="secondary"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        badgeContent={p[1]}
                      >
                        <Avatar>{p[0].substring(0, 1).toUpperCase()}</Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={p[0]} />
                  </ListItem>
                </div>
              ))}
            </List>
          </CardContent>
        )}
      </StyledCard>
    </Grid>
  );
};

export default History;
