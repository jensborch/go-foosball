import { useParams } from 'react-router-dom';
import AddSpeedDial from '../components/AddSpeedDial';
import Menu from '../components/Menu';
import Games from '../components/Games';
import { Error } from '../components/Error';
import { Box } from '@mui/system';
import RefreshRandomGames from '../components/RefreshRandomGames';
import Start from '../components/Start';
import TournamentPlayers from '../components/TournamentPlayers';
import { Grid } from '@mui/material';

function Tournament() {
  const { id } = useParams();

  if (!id) {
    return <Error msg="Tournament ID is not defined"></Error>;
  }
  return (
    <>
      <Menu title="Foosball">
        <AddSpeedDial tournament={id} />
        <RefreshRandomGames />
        <Start />
      </Menu>
      <Box
        sx={{
          margin: (theme) => theme.spacing(4),
        }}
      >
        <Grid container spacing={2} direction="row">
          <TournamentPlayers tournament={id} />
          <Games tournament={id} />
        </Grid>
      </Box>
    </>
  );
}

export default Tournament;
