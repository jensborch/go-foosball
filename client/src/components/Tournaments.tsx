import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { CircularProgress, makeStyles } from '@material-ui/core';
import * as Api from '../api/Api';
import { api, handleErrors, toLocaleDateString } from '../api/Util';
import { useQuery } from 'react-query';
import { Error } from './Error';

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Tournament = (props: Api.Tournament) => {
  const classes = useStyles();
  const { created, name, score, initial } = props;
  return (
    <Card className={classes.card} elevation={4}>
      <CardHeader
        avatar={
          <Avatar className={classes.avatar}>{name.substring(0, 1)}</Avatar>
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
  const classes = useStyles();
  const { status, error, data } = useQuery<Api.Tournament[], Error>(
    'tournaments',
    getTournaments
  );
  if (status === 'loading') {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className={classes.root}>
        <Error msg={error?.message}></Error>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      {data?.map((tournament) => (
        <Tournament key={tournament.id} {...tournament} />
      ))}
    </div>
  );
};

export default Tournaments;
