import { useParams } from "react-router-dom";
import Menu from "../components/Menu";
import Games from "../components/Games";
import History from "../components/History";
import { Error } from "../components/Error";
import TournamentPlayers from "../components/TournamentPlayers";
import { MenuOffset } from "../components/Styled";
import ActionDraw from "../components/ActionDraw";
import Start from "../components/Start";
import { Box, Grid } from "@mui/material";

function Tournament() {
  const { id } = useParams();

  if (!id) {
    return <Error msg="Tournament ID is not defined"></Error>;
  }
  return (
    <Box sx={{ display: "flex" }}>
      <Menu title="Foosball" />
      <ActionDraw tournament={id} />
      <Box component="main" sx={{ width: "100%" }}>
        <MenuOffset />
        <Box sx={{ m: 1 }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Start tournament={id} />
            </Grid>
            <Grid>
              <TournamentPlayers tournament={id} />
            </Grid>
            <Grid
              size="grow"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Games tournament={id} />
            </Grid>
            <Grid>
              <History tournament={id} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default Tournament;
