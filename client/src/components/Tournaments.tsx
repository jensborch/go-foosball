import * as Api from '../api/Api';
import { toLocaleDateString } from '../api/Util';
import { Error } from './Error';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTournaments } from '../api/hooks';


const Tournament = ({ created, name, score, initial, id }: Api.Tournament) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{ minWidth: '275px', cursor: 'pointer' }}
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
  if (status === 'loading') {
    return <CircularProgress />;
  }
  if (status === 'error') {
    return <Error msg={error?.message}></Error>;
  }
  return (
    <Grid container spacing={2} direction="row">
      {data?.map((tournament) => (
        <Grid item>
          <Tournament key={tournament.id} {...tournament} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Tournaments;
