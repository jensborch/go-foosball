import {
  Button,
  Card,
  CardActions,
  CardContent,

  TextField,
} from '@mui/material';
import { useTournamentMutation } from '../api/hooks';
import FullScreenDialog from './FullScreenDialog';
import { useState } from 'react';

type CreateTournamentProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CreateTournamentDialog = ({ open, setOpen }: CreateTournamentProps) => {
  const [initial, setInitial] = useState(0);
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const { mutate } = useTournamentMutation();

  const onCreateTournament = () => {
    mutate({
      initial,
      name,
      score,
    });
    setOpen(false);
  };

  return (
    <FullScreenDialog setOpen={setOpen} open={open} title="Create tournament">
      <Card>
        <CardContent>
        <TextField
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          helperText="Name"
          label="Name"
          margin="dense"
        />
        <TextField
          type="number"
          value={initial}
          onChange={(e) => setInitial(parseInt(e.target.value))}
          helperText="Initial"
          label="Initial"
          margin="dense"
        />
        <TextField
          type="number"
          value={score}
          onChange={(e) => setScore(parseInt(e.target.value))}
          helperText="Score"
          label="Score"
          margin="dense"
        />        
        </CardContent>
        <CardActions>
          <Button variant="outlined" onClick={onCreateTournament}>
            Create
          </Button>
        </CardActions>
      </Card>
    </FullScreenDialog>
  );
};

export default CreateTournamentDialog;
