import {
  Button,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import { useTournamentMutation } from "../api/hooks";
import FullScreenDialog from "./FullScreenDialog";
import { useState } from "react";
import { DefaultGrid, StyledCard } from "./Styled";

type CreateTournamentProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CreateTournamentDialog = ({ open, setOpen }: CreateTournamentProps) => {
  const [initial, setInitial] = useState(0);
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);
  const [timeout, setTimeout] = useState(120);
  const { mutate } = useTournamentMutation();

  const onCreateTournament = () => {
    mutate({
      initial,
      name,
      score,
      timeout,
    });
    setOpen(false);
  };

  return (
    <FullScreenDialog setOpen={setOpen} open={open} title="Create tournament">
      <DefaultGrid container direction="row">
        <Grid>
          <StyledCard>
            <CardContent>
              <Grid container direction="column">
                <Grid>
                  <TextField
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    helperText="Name"
                    label="Name"
                    margin="dense"
                  />
                </Grid>
                <Grid>
                  <TextField
                    type="number"
                    value={initial}
                    onChange={(e) => setInitial(parseInt(e.target.value))}
                    helperText="Initial"
                    label="Initial"
                    margin="dense"
                  />
                </Grid>
                <Grid>
                  <TextField
                    type="number"
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value))}
                    helperText="Score"
                    label="Score"
                    margin="dense"
                  />
                </Grid>
                <Grid>
                  <TextField
                    type="number"
                    value={timeout}
                    onChange={(e) => setTimeout(parseInt(e.target.value))}
                    helperText="Timeout"
                    label="Timeout"
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
      </DefaultGrid>
    </FullScreenDialog>
  );
};

export default CreateTournamentDialog;
