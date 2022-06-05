import * as Api from '../api/Api';
import { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  CardActions,
  Box,
  CircularProgress,
} from '@mui/material';
import { Error } from './Error';
import {
  usePlayerMutation,
  useTournamentPlayerMutation,
  useTournamentPlayers,
} from '../api/hooks';

type PlayerProps = {
  tournament: string;
  player: Api.TournamentPlayer;
};

const Player = (props: PlayerProps) => {
  const [player, setPlayer] = useState(props.player);
  const { mutate } = useTournamentPlayerMutation(props.tournament);

  const onAddPlayer = () => {
    mutate({
      nickname: player.nickname,
      ranking: player.ranking,
    });
  };

  return (
    <Card
      sx={{
        height: '250px',
        margin: (theme) => theme.spacing(3),
      }}
      key={player.nickname}
    >
      <Box
        sx={{
          height: '100px',
          backgroundColor: (theme) => theme.palette.grey[300],
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h3">
          {player.nickname} - {player.realname}
        </Typography>
      </CardContent>
      <CardActions>
        <div>
          <TextField
            type="number"
            value={player.ranking}
            onChange={(e) =>
              setPlayer({
                ...player,
                ranking: parseInt(e.target.value),
              })
            }
            helperText="Ranking"
            label="Ranking"
            margin="dense"
          />
          <Button
            sx={{
              margin: (theme) => theme.spacing(),
            }}
            variant="outlined"
            onClick={onAddPlayer}
          >
            Add
          </Button>
        </div>
      </CardActions>
    </Card>
  );
};

const NewPlayer = () => {
  const [nickname, setNickname] = useState('');
  const [realname, setRealname] = useState('');
  const { mutate } = usePlayerMutation();

  const onCreatePlayer = () => {
    mutate({
      nickname,
      realname,
    });
  };
  return (
    <Card>
      <CardContent>
        <Grid container direction="column">
          <Grid item>
            <TextField
              helperText="Name"
              value={realname}
              onChange={(event) => setRealname(event.target.value)}
              label="Name"
            />
          </Grid>
          <Grid item>
            <TextField
              helperText="Nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              label="Nickname"
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          sx={{
            margin: (theme) => theme.spacing(),
          }}
          variant="outlined"
          onClick={onCreatePlayer}
        >
          Create
        </Button>
      </CardActions>
    </Card>
  );
};

type PlayersGridProps = {
  tournament: string;
};

const PlayersGrid = ({ tournament }: PlayersGridProps) => {
  const { status, error, data } = useTournamentPlayers(tournament);
  if (status === 'loading') {
    return <CircularProgress />;
  }
  if (status === 'error') {
    return <Error msg={error?.message}></Error>;
  }
  return (
    <Grid container spacing={16} direction="row">
      {data?.map((player, _) => (
        <Grid item key={player.nickname}>
          <Player player={player} tournament={tournament} />
        </Grid>
      ))}
      <Grid item>
        <NewPlayer />
      </Grid>
    </Grid>
  );
};

export default PlayersGrid;
