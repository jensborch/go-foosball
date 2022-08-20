import {
  Button,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from '@mui/material';
import { useTournamentMutation } from '../api/hooks';
import FullScreenDialog from './FullScreenDialog';
import { useState } from 'react';
import { StyledCard } from './Styled';

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
      <Grid
        sx={{
          margin: (theme) => theme.spacing(),
        }}
        spacing={2}
        container
        direction="row"
      >
        <Grid item>
          <StyledCard>
            <CardContent>
              <Grid container direction="column">
                <Grid item>
                  <TextField
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    helperText="Name"
                    label="Name"
                    margin="dense"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    type="number"
                    value={initial}
                    onChange={(e) => setInitial(parseInt(e.target.value))}
                    helperText="Initial"
                    label="Initial"
                    margin="dense"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    type="number"
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value))}
                    helperText="Score"
                    label="Score"
                    margin="dense"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button variant="outlined" onClick={onCreateTournament}>
                Create
              </Button>
            </CardActions>
          </StyledCard>
        </Grid>
      </Grid>
    </FullScreenDialog>
  );
};

export default CreateTournamentDialog;
