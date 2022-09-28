import { useParams } from "react-router-dom";
import AddSpeedDial from "../components/AddSpeedDial";
import Menu from "../components/Menu";
import Games from "../components/Games";
import History from "../components/History";
import { Error } from "../components/Error";
import RefreshRandomGames from "../components/RefreshRandomGames";
import Start from "../components/Start";
import TournamentPlayers from "../components/TournamentPlayers";
import { DefaultGrid } from "../components/Styled";

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
        <Start tournament={id} />
      </Menu>
      <DefaultGrid container direction="row">
        <TournamentPlayers tournament={id} />
        <Games tournament={id} />
        <History tournament={id} />
      </DefaultGrid>
    </>
  );
}

export default Tournament;
