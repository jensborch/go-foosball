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
    .filter((h) => (h.nickname = nickname))
    .map((h) => new Date(h.updated))
    .reduce((a, b) => (a < b ? a : b));
  return history.find(
    (h) => h.nickname === nickname && isEqual(new Date(h.updated), date)
  );
};

const findMax = (history: TournamentHistory[], nickname: string) => {
  const date = history
    .filter((h) => (h.nickname = nickname))
    .map((h) => new Date(h.updated))
    .reduce((a, b) => (a > b ? a : b));
  return history.find(
    (h) => h.nickname === nickname && isEqual(new Date(h.updated), date)
  );
};

type Result = {
  nickname: string;
  diff: number;
};

const historyDiff = (history?: TournamentHistory[]) => {
  const names = new Set(history?.map((p) => p.nickname));
  const result: Result[] = [];
  names.forEach((n) => {
    const max = findMax(history!, n)?.ranking;
    const min = findMin(history!, n)?.ranking;
    if (min && max) {
      result.push({
        nickname: n,
        diff: max - min,
      });
    }
  });
  return result;
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
          title="Winners"
        />
        {status === "loading" && <CircularProgress />}
        {status === "error" && <Error msg={error?.message} />}
        {status === "success" && (
          <CardContent sx={{ overflow: "auto", maxHeight: "65vh" }}>
            <List dense={false}>
              {diff.map((p) => (
                <div key={p.nickname}>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Badge
                        max={9999}
                        color="secondary"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        badgeContent={p.diff}
                      >
                        <Avatar>
                          {p.nickname.substring(0, 1).toUpperCase()}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={p.nickname} />
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
