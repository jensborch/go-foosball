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
import { useRandomGames } from '../api/hooks';
import { Error } from './Error';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';

export const Game = ({
  leftPlayers,
  rightPlayers,
  leftScore,
  rightScore,
  table,
}: Api.Game) => {
  function rigthWins() {}
  function leftWins() {}
  return (
    <Card sx={{ minWidth: '300px', margin: (theme) => theme.spacing(4) }}>
      <CardHeader
        avatar={
          <Avatar>
            <TableRestaurantIcon />
          </Avatar>
        }
        title="Table"
        subheader={`${table.name}`}
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
          <Grid container item columns={1} direction="column">
            <Button
              variant="outlined"
              onClick={rigthWins}
              startIcon={
                <EmojiEventsOutlinedIcon
                  sx={{ color: `${table.color.right}` }}
                />
              }
            >
              {table.color.right} wins {rightScore} points
            </Button>
          </Grid>
          <Grid container item columns={2} direction="column">
            {leftPlayers?.map((player) => (
              <Grid item key={player}>
                <Player nickname={player} />
              </Grid>
            ))}
          </Grid>
          <Grid container item columns={1} direction="column">
            <Button
              variant="outlined"
              onClick={leftWins}
              startIcon={
                <EmojiEventsOutlinedIcon
                  sx={{ color: `${table.color.left}` }}
                />
              }
            >
              {table.color.left} wins {leftScore} points
            </Button>
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
