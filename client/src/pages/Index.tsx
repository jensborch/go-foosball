import Tournaments from '../components/Tournaments';
import Menu from '../components/Menu';
import { CreateTournament } from '../components/CreateTournament';

function Index() {
  return (
    <>
      <Menu title="Foosball">
        <CreateTournament />
      </Menu>
      <Tournaments />
    </>
  );
}

export default Index;
