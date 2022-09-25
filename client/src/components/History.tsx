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
  CardActions,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { TournamentHistory } from "../api/Api";
import isEqual from "date-fns/isEqual";
import TodayIcon from "@mui/icons-material/Today";
import TodayOutlinedIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRange";
import { useState } from "react";

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

type Period = "day" | "week" | "month" | "year";

type ByPeriodProps = {
  period: Period;
  setPeriod: (preiod: Period) => void;
};

const ByPeriod = ({ setPeriod, period }: ByPeriodProps) => {
  return (
    <CardActions>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Tooltip title="Day">
            <IconButton onClick={() => setPeriod("day")}>
              {period === "day" ? <TodayIcon /> : <TodayOutlinedIcon />}
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Week">
            <IconButton aria-label="Winners" onClick={() => setPeriod("week")}>
              {period === "week" ? (
                <DateRangeIcon />
              ) : (
                <DateRangeOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Month">
            <IconButton aria-label="Alpha" onClick={() => setPeriod("month")}>
              {period === "month" ? (
                <CalendarMonthIcon />
              ) : (
                <CalendarMonthOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </CardActions>
  );
};

const History = ({ tournament }: HistoryProps) => {
  const { status, error, data } = useTournamentHistory(tournament);
  const [period, setPeriod] = useState<Period>("day");
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
        <Divider />
        <ByPeriod setPeriod={setPeriod} period={period} />
      </StyledCard>
    </Grid>
  );
};

export default History;
