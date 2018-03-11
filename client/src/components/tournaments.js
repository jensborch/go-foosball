import Avatar from 'material-ui/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import IconButton from 'material-ui/IconButton';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import { Link } from 'react-router-dom';

const styles = theme => ({
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
      <Card className={classes.card}>
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
          <Typography variant="body2">Score pr. game: {data.score}</Typography>
          <Typography variant="body2">
            Initial ranking: {data.initial}
          </Typography>
          <Link to={`/tournament/${data.uuid}`}>
            <IconButton aria-label="Play">
              <PlayArrowIcon />
            </IconButton>
          </Link>
        </CardContent>
      </Card>
    );
  }
}

class Tournaments extends React.Component {
  componentWillMount() {
    this.props.fetchTournaments();
  }

  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <div className={classes.root}>
        {data.tournaments.map(tournament => (
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
  data: PropTypes.shape({
    tournaments: PropTypes.array.isRequired,
  }).isRequired,
  fetchTournaments: PropTypes.func.isRequired,
};

Tournament.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Tournaments));
