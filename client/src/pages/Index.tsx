import Tournaments from "../components/Tournaments";
import Menu from "../components/Menu";
import { Box } from "@mui/material";
import { CreateTournament } from "../components/CreateTournament";

function Index() {
  return (
    <>
      <Menu title="Foosball" children={undefined}></Menu>
      <Box sx={{ height: "100vh", width: "100vw" }}>
        <Tournaments />
        <CreateTournament />
      </Box>
    </>
  );
}

export default Index;
