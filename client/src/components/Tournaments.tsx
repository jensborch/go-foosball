import Avatar from "@material-ui/core/Avatar";
import { FunctionComponent, useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { makeStyles, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: 20,
    justifyContent: "space-between",
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export interface TournamentProps {
  created: Date;
  name: string;
  score: number;
  uuid: string;
  initial: number;
}

const Tournament = (props: TournamentProps) => {
  const classes = useStyles();
  const { created, name, score, uuid, initial } = props;
  return (
    <Card className={classes.card} elevation={4}>
      <CardHeader
        avatar={
          <Avatar className={classes.avatar}>{name.substring(0, 1)}</Avatar>
        }
        title={name}
        subheader={created.toLocaleDateString()}
      />
      <CardContent>
        <Typography variant="body1">Score pr. game: {score}</Typography>
        <Typography variant="body1">Initial ranking: {initial}</Typography>
      </CardContent>
      <CardActions>
        <Link to={`/tournament/${uuid}`}>
          <Button size="small" color="primary">
            Play
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export interface NewTournamentProps {
  name?: string;
  score?: number;
  initial?: string;
  create: () => void;
  onChange: (value: boolean) => void;
}

const NewTournament: FunctionComponent<NewTournamentProps> = ({
  name = "",
  score = 50,
  initial = 1500,
  create,
  onChange,
}) => {
  const [state, setState] = useState({
    name,
    score,
    initial,
  });
  return (
    <Card elevation={4}>
      <CardHeader
        title="New Tournament"
        subheader="Fill out the form and press add to create the tournament."
      />
      <CardContent>
        <TextField
          helperText="Name"
          value={state.name}
          onChange={(event) => setState({ ...state, name: event.target.value })}
          label="Name"
        />
        <TextField
          helperText="Score"
          value={state.score}
          onChange={(event) => {
            setState({ ...state, score: parseInt(event.target.value) });
            onChange(true);
          }}
          label="Score"
        />
        <TextField
          helperText="Initial"
          value={state.initial}
          onChange={(event) =>
            setState({ ...state, initial: event.target.value })
          }
          label="Initial"
        />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={create}>
          Add
        </Button>
      </CardActions>
    </Card>
  );
};

export interface TournamentsProps {
  create: () => void;
  fetch: () => TournamentProps[];
}

const Tournaments = (props: TournamentsProps) => {
  const { create, fetch } = props;
  const classes = useStyles();
  const [tournaments, setTournaments] = useState<TournamentProps[]>([]);
  const [update, setUpdate] = useState<boolean>(true);
  useEffect(() => {
    if (update) {
      setTournaments(fetch());
    } else {
      setUpdate(false);
    }
  }, [fetch, update]);
  return (
    <div className={classes.root}>
      <NewTournament create={create} onChange={setUpdate} />
      {Object.values(tournaments).map((tournament) => (
        <Tournament key={tournament.uuid} {...tournament} />
      ))}
    </div>
  );
};

export default Tournaments;
