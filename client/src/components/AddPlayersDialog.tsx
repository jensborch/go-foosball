import FullScreenDialog from './FullScreenDialog';
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
import ErrorSnackbar from './ErrorSnackbar';

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

type PlayersProps = {
  tournament: string;
};

const Players = ({ tournament }: PlayersProps) => {
  const { status, error, data } = usePlayers(Number.parseInt(tournament));
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
          <Grid item key={player.nickname}>
            <Player player={player} tournament={tournament} />
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

type AddPlayersProps = {
  tournament: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AddPlayersDialog = ({ tournament, open, setOpen }: AddPlayersProps) => {
  return (
    <FullScreenDialog open={open} setOpen={setOpen}>
      <Players tournament={tournament} />
    </FullScreenDialog>
  );
};

export default AddPlayersDialog;
