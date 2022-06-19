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

type GameProps = {
  tournament: string;
  game: Api.Game;
};

type Winer = 'right' | 'left' | 'draw';

export const Game = ({ tournament, game }: GameProps) => {
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
  }
  return (
    <Card sx={{ minWidth: '300px', margin: (theme) => theme.spacing(2) }}>
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
          <Grid container item columns={2} direction="column">
            {game.rightPlayers?.map((player) => (
              <Grid item key={player}>
                <Player nickname={player} />
              </Grid>
            ))}
          </Grid>
          <Grid item>
            <LinearProgress
              color="secondary"
              variant="determinate"
              value={
                (game.leftScore / (game.rightScore + game.leftScore)) * 100
              }
            />
          </Grid>
          <Grid container item columns={1} direction="column">
            <Button
              variant="outlined"
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
            <Button variant="outlined" onClick={() => wins('draw')}>
              Draw
            </Button>
          </Grid>
          <Grid container item columns={1} direction="column">
            <Button
              variant="outlined"
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
                (game.rightScore / (game.leftScore + game.rightScore)) * 100
              }
            />
          </Grid>
          <Grid container item columns={2} direction="column">
            {game.leftPlayers?.map((player) => (
              <Grid item key={player}>
                <Player nickname={player} />
              </Grid>
            ))}
          </Grid>
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
    <Card>
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
    <Grid container spacing={2} direction="row">
      {data?.map((game) => (
        <Grid item key={game.table.id}>
          <Game tournament={tournament} game={game} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Games;
