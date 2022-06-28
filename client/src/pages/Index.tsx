import Tournaments from '../components/Tournaments';
import Menu from '../components/Menu';
import { CreateTournament } from '../components/CreateTournament';
import { Box } from '@mui/system';

function Index() {
  return (
    <>
      <Menu title="Foosball">
        <CreateTournament />
      </Menu>
      <Box
        sx={{
          margin: (theme) => theme.spacing(4),
        }}
      >
        <Tournaments />
      </Box>
    </>
  );
}

export default Index;
