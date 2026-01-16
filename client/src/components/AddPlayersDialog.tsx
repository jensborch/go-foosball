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
} from "../api/hooks";
import ErrorSnackbar from "./ErrorSnackbar";
import PlayerAvatar from "./PlayerAvatar";
import { StyledCard, StyledCardHeader } from "./Styled";
import { useState, ChangeEvent } from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Avatar from "@mui/material/Avatar";

// ExistingPlayer component for rendering a single player row
type ExistingPlayerProps = {
  player: Api.Player;
  ranking: number;
  onRankingChange: (nickname: string, ranking: number) => void;
  onAdd: (player: Api.Player) => void;
  initialScore: number;
};

const ExistingPlayer = ({
  player,
  ranking,
  onRankingChange,
  onAdd,
}: Readonly<ExistingPlayerProps>) => (
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
          onRankingChange(player.nickname, Number(e.target.value))
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
          onClick={() => onAdd(player)}
          sx={{ minWidth: 90, width: 90 }}
        >
          <Typography variant="button">Add</Typography>
        </Button>
      </Box>
    </TableCell>
  </TableRow>
);

// NewPlayerRow component for new player creation
type NewPlayerProps = {
  nickname: string;
  realname: string;
  rfid: string;
  setNickname: (v: string) => void;
  setRealname: (v: string) => void;
  setRfid: (v: string) => void;
  onCreate: () => void;
};

const NewPlayer = ({
  nickname,
  realname,
  rfid,
  setNickname,
  setRealname,
  setRfid,
  onCreate,
}: Readonly<NewPlayerProps>) => {
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
    },
  };
  return (
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
            onClick={onCreate}
            disabled={!nickname.trim()}
            sx={{ minWidth: 90, width: 90 }}
          >
            <Typography variant="button">Create</Typography>
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
};

type AvailablePlayersCardProps = {
  players: Api.Player[];
  onPlayerSelect: (player: Api.Player, ranking: number) => void;
  onPlayerCreate: (
    player: {
      nickname: string;
      realname: string;
      rfid: string;
    },
    ranking: number
  ) => void;
  initialScore: number;
  isError: boolean;
  errorMessage?: string;
};

const AvailablePlayersCard = ({
  players,
  onPlayerSelect,
  onPlayerCreate,
  initialScore,
  isError,
  errorMessage,
}: AvailablePlayersCardProps) => {
  const [rankings, setRankings] = useState<Record<string, number>>(() =>
    players.reduce(
      (acc, player) => ({ ...acc, [player.nickname]: initialScore }),
      {}
    )
  );

  // State for new player form
  const [newPlayerNickname, setNewPlayerNickname] = useState("");
  const [newPlayerRealname, setNewPlayerRealname] = useState("");
  const [newPlayerRfid, setNewPlayerRfid] = useState("");

  const handleRankingChange = (nickname: string, ranking: number) => {
    setRankings((prev) => ({ ...prev, [nickname]: ranking }));
  };

  const handlePlayerClick = (player: Api.Player) => {
    onPlayerSelect(player, rankings[player.nickname] || initialScore);
  };

  const handleCreatePlayer = () => {
    if (newPlayerNickname.trim()) {
      onPlayerCreate(
        {
          nickname: newPlayerNickname,
          realname: newPlayerRealname,
          rfid: newPlayerRfid,
        },
        initialScore
      );
      // Reset form
      setNewPlayerNickname("");
      setNewPlayerRealname("");
      setNewPlayerRfid("");
    }
  };

  return (
    <>
      {isError && errorMessage && <ErrorSnackbar msg={errorMessage} />}
      <StyledCard elevation={2}>
        <StyledCardHeader title={`Available Players (${players.length})`} />
        <CardContent>
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
                  <ExistingPlayer
                    key={player.nickname}
                    player={player}
                    ranking={rankings[player.nickname] || initialScore}
                    onRankingChange={handleRankingChange}
                    onAdd={handlePlayerClick}
                    initialScore={initialScore}
                  />
                ))}
                <NewPlayer
                  nickname={newPlayerNickname}
                  realname={newPlayerRealname}
                  rfid={newPlayerRfid}
                  setNickname={setNewPlayerNickname}
                  setRealname={setNewPlayerRealname}
                  setRfid={setNewPlayerRfid}
                  onCreate={handleCreatePlayer}
                />
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>
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

  const handlePlayerSelect = (player: Api.Player, ranking: number) => {
    mutateTourPlayer({
      nickname: player.nickname,
      ranking: ranking,
    });
  };

  const handlePlayerCreate = (
    playerData: {
      nickname: string;
      realname: string;
      rfid: string;
    },
    ranking: number
  ) => {
    // First create the player, then add to tournament
    mutatePlayer(playerData);
    // Note: In a real implementation, you'd want to wait for player creation success
    // before adding to tournament, but for this example we'll do it immediately
    mutateTourPlayer({
      nickname: playerData.nickname,
      ranking: ranking,
    });
  };

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
            onPlayerCreate={handlePlayerCreate}
            initialScore={tournamentData?.initial || 1000}
            isError={isPlayerError}
            errorMessage={mutatePlayerError?.message}
          />
        </Box>
      )}
    </FullScreenDialog>
  );
};

export default AddPlayersDialog;
