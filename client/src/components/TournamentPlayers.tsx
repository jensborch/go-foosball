import * as Api from '../api/Api';
import {
  Avatar,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
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
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { useState } from 'react';

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

type SortOrder = 'alpha' | 'winner' | 'favorit';

type SortPlayersProps = {
  setOrder: (order: SortOrder) => void;
};

const sortPlayers =
  (order: SortOrder) =>
  (p1: Api.TournamentPlayer, p2: Api.TournamentPlayer): number => {
    switch (order) {
      case 'alpha':
        return p1.nickname.localeCompare(p2.nickname);
      case 'winner':
        return p1.ranking && p2.ranking ? p2.ranking - p1.ranking : 0;
      case 'favorit':
        return 0; //TODO
    }
  };

const SortPlayers = ({ setOrder }: SortPlayersProps) => {
  return (
    <CardActions>
      <Grid container justifyContent="space-around">
        <Grid item>
          <IconButton
            aria-label="Favorites"
            onClick={() => setOrder('favorit')}
          >
            <FavoriteBorderOutlinedIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton aria-label="Winners" onClick={() => setOrder('winner')}>
            <EmojiEventsOutlinedIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton aria-label="Alpha" onClick={() => setOrder('alpha')}>
            <SortByAlphaIcon />
          </IconButton>
        </Grid>
      </Grid>
    </CardActions>
  );
};

type PlayersProps = {
  tournament: string;
};

const TournamentPlayers = ({ tournament }: PlayersProps) => {
  const [order, setOder] = useState<SortOrder>('winner');
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
            {data?.sort(sortPlayers(order)).map((p, i) => (
              <div key={p.nickname}>
                <Player player={p} tournament={tournament} />
                {i !== data.length - 1 ? <Divider /> : null}
              </div>
            ))}
          </List>
        </CardContent>
        <Divider />
        <SortPlayers setOrder={setOder} />
      </StyledCard>
    </Grid>
  );
};

export default TournamentPlayers;
