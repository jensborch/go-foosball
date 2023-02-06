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
  Box,
} from "@mui/material";
import { TournamentHistory } from "../api/Api";
import isEqual from "date-fns/isEqual";
import TodayIcon from "@mui/icons-material/Today";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { useState } from "react";
import sub from "date-fns/sub";
import TimelineIcon from "@mui/icons-material/Timeline";
import PlayerAvatar from "./PlayerAvatar";
import { responsiveTxt } from "../util/text";

type HistoryProps = {
  tournament: string;
};

const findByNickname = (history: TournamentHistory[], nickname: string) => {
  return history.filter((h) => h.nickname === nickname);
};

const findMin = (history: TournamentHistory[], nickname: string) => {
  const current = findByNickname(history, nickname);
  if (current.length === 1) {
    return {
      nickname,
      ranking: 0,
    };
  } else {
    const date = current
      .map((h) => new Date(h.updated))
      .reduce((a, b) => (a < b ? a : b));
    return history.find(
      (h) => h.nickname === nickname && isEqual(new Date(h.updated), date)
    );
  }
};

const findMax = (history: TournamentHistory[], nickname: string) => {
  const date = findByNickname(history, nickname)
    .map((h) => new Date(h.updated))
    .reduce((a, b) => (a > b ? a : b));
  return history.find(
    (h) => h.nickname === nickname && isEqual(new Date(h.updated), date)
  );
};

const historyDiff = (period: Duration, history?: TournamentHistory[]) => {
  history = history?.filter((h) => new Date(h.updated) > getFrom(period));
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

const getFrom = (period: Duration): Date => {
  const now = new Date();
  switch (period) {
    case "week":
      return sub(now, { weeks: 1 });
    case "month":
      return sub(now, { months: 1 });
    case "day":
      return sub(now, { days: 1 });
  }
};

type Duration = "day" | "week" | "month";

type ByDurationProps = {
  duration: Duration;
  setDuration: (duration: Duration) => void;
};

const ByDuration = ({ setDuration, duration }: ByDurationProps) => {
  return (
    <CardActions>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Tooltip title="Day">
            <IconButton onClick={() => setDuration("day")}>
              {duration === "day" ? <TodayIcon /> : <TodayOutlinedIcon />}
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Week">
            <IconButton
              aria-label="Winners"
              onClick={() => setDuration("week")}
            >
              {duration === "week" ? (
                <DateRangeIcon />
              ) : (
                <DateRangeOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Month">
            <IconButton aria-label="Alpha" onClick={() => setDuration("month")}>
              {duration === "month" ? (
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
  const [duration, setDuration] = useState<Duration>("day");
  const diff = historyDiff(duration, data);
  return (
    <Grid item>
      <StyledCard sx={{ minWidth: "200px", maxHeight: "100vh" }}>
        <StyledCardHeader
          avatar={
            <Avatar>
              <TimelineIcon />
            </Avatar>
          }
          title="History"
        />
        <CardContent sx={{ overflow: "auto", maxHeight: "65vh" }}>
          {status === "loading" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="secondary" />
            </Box>
          )}
          {status === "error" && <Error msg={error?.message} />}
          {status === "success" && (
            <List dense={false}>
              {diff.map((p) => (
                <div key={p[0]}>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Badge
                        max={9999}
                        color="secondary"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        showZero
                        badgeContent={p[1]}
                      >
                        <PlayerAvatar nickname={p[0]} />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={responsiveTxt(p[0], 10)} />
                  </ListItem>
                </div>
              ))}
            </List>
          )}
        </CardContent>

        <Divider />
        <ByDuration setDuration={setDuration} duration={duration} />
      </StyledCard>
    </Grid>
  );
};

export default History;
