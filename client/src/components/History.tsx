import CircularProgress from "@mui/material/CircularProgress";
import { useTournament, useTournamentHistory } from "../api/hooks";
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
  CardActions,
  Tooltip,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import { TournamentHistory } from "../api/Api";
import TodayIcon from "@mui/icons-material/Today";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { useState } from "react";
import { sub } from "date-fns/sub";
import TimelineIcon from "@mui/icons-material/Timeline";
import PlayerAvatar from "./PlayerAvatar";
import { responsiveTxt } from "../util/text";
import { findMax, findMin } from "../api/util";
import { setHours, setMinutes } from "date-fns";

type HistoryProps = {
  tournament: string;
};

const useHistoryDiff = (
  tournament: string,
  period: Duration,
  history?: TournamentHistory[]
) => {
  const { data } = useTournament(tournament);
  const from = getFrom(period);
  const names = new Set(history?.map((p) => p.nickname));
  const result: [nickname: string, diff: number][] = [];
  names.forEach((n) => {
    const ranking = data?.initial ?? 0;
    const max = findMax(history!, from, n)?.ranking;
    const min = findMin(history!, from, n, ranking).ranking;
    if (max) {
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
      return setHours(setMinutes(now, 0), 0);
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
      <Stack
        direction="row"
        spacing={2}
        width="100%"
        justifyContent="space-around"
      >
        <Tooltip title="Day">
          <IconButton onClick={() => setDuration("day")}>
            {duration === "day" ? <TodayIcon /> : <TodayOutlinedIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Week">
          <IconButton onClick={() => setDuration("week")}>
            {duration === "week" ? (
              <DateRangeIcon />
            ) : (
              <DateRangeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Month">
          <IconButton onClick={() => setDuration("month")}>
            {duration === "month" ? (
              <CalendarMonthIcon />
            ) : (
              <CalendarMonthOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
      </Stack>
    </CardActions>
  );
};

const History = ({ tournament }: HistoryProps) => {
  const { status, error, data } = useTournamentHistory(tournament);
  const [duration, setDuration] = useState<Duration>("day");
  const diff = useHistoryDiff(tournament, duration, data);
  return (
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
        {status === "pending" && (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress color="secondary" />
          </Stack>
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
  );
};

export default History;
