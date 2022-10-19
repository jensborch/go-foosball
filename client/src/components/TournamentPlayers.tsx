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
import { useState } from "react";
import { responsiveTxt } from "../util/text";

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
          avatar={player.nickname}
          selected={player.active}
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

type SortOrder = "alpha" | "winner" | "favorit";

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
      case "favorit":
        return p1.latest && p2.latest
          ? Date.parse(p2.latest).valueOf() - Date.parse(p1.latest).valueOf()
          : 0;
    }
  };

const SortPlayers = ({ setOrder, order }: SortPlayersProps) => {
  return (
    <CardActions>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Tooltip title="Favorites">
            <IconButton onClick={() => setOrder("favorit")}>
              {order === "favorit" ? (
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

const TournamentPlayers = ({ tournament }: PlayersProps) => {
  const [order, setOder] = useState<SortOrder>("winner");
  const { status, error, data } = useTournamentPlayers(tournament);
  return (
    <Grid item>
      <StyledCard sx={{ minWidth: "200px", maxHeight: "100vh" }}>
        <StyledCardHeader
          avatar={
            <Avatar>
              <EmojiPeopleOutlinedIcon />
            </Avatar>
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
              {data?.sort(sortPlayers(order)).map((p, i) => (
                <div key={p.nickname}>
                  <Player player={p} tournament={tournament} />
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
