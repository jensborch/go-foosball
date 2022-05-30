import * as Api from '../api/Api';
import { api, handleErrors, toLocaleDateString } from '../api/Util';
import { useQuery } from 'react-query';
import { Error } from './Error';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

const rootStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  padding: '20px',
  justifyContent: 'space-between',
}

const Tournament = (props: Api.Tournament) => {
  const { created, name, score, initial } = props;
  return (
    <Card sx={{ minWidth: '275px' }} elevation={4}>
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

async function getTournaments(): Promise<Api.Tournament[]> {
  return api.tournaments
    .tournamentsList()
    .then(handleErrors)
    .then((r) => r.data);
}

const Tournaments = () => {
  const { status, error, data } = useQuery<Api.Tournament[], Error>(
    'tournaments',
    getTournaments
  );
  if (status === 'loading') {
    return (
      <Box sx={rootStyle}>
        <CircularProgress />
      </Box>
    );
  }
  if (status === 'error') {
    return (
      <Box sx={rootStyle}>
        <Error msg={error?.message}></Error>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        padding: '20px',
        justifyContent: 'space-between',
      }}
    >
      {data?.map((tournament) => (
        <Tournament key={tournament.id} {...tournament} />
      ))}
    </Box>
  );
};

export default Tournaments;
