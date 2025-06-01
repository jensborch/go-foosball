import * as Api from "../api/Api";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  LinearProgress,
} from "@mui/material";
import { useRandomGames, useGameMutation } from "../api/hooks";
import { Error } from "./Error";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { StyledCard, StyledCardHeader } from "./Styled";
import { useEffect, useState } from "react";
import {
  blue,
  blueGrey,
  brown,
  green,
  grey,
  orange,
  pink,
  purple,
  red,
  yellow,
} from "@mui/material/colors";
import PlayerAvatar from "./PlayerAvatar";

const Players = ({ players }: { players: string[] }) => {
  return (
    <Grid
      container
      item
      columns={2}
      spacing={2}
      direction="row"
      justifyContent="center"
    >
      {players?.map((player) => (
        <Grid item key={player}>
          <Player nickname={player} />
        </Grid>
      ))}
    </Grid>
  );
};

type ScoreProps = {
  first: number;
  second: number;
};
const Score = ({ first, second }: ScoreProps) => (
  <LinearProgress
    color="secondary"
    variant="determinate"
    value={(first / (first + second)) * 100}
  />
);

type WinnerProps = {
  color: string;
  score: number;
  winner: Winner;
  disabled: boolean;
  onClick: (winner: Winner) => void;
};

const WinnerButton = ({
  color,
  winner,
  score,
  disabled,
  onClick,
}: WinnerProps) => (
  <Button
    sx={{ background: findColor(color) }}
    variant="outlined"
    disabled={disabled}
    onClick={() => onClick(winner)}
    startIcon={<EmojiEventsOutlinedIcon />}
  >
    {color} wins {score} points
  </Button>
);

const findColor = (color: string): string => {
  switch (color.toLowerCase()) {
    case "red":
      return red[400];
    case "pink":
      return pink[400];
    case "purple":
      return purple[400];
    case "blue":
      return blue[400];
    case "green":
      return green[400];
    case "yellow":
      return yellow[400];
    case "orange":
      return orange[400];
    case "brown":
      return brown[400];
    case "black":
      return grey[400];
    case "white":
      return "white";
    default:
      return blueGrey[300];
  }
};

type GameProps = {
  tournament: string;
  game: Api.Game;
};

type Winner = "right" | "left" | "draw";

const Game = ({ tournament, game }: GameProps) => {
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    setDisabled(false);
  }, [tournament, game]);
  const { mutate } = useGameMutation(tournament);
  function wins(winner: Winner) {
    mutate({
      tournament: tournament,
      table: game.table.id.toString(),
      game: {
        rightPlayers: game.rightPlayers,
        leftPlayers: game.leftPlayers,
        winner: winner,
      },
    });
    setDisabled(true);
  }
  return (
    <StyledCard sx={{ minWidth: "300px" }}>
      <StyledCardHeader
        avatar={
          <Avatar>
            <TableRestaurantIcon />
          </Avatar>
        }
        title="Table"
        subheader={`${game.table.name}`}
      />
      <CardContent>
        <Grid container spacing={2} columns={3} direction="column">
          <Players players={game.rightPlayers} />
          <Grid item>
            <Score first={game.rightScore} second={game.leftScore} />
          </Grid>
          <Grid container item columns={1} direction="column">
            <WinnerButton
              color={game.table.color.right}
              score={game.rightScore}
              winner="right"
              disabled={disabled}
              onClick={wins}
            />
          </Grid>
          <Grid container item columns={1} direction="column">
            <Button
              variant="outlined"
              disabled={disabled}
              onClick={() => wins("draw")}
            >
              Draw
            </Button>
          </Grid>
          <Grid container item columns={1} direction="column">
            <WinnerButton
              color={game.table.color.left}
              score={game.leftScore}
              winner="left"
              disabled={disabled}
              onClick={wins}
            />
          </Grid>
          <Grid item>
            <Score first={game.leftScore} second={game.rightScore} />
          </Grid>
          <Players players={game.leftPlayers} />
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

type PlayerProps = {
  nickname: string;
};

const Player = ({ nickname }: PlayerProps) => {
  return (
    <Card sx={{ minWidth: "140px" }}>
      <CardHeader
        avatar={<PlayerAvatar nickname={nickname} />}
        title={nickname}
      />
    </Card>
  );
};

type GamesProps = {
  tournament: string;
};

const Games = ({ tournament }: GamesProps) => {
  const { status, error, data } = useRandomGames(tournament);

  if (status === "pending") {
    return (
      <Box
        sx={{
          display: "flex",
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="secondary" size={100} />
      </Box>
    );
  }
  if (status === "error") {
    return (
      <Grid item>
        <StyledCard sx={{ minWidth: "300px" }}>
          <CardContent>
            <Error msg={error?.message} />
          </CardContent>
        </StyledCard>
      </Grid>
    );
  }
  return (
    <>
      {data?.map((game) => (
        <Grid item key={game.table.id}>
          <Game tournament={tournament} game={game} />
        </Grid>
      ))}
    </>
  );
};

export default Games;
