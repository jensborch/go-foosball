import * as Api from "../api/Api";
import {
  Avatar,
  Box,
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
  Tooltip,
} from "@mui/material";
import {
  useTournamentPlayers,
  useTournamentPlayerMutation,
  useTournamentPlayerDeleteMutation,
} from "../api/hooks";
import { Error } from "./Error";
import CheckIcon from "@mui/icons-material/Check";
import { StyledCard, StyledCardHeader } from "./Styled";
import AnimatedAvatar from "./AnimatedAvatar";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import EmojiPeopleOutlinedIcon from "@mui/icons-material/EmojiPeopleOutlined";
import DeselectIcon from "@mui/icons-material/Deselect";
import { useRef, useState } from "react";
import { responsiveTxt } from "../util/text";

type PlayerProps = {
  tournament: string;
  player: Api.TournamentPlayer;
  setSelectedPlayer: (name: string, selected: boolean) => void;
  selected: boolean;
};

const Player = ({
  tournament,
  player,
  setSelectedPlayer,
  selected,
}: PlayerProps) => {
  const { mutate } = useTournamentPlayerMutation(tournament);
  const { mutate: del } = useTournamentPlayerDeleteMutation(
    tournament,
    player.nickname
  );
  function select() {
    mutate({
      nickname: player.nickname,
    });
    setSelectedPlayer(player.nickname, true);
  }
  function deselect() {
    del();
    setSelectedPlayer(player.nickname, false);
  }
  function setSelected(selected: boolean) {
    selected ? select() : deselect();
  }
  //setSelected(selected);
  return (
    <ListItem disableGutters>
      <ListItemAvatar>
        <AnimatedAvatar
          avatar={player.nickname}
          selected={selected}
          setSelected={setSelected}
          selectedComp={<CheckIcon />}
          deselectedComp={player.nickname.substring(0, 1).toUpperCase()}
        ></AnimatedAvatar>
      </ListItemAvatar>
      <ListItemText
        primary={responsiveTxt(player.nickname, 10)}
        secondary={responsiveTxt(player.realname, 10)}
      />
      <ListItemSecondaryAction>
        <Chip label={player.ranking} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

type SortOrder = "alpha" | "winner" | "favorites";

type SortPlayersProps = {
  setOrder: (order: SortOrder) => void;
  order: SortOrder;
};

const sortPlayers =
  (order: SortOrder) =>
  (p1: Api.TournamentPlayer, p2: Api.TournamentPlayer): number => {
    switch (order) {
      case "alpha":
        return p1.nickname.localeCompare(p2.nickname);
      case "winner":
        return p1.ranking && p2.ranking ? p2.ranking - p1.ranking : 0;
      case "favorites":
        return (
          Date.parse(p2.latest!).valueOf() - Date.parse(p1.latest!).valueOf() ||
          p1.nickname.localeCompare(p2.nickname)
        );
    }
  };

const SortPlayers = ({ setOrder, order }: SortPlayersProps) => {
  return (
    <CardActions>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Tooltip title="Favorites">
            <IconButton onClick={() => setOrder("favorites")}>
              {order === "favorites" ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Winner">
            <IconButton aria-label="Winners" onClick={() => setOrder("winner")}>
              {order === "winner" ? (
                <EmojiEventsIcon />
              ) : (
                <EmojiEventsOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Alphabetic">
            <IconButton aria-label="Alpha" onClick={() => setOrder("alpha")}>
              {order === "alpha" ? (
                <EmojiEmotionsIcon />
              ) : (
                <EmojiEmotionsOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </CardActions>
  );
};

type PlayersProps = {
  tournament: string;
};

const MIN_DATE: string = new Date(0).toISOString();

const TournamentPlayers = ({ tournament }: PlayersProps) => {
  const [order, setOder] = useState<SortOrder>("winner");
  const { status, error, data } = useTournamentPlayers(tournament);
  const [selectedPlayers, setSelectedPlayers] = useState(
    new Set<string>(data?.filter((p) => p.active).map((p) => p.nickname))
  );
  const setSelectedPlayer = (name: string, selected: boolean) => {
    selected ? selectedPlayers.add(name) : selectedPlayers.delete(name);
    setSelectedPlayers(selectedPlayers);
  };
  return (
    <Grid item>
      <StyledCard sx={{ minWidth: "200px", maxHeight: "100vh" }}>
        <StyledCardHeader
          avatar={
            <Avatar>
              <EmojiPeopleOutlinedIcon />
            </Avatar>
          }
          action={
            <IconButton
              aria-label="deselect"
              onClick={() => setSelectedPlayers(new Set<string>())}
            >
              <DeselectIcon />
            </IconButton>
          }
          title="Players"
        />
        <CardContent sx={{ overflow: "auto", maxHeight: "65vh" }}>
          {status === "loading" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="secondary" />
            </Box>
          )}
          {status === "error" && <Error msg={error?.message} />}
          {status === "success" && (
            <List dense={true}>
              {data
                ?.map((p) => ({ latest: MIN_DATE, ...p }))
                .sort(sortPlayers(order))
                .map((p, i) => (
                  <div key={p.nickname}>
                    <Player
                      player={p}
                      tournament={tournament}
                      selected={selectedPlayers.has(p.nickname)}
                      setSelectedPlayer={setSelectedPlayer}
                    />
                    {i !== data.length - 1 ? <Divider /> : null}
                  </div>
                ))}
            </List>
          )}
        </CardContent>
        <Divider />
        <SortPlayers setOrder={setOder} order={order} />
      </StyledCard>
    </Grid>
  );
};

export default TournamentPlayers;
