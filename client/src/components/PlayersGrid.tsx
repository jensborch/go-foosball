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
  CircularProgress,
} from '@mui/material';
import { Error } from './Error';
import {
  usePlayerMutation,
  usePlayers,
  useTournamentPlayerMutation,
} from '../api/hooks';

type PlayerProps = {
  tournament: string;
  player: Api.Player;
};

const Player = ({ tournament, player }: PlayerProps) => {
  const [ranking, setRanking] = useState(NaN);
  const { mutate } = useTournamentPlayerMutation(tournament);

  const onAddPlayer = () => {
    mutate({
      nickname: player.nickname,
      ranking: ranking,
    });
  };

  return (
    <Card key={player.nickname}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h3">
          {player.nickname} - {player.realname}
        </Typography>
        <TextField
          type="number"
          value={ranking}
          onChange={(e) => setRanking(parseInt(e.target.value))}
          helperText="Ranking"
          label="Ranking"
          margin="dense"
        />
      </CardContent>
      <CardActions>
        <Button variant="outlined" onClick={onAddPlayer}>
          Add
        </Button>
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
        <Button variant="outlined" onClick={onCreatePlayer}>
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
  const { status, error, data } = usePlayers();
  if (status === 'loading') {
    return <CircularProgress />;
  }
  if (status === 'error') {
    return <Error msg={error?.message}></Error>;
  }
  return (
    <Grid
      sx={{
        margin: (theme) => theme.spacing(),
      }}
      item
      container
      spacing={2}
      direction="row"
    >
      <Grid spacing={2} item container direction="row">
        {data?.map((player, _) => (
          <Grid item>
            <Player
              key={player.nickname}
              player={player}
              tournament={tournament}
            />
          </Grid>
        ))}
      </Grid>
      <Grid item container direction="row">
        <Grid item>
          <NewPlayer />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PlayersGrid;
