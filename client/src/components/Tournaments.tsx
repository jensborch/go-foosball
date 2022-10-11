import * as Api from "../api/Api";
import { toLocaleDateString } from "../api/util";
import { Error } from "./Error";
import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTournaments } from "../api/hooks";
import { DefaultGrid, StyledCard } from "./Styled";

const Tournament = ({ created, name, score, initial, id }: Api.Tournament) => {
  const navigate = useNavigate();
  return (
    <StyledCard
      sx={{ minWidth: "275px", cursor: "pointer" }}
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
    </StyledCard>
  );
};

const TournamentsError = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
};

const Tournaments = () => {
  const { status, error, data } = useTournaments();
  if (status === "loading") {
    return (
      <TournamentsError>
        <CircularProgress size={100} />
      </TournamentsError>
    );
  }
  if (status === "error") {
    return (
      <TournamentsError>
        <Error msg={error?.message}></Error>
      </TournamentsError>
    );
  }
  return (
    <DefaultGrid container direction="row">
      {data?.map((tournament) => (
        <Grid item key={tournament.id}>
          <Tournament {...tournament} />
        </Grid>
      ))}
    </DefaultGrid>
  );
};

export default Tournaments;
