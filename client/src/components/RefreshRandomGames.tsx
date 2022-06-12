import { Fab } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQueryClient } from 'react-query';

const RefreshRandomGames = () => {
  const queryClient = useQueryClient();
    return (
      <Fab
        onClick={() => queryClient.invalidateQueries('randomGames')}
        color="default"
        aria-label="add"
      >
        <RefreshIcon />
      </Fab>
    );
  }


export default RefreshRandomGames;
