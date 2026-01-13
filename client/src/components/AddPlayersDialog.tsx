import FullScreenDialog from "./FullScreenDialog";
import * as Api from "../api/Api";
import { ChangeEvent, useState } from "react";
import {
  CircularProgress,
  IconButton,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Error } from "./Error";
import {
  usePlayerMutation,
  usePlayers,
  useTournament,
  useTournamentPlayerMutation,
} from "../api/hooks";
import ErrorSnackbar from "./ErrorSnackbar";
import AddIcon from "@mui/icons-material/Add";
import PlayerAvatar from "./PlayerAvatar";

type AvailablePlayersCardProps = {
  players: Api.Player[];
  onPlayerSelect: (player: Api.Player, ranking: number) => void;
  initialScore: number;
};

const AvailablePlayersCard = ({
  players,
  onPlayerSelect,
  initialScore,
}: AvailablePlayersCardProps) => {
  const [rankings, setRankings] = useState<Record<string, number>>(() =>
    players.reduce(
      (acc, player) => ({ ...acc, [player.nickname]: initialScore }),
      {}
    )
  );

  const handleRankingChange = (nickname: string, ranking: number) => {
    setRankings((prev) => ({ ...prev, [nickname]: ranking }));
  };

  const handlePlayerClick = (player: Api.Player) => {
    onPlayerSelect(player, rankings[player.nickname] || initialScore);
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontWeight: "bold",
            p: 2,
            m: -2,
            mb: 2,
          }}
        >
          Available Players ({players.length})
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table size="small" aria-label="available players table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Avatar</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nickname</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Real Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>RFID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ranking</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => (
                <TableRow
                  key={player.nickname}
                  sx={{
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <TableCell>
                    <PlayerAvatar nickname={player.nickname} />
                  </TableCell>
                  <TableCell>{player.nickname}</TableCell>
                  <TableCell>{player.realname}</TableCell>
                  <TableCell>{player.rfid || "-"}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={rankings[player.nickname] || initialScore}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleRankingChange(
                          player.nickname,
                          Number(e.target.value)
                        )
                      }
                      slotProps={{
                        htmlInput: { min: 0, max: 3000 },
                      }}
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => handlePlayerClick(player)}
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

type CreateNewPlayerCardProps = {
  onPlayerCreate: (player: {
    nickname: string;
    realname: string;
    rfid: string;
  }) => void;
  isError: boolean;
  errorMessage?: string;
};

const CreateNewPlayerCard = ({
  onPlayerCreate,
  isError,
  errorMessage,
}: CreateNewPlayerCardProps) => {
  const [nickname, setNickname] = useState("");
  const [realname, setRealname] = useState("");
  const [rfid, setRfid] = useState("");

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    onPlayerCreate({ nickname, realname, rfid });
    setNickname("");
    setRealname("");
    setRfid("");
  };

  return (
    <>
      {isError && errorMessage && <ErrorSnackbar msg={errorMessage} />}
      <Card elevation={2}>
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{
              bgcolor: "secondary.main",
              color: "secondary.contrastText",
              fontWeight: "bold",
              p: 2,
              m: -2,
              mb: 2,
            }}
          >
            Create New Player
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: { xs: "stretch", sm: "center" },
            }}
          >
            <TextField
              size="small"
              type="string"
              value={realname}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRealname(e.target.value)
              }
              label="Real name"
              variant="outlined"
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              type="string"
              value={nickname}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNickname(e.target.value)
              }
              label="Nickname"
              variant="outlined"
              required
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              type="string"
              value={rfid}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRfid(e.target.value)
              }
              label="RFID"
              variant="outlined"
              sx={{ flex: 1 }}
            />
            <IconButton
              type="submit"
              disabled={!nickname.trim()}
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                "&:disabled": {
                  bgcolor: "grey.300",
                  color: "grey.500",
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

type AddPlayersProps = {
  tournament: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AddPlayersDialog = ({ tournament, open, setOpen }: AddPlayersProps) => {
  const { status, error, data } = usePlayers(Number.parseInt(tournament));
  const { data: tournamentData } = useTournament(tournament);
  const {
    mutate: mutatePlayer,
    error: mutatePlayerError,
    isError: isPlayerError,
  } = usePlayerMutation();
  const {
    mutate: mutateTourPlayer,
    error: mutateTourPlayerError,
    isError: isTourPlayerError,
  } = useTournamentPlayerMutation(tournament);

  function handlePlayerSelect(player: Api.Player, ranking: number): void {
    mutateTourPlayer({
      nickname: player.nickname,
      ranking: ranking,
    });
  }

  function handlePlayerCreate(playerData: {
    nickname: string;
    realname: string;
    rfid: string;
  }): void {
    mutatePlayer(playerData);
  }

  return (
    <FullScreenDialog setOpen={setOpen} open={open} title="Add player">
      {isTourPlayerError && (
        <ErrorSnackbar msg={mutateTourPlayerError.message} />
      )}
      {status === "pending" && <CircularProgress />}
      {status === "error" && <Error msg={error?.message} />}
      {status === "success" && (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          <AvailablePlayersCard
            players={data || []}
            onPlayerSelect={handlePlayerSelect}
            initialScore={tournamentData?.initial || 1000}
          />
          <CreateNewPlayerCard
            onPlayerCreate={handlePlayerCreate}
            isError={isPlayerError}
            errorMessage={mutatePlayerError?.message}
          />
        </Box>
      )}
    </FullScreenDialog>
  );
};

export default AddPlayersDialog;
