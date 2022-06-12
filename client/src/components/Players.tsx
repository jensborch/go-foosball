import * as Api from '../api/Api';
import {
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import {
  useTournamentPlayers,
  useTournamentPlayerMutation,
  useTournamentPlayerDeleteMutation,
} from '../api/hooks';
import { Error } from './Error';
import CheckIcon from '@mui/icons-material/Check';

type PlayerProps = {
  tournament: string;
  player: Api.TournamentPlayer;
};

const Player = ({ tournament, player }: PlayerProps) => {
  const { mutate } = useTournamentPlayerMutation(tournament);
  const { mutate: del } = useTournamentPlayerDeleteMutation(
    tournament,
    player.nickname
  );
  function select() {
    mutate({
      nickname: player.nickname,
    });
  }
  function deselect() {
    del();
  }
  return (
    <ListItem>
      {player.active ? (
        <Avatar onClick={deselect}>
          <CheckIcon />
        </Avatar>
      ) : (
        <Avatar onClick={select}>{player.nickname.substring(0, 2)}</Avatar>
      )}
      <ListItemText primary={player.nickname} secondary={player.realname} />
      <ListItemSecondaryAction>
        <Chip label={player.ranking} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

type PlayersProps = {
  tournament: string;
};

const Players = ({ tournament }: PlayersProps) => {
  const { status, error, data } = useTournamentPlayers(tournament);
  if (status === 'loading') {
    return <CircularProgress />;
  }
  if (status === 'error') {
    return <Error msg={error?.message}></Error>;
  }
  return (
    <List>
      {data?.map((p, i) => (
        <div key={p.nickname}>
          <Player player={p} tournament={tournament} />
          {i !== data.length - 1 ? (
            <li>
              <Divider variant="inset" />
            </li>
          ) : null}
        </div>
      ))}
    </List>
  );
};

export default Players;
