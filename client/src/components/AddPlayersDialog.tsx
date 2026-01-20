import FullScreenDialog from "./FullScreenDialog";
import * as Api from "../api/Api";
import {
  CircularProgress,
  TextField,
  Box,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { Error } from "./Error";
import {
  usePlayerMutation,
  usePlayers,
  useTournament,
  useTournamentPlayerMutation,
  useTournamentPlayerDeleteMutation,
  useTournamentPlayers,
} from "../api/hooks";
import ErrorSnackbar from "./ErrorSnackbar";
import PlayerAvatar from "./PlayerAvatar";
import { StyledCard, StyledCardHeader } from "./Styled";
import { useState, ChangeEvent, useEffect } from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Avatar from "@mui/material/Avatar";

// ExistingPlayer component for rendering a single player row
type ExistingPlayerProps = {
  tournament: string;
  player: Api.Player;
  initialScore: number;
};

const ExistingPlayer = ({
  tournament,
  player,
  initialScore,
}: Readonly<ExistingPlayerProps>) => {
  const [ranking, setRanking] = useState<number>(initialScore);
  const {
    mutate: mutateTourPlayer,
    error,
    isError,
    isPending,
  } = useTournamentPlayerMutation(tournament);

  useEffect(() => {
    setRanking(initialScore);
  }, [initialScore]);

  const handlePlayerSelect = () => {
    mutateTourPlayer({
      nickname: player.nickname,
      ranking: ranking,
    });
  };

  return (
    <>
      {isError && <ErrorSnackbar msg={error?.message} />}
      <TableRow
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
            value={ranking}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRanking(Number.parseInt(e.target.value))
            }
            slotProps={{
              htmlInput: { min: 0, max: 3000 },
            }}
            sx={{ width: 80 }}
          />
        </TableCell>
        <TableCell align="right" sx={{ pr: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlayerSelect}
              disabled={isPending}
              sx={{ minWidth: 90, width: 90 }}
            >
              <Typography variant="button">Add</Typography>
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

// RemovePlayer component for removing a single player from a tournament
type RemovePlayerProps = {
  tournament: string;
  player: Api.TournamentPlayer;
};

const RemovePlayer = ({ tournament, player }: Readonly<RemovePlayerProps>) => {
  const {
    mutate: removePlayer,
    error,
    isError,
    isPending,
  } = useTournamentPlayerDeleteMutation(tournament, player.nickname);

  const handlePlayerRemove = () => {
    removePlayer();
  };

  return (
    <>
      {isError && <ErrorSnackbar msg={error?.message} />}
      <TableRow
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
        <TableCell>{player.ranking}</TableCell>
        <TableCell align="right" sx={{ pr: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              onClick={handlePlayerRemove}
              disabled={isPending}
              sx={{ minWidth: 90, width: 90 }}
            >
              <Typography variant="button">Remove</Typography>
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

const NewPlayer = () => {
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
    },
  };

  const [nickname, setNickname] = useState("");
  const [realname, setRealname] = useState("");
  const [rfid, setRfid] = useState("");

  const { mutate, error, isError, isPending, isSuccess, reset } =
    usePlayerMutation();

  useEffect(() => {
    if (isSuccess) {
      setNickname("");
      setRealname("");
      setRfid("");
      reset();
    }
  }, [isSuccess, reset]);

  const handlePlayerCreate = () => {
    mutate({
      nickname,
      realname,
      rfid,
    });
  };

  return (
    <>
      {isError && <ErrorSnackbar msg={error?.message} />}
      <TableRow
        sx={{
          "&:hover": { backgroundColor: "action.hover" },
        }}
      >
        <TableCell>
          <Avatar sx={{ bgcolor: "grey.300", width: 40, height: 40 }}>
            <PersonAddAlt1Icon color="action" />
          </Avatar>
        </TableCell>
        <TableCell>
          <TextField
            size="small"
            value={nickname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNickname(e.target.value)
            }
            placeholder="Nickname*"
            required
            sx={textFieldSx}
          />
        </TableCell>
        <TableCell>
          <TextField
            size="small"
            value={realname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRealname(e.target.value)
            }
            placeholder="Real name"
            sx={textFieldSx}
          />
        </TableCell>
        <TableCell>
          <TextField
            size="small"
            value={rfid}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRfid(e.target.value)
            }
            placeholder="RFID"
            sx={textFieldSx}
          />
        </TableCell>
        <TableCell>-</TableCell>
        <TableCell align="right" sx={{ pr: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              onClick={handlePlayerCreate}
              disabled={!nickname.trim() || isPending}
              sx={{ minWidth: 90, width: 90 }}
            >
              <Typography variant="button">Create</Typography>
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

type AvailablePlayersCardProps = {
  tournament: string;
  initialScore: number;
};

const AvailablePlayersCard = ({
  tournament,
  initialScore,
}: AvailablePlayersCardProps) => {
  const {
    data: players,
    status: playersStatus,
    error: playersError,
  } = usePlayers(Number.parseInt(tournament));
  const {
    data: tournamentPlayers,
    status: tournamentPlayersStatus,
    error: tournamentPlayersError,
  } = useTournamentPlayers(tournament);

  const isLoading =
    playersStatus === "pending" || tournamentPlayersStatus === "pending";
  const isError =
    playersStatus === "error" || tournamentPlayersStatus === "error";
  const errorMessage = playersError?.message || tournamentPlayersError?.message;

  return (
    <StyledCard elevation={2}>
      <StyledCardHeader
        title={`Available Players ${"(" + players?.length + ")"}`}
      />
      <CardContent>
        {isLoading && (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        )}
        {isError && <Error msg={errorMessage} />}
        {!isLoading && !isError && (
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
                {tournamentPlayers?.map((player) => (
                  <RemovePlayer
                    key={player.nickname}
                    tournament={tournament}
                    player={player}
                  />
                ))}
                {players?.map((player) => (
                  <ExistingPlayer
                    key={player.nickname}
                    tournament={tournament}
                    player={player}
                    initialScore={initialScore}
                  />
                ))}
                <NewPlayer />
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </StyledCard>
  );
};

type AddPlayersProps = {
  tournament: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AddPlayersDialog = ({ tournament, open, setOpen }: AddPlayersProps) => {
  const { data, status, error } = useTournament(tournament);

  return (
    <FullScreenDialog setOpen={setOpen} open={open} title="Add player">
      {status === "pending" && <CircularProgress />}
      {status === "error" && <Error msg={error?.message} />}
      {status === "success" && (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          <AvailablePlayersCard
            tournament={tournament}
            initialScore={data?.initial || 1000}
          />
        </Box>
      )}
    </FullScreenDialog>
  );
};

export default AddPlayersDialog;
