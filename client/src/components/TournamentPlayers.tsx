import * as Api from '../api/Api';
import {
  Avatar,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
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
import { StyledCard, StyledCardHeader } from './Styled';
import AnimatedAvatar from './AnimatedAvatar';

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
  function setSelected(selected: boolean) {
    selected ? select() : deselect();
  }
  return (
    <ListItem disableGutters>
      <ListItemAvatar>
        <AnimatedAvatar
          selected={player.active}
          setSelected={setSelected}
          selectedComp={<CheckIcon />}
          deselectedComp={player.nickname.substring(0, 1).toUpperCase()}
        ></AnimatedAvatar>
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
    <Grid item>
      <StyledCard sx={{ minWidth: '200px' }}>
        <StyledCardHeader
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
                {i !== data.length - 1 ? <Divider /> : null}
              </div>
            ))}
          </List>
        </CardContent>
      </StyledCard>
    </Grid>
  );
};

export default TournamentPlayers;
