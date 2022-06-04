import * as Api from "../api/Api";
import { toLocaleDateString } from "../api/Util";
import { Error } from "./Error";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useTournaments } from "../api/hooks";

const rootStyle = {
  display: "flex",
  flexWrap: "wrap",
  padding: "20px",
  justifyContent: "space-between",
};

const Tournament = (props: Api.Tournament) => {
  const { created, name, score, initial, id } = props;
  const navigate = useNavigate();

  return (
    <Card
      sx={{ minWidth: "275px", cursor: "pointer" }}
      elevation={4}
      onClick={() => navigate(`./tournament/${id}`)}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,
            }}
          >
            {name.substring(0, 1)}
          </Avatar>
        }
        title={name}
        subheader={toLocaleDateString(created)}
      />
      <CardContent>
        <Typography variant="body1">Score pr. game: {score}</Typography>
        <Typography variant="body1">Initial ranking: {initial}</Typography>
      </CardContent>
    </Card>
  );
};

const Tournaments = () => {
  const { status, error, data } = useTournaments();
  if (status === "loading") {
    return (
      <Box sx={rootStyle}>
        <CircularProgress />
      </Box>
    );
  }
  if (status === "error") {
    return (
      <Box sx={rootStyle}>
        <Error msg={error?.message}></Error>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        padding: "20px",
        justifyContent: "space-between",
      }}
    >
      {data?.map((tournament) => (
        <Tournament key={tournament.id} {...tournament} />
      ))}
    </Box>
  );
};

export default Tournaments;
