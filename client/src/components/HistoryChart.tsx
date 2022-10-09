import { Autocomplete, Grid, TextField } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePlayerHistory, useTournamentPlayers } from "../api/hooks";

type PlayersProps = {
  tournament: string;
  nickname: string | null;
  setNickname: (nickname: string | null) => void;
};

const Players = ({ tournament, nickname, setNickname }: PlayersProps) => {
  const { data } = useTournamentPlayers(tournament);
  const players = data ? data.map((p) => p.nickname) : [];
  return (
    <Autocomplete
      value={nickname}
      onChange={(event: any, newValue: string | null) => setNickname(newValue)}
      options={players}
      sx={{ width: 300, padding: 2 }}
      renderInput={(params) => <TextField {...params} label="Players" />}
    />
  );
};

type HistoryProps = {
  tournament: string;
  nickname: string;
};

const History = ({ tournament, nickname }: HistoryProps) => {
  const { data } = usePlayerHistory(tournament, nickname);
  const chart = data
    ? data.map((h, i) => ({
        time: format(new Date(h.updated), "d/M-yy H:mm"),
        index: i,
        value: h.ranking,
      }))
    : [];
  return (
    <>
      {chart.length > 1 ? (
        <AreaChart width={800} height={400} data={chart}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <XAxis dataKey="time" type="category"></XAxis>
          <YAxis dataKey="value" type="number" offset={400}></YAxis>
          <Area
            dataKey="value"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#color)"
          ></Area>
        </AreaChart>
      ) : undefined}
    </>
  );
};

type ChartProps = {
  tournament: string;
};

const HistoryChart = ({ tournament }: ChartProps) => {
  const [nickname, setNickname] = useState<string | null>(null);
  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Players
          nickname={nickname}
          setNickname={setNickname}
          tournament={tournament}
        />
      </Grid>
      {nickname ? (
        <Grid item>
          <History tournament={tournament} nickname={nickname} />
        </Grid>
      ) : undefined}
    </Grid>
  );
};

export default HistoryChart;
