import { useParams } from "react-router-dom";
import Menu from "../components/Menu";
import Games from "../components/Games";
import History from "../components/History";
import { Error } from "../components/Error";
import TournamentPlayers from "../components/TournamentPlayers";
import { DefaultGrid, MenuOffset } from "../components/Styled";
import ActionDraw from "../components/ActionDraw";
import { Box } from "@mui/material";

function Tournament() {
  const { id } = useParams();

  if (!id) {
    return <Error msg="Tournament ID is not defined"></Error>;
  }
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Menu title="Foosball" />
        <ActionDraw tournament={id} />
        <Box component="main">
          <MenuOffset />
          <DefaultGrid container direction="row">
            <TournamentPlayers tournament={id} />
            <Games tournament={id} />
            <History tournament={id} />
          </DefaultGrid>
        </Box>
      </Box>
    </>
  );
}

export default Tournament;
