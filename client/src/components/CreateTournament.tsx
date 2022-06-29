import { Fab } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQueryClient } from 'react-query';
import { api, handleErrors } from '../api/util';

export const CreateTournament = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    () => api.tournaments.tournamentsCreate({ initial: 0, name: '', score: 0 }),
    {
      onSuccess: () => queryClient.invalidateQueries('tournaments'),
      onError: (error) => {
        handleErrors(error as Response);
      },
    }
  );

  const onCreateTournament = () => {
    mutate();
  };
  return (
    <Fab
      color="default"
      aria-label="Create tournament"
      onClick={onCreateTournament}
    >
      <AddIcon />
    </Fab>
  );
};
