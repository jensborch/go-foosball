import * as Api from '../api/Api';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  LinearProgress,
} from '@mui/material';
import { useRandomGames, useGameMutation } from '../api/hooks';
import { Error } from './Error';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { StyledCardHeader } from './Styled';
import { useEffect, useState } from 'react';

const Players = ({players}: {players : string[]}) => {
  return (
    <Grid container item columns={2} spacing={2} direction="row" justifyContent="center">
    {players?.map((player) => (
      <Grid item key={player}>
        <Player nickname={player} />
      </Grid>
    ))}
  </Grid>
  )
}

type GameProps = {
  tournament: string;
  game: Api.Game;
};

type Winer = 'right' | 'left' | 'draw';

export const Game = ({ tournament, game }: GameProps) => {
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    setDisabled(false);
  }, [tournament, game])
  const { mutate } = useGameMutation();
  function wins(winer: Winer) {
    mutate({
      tournament: tournament,
      table: game.table.id.toString(),
      game: {
        rightPlayers: game.rightPlayers,
        leftPlayers: game.leftPlayers,
        winner: winer,
      },
    });
    setDisabled(true);
  }
  return (
    <Card sx={{ minWidth: '300px'}}>
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
          <Players players={game.rightPlayers}/>
          <Grid item>
            <LinearProgress
              color="secondary"
              variant="determinate"
              value={
                (game.rightScore / (game.rightScore + game.leftScore)) * 100
              }
            />
          </Grid>
          <Grid container item columns={1} direction="column">
            <Button
              variant="outlined"
              disabled={disabled}
              onClick={() => wins('right')}
              startIcon={
                <EmojiEventsOutlinedIcon
                  sx={{ color: `${game.table.color.right}` }}
                />
              }
            >
              {game.table.color.right} wins {game.rightScore} points
            </Button>
          </Grid>
          <Grid container item columns={1} direction="column">
            <Button
              variant="outlined"
              disabled={disabled}
              onClick={() => wins('draw')}
            >
              Draw
            </Button>
          </Grid>
          <Grid container item columns={1} direction="column">
            <Button
              variant="outlined"
              disabled={disabled}
              onClick={() => wins('left')}
              startIcon={
                <EmojiEventsOutlinedIcon
                  sx={{ color: `${game.table.color.left}` }}
                />
              }
            >
              {game.table.color.left} wins {game.leftScore} points
            </Button>
          </Grid>
          <Grid item>
            <LinearProgress
              color="secondary"
              variant="determinate"
              value={
                (game.leftScore / (game.leftScore + game.rightScore)) * 100
              }
            />
          </Grid>
          <Players players={game.leftPlayers}/>
        </Grid>
      </CardContent>
    </Card>
  );
};

type PlayerProps = {
  nickname: string;
};

const Player = ({ nickname }: PlayerProps) => {
  return (
    <Card sx={{ minWidth: '140px'}}>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,
            }}
          >
            {nickname.substring(0, 2)}
          </Avatar>
        }
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

  if (status === 'loading') {
    return <CircularProgress />;
  }
  if (status === 'error') {
    return <Error msg={error?.message}></Error>;
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
