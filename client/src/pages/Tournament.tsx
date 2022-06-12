import { useParams } from 'react-router-dom';
import AddSpeedDial from '../components/AddSpeedDial';
import Menu from '../components/Menu';
import Games from '../components/Games';
import { Error } from '../components/Error';
import { Box } from '@mui/system';
import RefreshRandomGames from '../components/RefreshRandomGames';
import Start  from '../components/Start';

function Tournament() {
  const { id } = useParams();

  if (!id) {
    return <Error msg="Tournament ID is not defined"></Error>;
  }
  return (
    <>
      <Menu title="Foosball">
        <Start />
        <RefreshRandomGames />
        <AddSpeedDial tournament={id} />
      </Menu>
      <Box
        sx={{
          margin: (theme) => theme.spacing(4),
        }}
      >
      <Games tournament={id} />
      </Box>
      
    </>
  );
}

export default Tournament;
