import Tournaments from "../components/Tournaments";
import Menu from "../components/Menu";
import { CreateTournament } from "../components/CreateTournament";
import { MenuOffset } from "../components/Styled";

function Index() {
  return (
    <>
      <Menu title="Foosball">
        <CreateTournament />
      </Menu>
      <MenuOffset />
      <Tournaments />
    </>
  );
}

export default Index;
