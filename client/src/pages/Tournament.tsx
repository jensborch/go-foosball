import { useParams } from 'react-router-dom';
import AddSpeedDial from '../components/AddSpeedDial';
import Menu from '../components/Menu';
import Games from '../components/Games';
import { Error } from '../components/Error';
import { Box } from '@mui/system';

function Tournament() {
  const { id } = useParams();

  if (!id) {
    return <Error msg="Tournament ID is not defined"></Error>;
  }
  return (
    <>
      <Menu title="Foosball" children={undefined} />
      <Box
        sx={{
          margin: (theme) => theme.spacing(4),
        }}
      >
      <Games tournament={id} />
      </Box>
      <AddSpeedDial tournament={id} />
    </>
  );
}

export default Tournament;
