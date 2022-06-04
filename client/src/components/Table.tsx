import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import React from "react";
import * as Api from "../api/Api";
import { usePlayers } from "../api/hooks";

export const Table = ({ color, created, id, name, updated }: Api.Table) => {
  const { data: players } = usePlayers();

  console.log(players);

  return (
    <Card sx={{ minWidth: "500px", margin: "10px" }}>
      <CardHeader title={`Bord ${name}`} />
      <CardContent>
        <div>Content</div>
        {players?.map((player) => (
          <Player key={player.nickname} {...player} />
        ))}
      </CardContent>
    </Card>
  );
};

const Player = ({ created, nickname, realname, rfid, updated }: Api.Player) => {
  return (
    <Card
      sx={{
        display: "flex",
        margin: "10px",
        padding: "10px",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ margin: "10px" }}>{nickname}</Avatar>
      <Typography variant="h6">{realname}</Typography>
    </Card>
  );
};
