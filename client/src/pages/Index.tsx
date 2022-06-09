import Tournaments from '../components/Tournaments';
import Menu from '../components/Menu';
import { CreateTournament } from '../components/CreateTournament';
import { Box } from '@mui/system';

function Index() {
  return (
    <>
      <Menu title="Foosball" children={undefined}></Menu>
      <Box
        sx={{
          margin: (theme) => theme.spacing(4),
        }}
      >
        <Tournaments />
      </Box>
      <CreateTournament />
    </>
  );
}

export default Index;
