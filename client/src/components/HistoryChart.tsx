import { Autocomplete, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { AreaChart } from "recharts";
import { useTournamentPlayers } from "../api/hooks";

type PlayersProps = {
  tournament: string;
};

const Players = ({ tournament }: PlayersProps) => {
  const { data } = useTournamentPlayers(tournament);
  const players = data
    ? data.map((p) => ({
        lable: p.realname ? p.realname : p.nickname,
        nickname: p.nickname,
      }))
    : [];
  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={players}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Players" />}
      />
    </>
  );
};

type ChartProps = {
  tournament: string;
};

const Chart = ({ tournament }: ChartProps) => {
  const [nickname, setNickname] = useState("");
  return (
    <Grid container>
      <Grid item>
        <Players tournament={tournament} />
      </Grid>
      <Grid item>
        <AreaChart></AreaChart>
      </Grid>
    </Grid>
  );
};

export default Chart;
