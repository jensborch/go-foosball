import { useParams } from "react-router-dom";
import Menu from "../components/Menu";
import Games from "../components/Games";
import History from "../components/History";
import { Error } from "../components/Error";
import TournamentPlayers from "../components/TournamentPlayers";
import { MenuOffset } from "../components/Styled";
import ActionDraw from "../components/ActionDraw";
import Start from "../components/Start";
import { Box, Grid, Stack } from "@mui/material";

function Tournament() {
  const { id } = useParams();

  if (!id) {
    return <Error msg="Tournament ID is not defined"></Error>;
  }
  return (
    <Stack direction="row">
      <Menu title="Foosball" />
      <ActionDraw tournament={id} />
      <Box component="main" width="100%" padding={1}>
        <MenuOffset />
        <Box m={1}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Start tournament={id} />
            </Grid>
            <Grid size="auto">
              <TournamentPlayers tournament={id} />
            </Grid>
            <Grid size="grow" display="flex" justifyContent="center">
              <Games tournament={id} />
            </Grid>
            <Grid size="auto">
              <History tournament={id} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Stack>
  );
}

export default Tournament;
