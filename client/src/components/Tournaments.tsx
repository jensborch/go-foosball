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
  styled,
  Typography,
} from '@mui/material';
import styles from './Tournaments.module.css';

const DarkAvatar = styled(Avatar)(
  ({ theme }) => `background-color: ${theme.palette.secondary.main}`
);

const Tournament = (props: Api.Tournament) => {
  const { created, name, score, initial } = props;
  return (
    <Card className={styles.card} elevation={4}>
      <CardHeader
        avatar={<DarkAvatar>{name.substring(0, 1)}</DarkAvatar>}
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
      <div className={styles.root}>
        <CircularProgress />
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className={styles.root}>
        <Error msg={error?.message}></Error>
      </div>
    );
  }
  return (
    <div className={styles.root}>
      {data?.map((tournament) => (
        <Tournament key={tournament.id} {...tournament} />
      ))}
    </div>
  );
};

export default Tournaments;
