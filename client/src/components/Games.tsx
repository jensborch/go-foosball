import * as Api from '../api/Api';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  LinearProgress,
} from '@mui/material';
import { useRandomGames } from '../api/hooks';
import { Error } from './Error';
import { green } from '@mui/material/colors';

export const Game = ({
  leftPlayers,
  rightPlayers,
  leftScore,
  rightScore,
  table,
}: Api.Game) => {
  return (
    <Card sx={{ minWidth: '300px', margin: (theme) => theme.spacing(4) }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              backgroundColor: green[500],
            }}
          >
            T
          </Avatar>
        }
        title={`${table.name}`}
      />
      <CardContent>
        <Grid container spacing={2} columns={3} direction="column">
          <Grid item>
            <LinearProgress
              color="secondary"
              variant="determinate"
              value={(leftScore / (rightScore + leftScore)) * 100}
            />
          </Grid>
          <Grid container item columns={2} direction="column">
            {rightPlayers?.map((player) => (
              <Grid item key={player}>
                <Player nickname={player} />
              </Grid>
            ))}
          </Grid>
          <Grid container item columns={2} direction="column">
            {leftPlayers?.map((player) => (
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
          <Game {...game} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Games;
