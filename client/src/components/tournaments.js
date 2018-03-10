import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';

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
});

class Tournament extends React.Component {
  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="headline" component="h2">
            {data.name}
          </Typography>
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
