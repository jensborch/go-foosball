import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';

const styles = (theme) => ({
  card: {
    minWidth: 275,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
});

class Tournament extends React.Component {
  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <Card className={classes.card} elevation={4}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              {data.name.substring(0, 1)}
            </Avatar>
          }
          title={data.name}
          subheader={data.created.toLocaleDateString()}
        />
        <CardContent>
          <Typography variant="body1">Score pr. game: {data.score}</Typography>
          <Typography variant="body1">
            Initial ranking: {data.initial}
          </Typography>
        </CardContent>
        <CardActions>
          <Link to={`/tournament/${data.uuid}`}>
            <Button size="small" color="primary">
              Play
            </Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
}

class NewTournament extends React.Component {
  state = {
    name: '',
    score: '50',
    initial: '1500',
  };

  create = () => {
    this.props.createTournament(
      this.state.name,
      this.state.score,
      this.state.initial
    );
  };

  render() {
    return (
      <Card elevation={4}>
        <CardHeader
          title="New Tournament"
          subheader="Fill out the form and press add to create the tournament."
        />
        <CardContent>
          <TextField
            helperText="Name"
            value={this.state.name}
            onChange={(event) => this.setState({ name: event.target.value })}
            lable="Name"
          />
          <TextField
            helperText="Score"
            value={this.state.score}
            onChange={(event) => this.setState({ score: event.target.value })}
            lable="Score"
            keyboardType="number-pad"
          />
          <TextField
            helperText="Initial"
            value={this.state.initial}
            onChange={(event) => this.setState({ initial: event.target.value })}
            lable="Initial"
            keyboardType="number-pad"
          />
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={this.create}>
            Add
          </Button>
        </CardActions>
      </Card>
    );
  }
}

class Tournaments extends React.Component {
  componentDidMount() {
    this.props.fetch();
  }

  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <div className={classes.root}>
        <NewTournament createTournament={this.props.createTournament} />
        {Object.values(data).map((tournament) => (
          <Tournament
            key={tournament.uuid}
            data={tournament}
            classes={classes}
          />
        ))}
      </div>
    );
  }
}

Tournaments.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
};

Tournament.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Tournaments));
