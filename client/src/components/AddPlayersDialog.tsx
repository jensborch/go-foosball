import FullScreenDialog from './FullScreenDialog';
import * as Api from '../api/Api';
import { useState } from 'react';
import {
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
import { DefaultGrid, StyledCard } from './Styled';

type PlayerProps = {
  tournament: string;
  player: Api.Player;
};

const Player = ({ tournament, player }: PlayerProps) => {
  const [ranking, setRanking] = useState(1500);
  const { mutate, error, isError } = useTournamentPlayerMutation(tournament);

  const onAddPlayer = () => {
    mutate({
      nickname: player.nickname,
      ranking: ranking,
    });
  };

  return (
    <>
      {isError && <ErrorSnackbar msg={(error as any)?.error.error} />}
      <StyledCard key={player.nickname}>
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
      </StyledCard>
    </>
  );
};

const NewPlayer = () => {
  const [nickname, setNickname] = useState('');
  const [realname, setRealname] = useState('');
  const { mutate, error, isError } = usePlayerMutation();

  const onCreatePlayer = () => {
    mutate({
      nickname,
      realname,
    });
  };
  return (
    <>
      {isError && <ErrorSnackbar msg={(error as any)?.error.error} />}
      <StyledCard>
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
      </StyledCard>
    </>
  );
};

type PlayersProps = {
  tournament: string;
};

const Players = ({ tournament }: PlayersProps) => {
  const { status, error, data } = usePlayers(Number.parseInt(tournament));
  return (
    <DefaultGrid container direction="row">
      {status === 'loading' && <CircularProgress />}
      {status === 'error' && <Error msg={error?.message}></Error>}
      {status === 'success' && (
        <>
          <Grid item container direction="row">
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
        </>
      )}
    </DefaultGrid>
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
