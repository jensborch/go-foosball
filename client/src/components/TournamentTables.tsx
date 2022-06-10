import * as Api from '../api/Api';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
} from '@mui/material';
import { usePlayers, useTournamentTables } from '../api/hooks';
import { Error } from './Error';
import { green } from '@mui/material/colors';

export const TournamentTable = ({ color, name }: Api.Table) => {
  const { data: players } = usePlayers();

  console.log(players);

  return (
    <Card sx={{ minWidth: '300px', margin: (theme) => theme.spacing(4) }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              backgroundColor: green[500],
            }}
          >
            T
          </Avatar>
        }
        title={`${name}`}
        subheader={`${color.left}`}
      />
      <CardContent>
        <Grid container spacing={2} direction="column">
          {players?.map((player) => (
            <Grid item>
              <Player key={player.nickname} {...player} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const Player = ({ nickname, realname }: Api.Player) => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,
            }}
          >
            {nickname.substring(0, 1)}
          </Avatar>
        }
        title={nickname}
        subheader={realname}
      />
    </Card>
  );
};

type TableProps = {
  tournament: string;
};

const TournamentTables = ({ tournament }: TableProps) => {
  const { status, error, data } = useTournamentTables(tournament);

  if (status === 'loading') {
    return <CircularProgress />;
  }
  if (status === 'error') {
    return <Error msg={error?.message}></Error>;
  }
  return (
    <Grid container spacing={2} direction="row">
      {data
        ?.map((tt) => tt.table)
        .map((table) => (
          <Grid item>
            <TournamentTable key={table.id} {...table} />
          </Grid>
        ))}
    </Grid>
  );
};

export default TournamentTables;
