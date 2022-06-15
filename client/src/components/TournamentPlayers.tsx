import * as Api from '../api/Api';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
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
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';

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
      <ListItemAvatar>
        {player.active ? (
          <Avatar onClick={deselect}>
            <CheckIcon />
          </Avatar>
        ) : (
          <Avatar onClick={select}>{player.nickname.substring(0, 2)}</Avatar>
        )}
      </ListItemAvatar>
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

const TournamentPlayers = ({ tournament }: PlayersProps) => {
  const { status, error, data } = useTournamentPlayers(tournament);
  if (status === 'loading') {
    return <CircularProgress />;
  }
  if (status === 'error') {
    return <Error msg={error?.message}></Error>;
  }
  return (
    <Card sx={{ minWidth: '200px' }}>
      <CardHeader
        avatar={
          <Avatar>
            <EmojiPeopleOutlinedIcon />
          </Avatar>
        }
        title="Players"
      />
      <CardContent>
        <List>
          {data?.map((p, i) => (
            <div key={p.nickname}>
              <Player player={p} tournament={tournament} />
              {i !== data.length - 1 ? <Divider variant="inset" /> : null}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TournamentPlayers;
