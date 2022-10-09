import { Autocomplete, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { AreaChart } from "recharts";
import { TournamentPlayerHistory } from "../api/Api";
import { usePlayerHistory, useTournamentPlayers } from "../api/hooks";

type PlayersProps = {
  tournament: string;
  nickname: string;
  setNickname: (nickname: string) => void;
};

const Players = ({ tournament, nickname, setNickname }: PlayersProps) => {
  const { data } = useTournamentPlayers(tournament);
  const players = data
    ? data.map((p) => ({
        label: p.realname ? p.realname : p.nickname,
        id: p.nickname,
      }))
    : [];
  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={players}
        sx={{ width: 300, padding: 2 }}
        renderInput={(params) => (
          <TextField
            value={nickname}
            onChange={(e) => setNickname(e.target.id)}
            {...params}
            label="Players"
          />
        )}
      />
    </>
  );
};

type HistoryProps = {
  tournament: string;
  nickname: string;
};

const History = ({ tournament, nickname }: HistoryProps) => {
  const { data } = usePlayerHistory(tournament, nickname);
  const chart = data
    ? data.map((h) => ({ value: h.ranking, date: h.updated }))
    : [];
  return <AreaChart data={chart} />;
};

type ChartProps = {
  tournament: string;
};

const Chart = ({ tournament }: ChartProps) => {
  const [nickname, setNickname] = useState("");
  return (
    <Grid container spacing={2}>
      <Grid item>
        <Players
          nickname={nickname}
          setNickname={setNickname}
          tournament={tournament}
        />
      </Grid>
      <Grid item>
        <History tournament={tournament} nickname={nickname} />
      </Grid>
    </Grid>
  );
};

export default Chart;
