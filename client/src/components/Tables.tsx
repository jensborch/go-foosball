import { CircularProgress, Grid } from '@mui/material';
import { useTournamentTables } from '../api/hooks';
import { Table } from '../components/Table';
import { Error } from './Error';

type TableProps = {
  tournament: string;
};

const Tables = ({ tournament }: TableProps) => {
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
            <Table key={table.id} {...table} />
          </Grid>
        ))}
    </Grid>
  );
};

export default Tables;
