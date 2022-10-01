import { Fab } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQueryClient } from "react-query";
import { CacheKeys } from "../api/hooks";

const RefreshRandomGames = () => {
  const queryClient = useQueryClient();
  return (
    <Fab
      onClick={() => queryClient.invalidateQueries(CacheKeys.RandomGames)}
      color="default"
      aria-label="Random"
    >
      <RefreshIcon />
    </Fab>
  );
};

export default RefreshRandomGames;
