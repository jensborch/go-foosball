import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardActions, CardContent, CardHeader } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

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
          <Typography variant="body2">Score pr. game: {data.score}</Typography>
          <Typography variant="body2">
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

class Tournaments extends React.Component {
  componentWillMount() {
    this.props.fetch();
  }

  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <div className={classes.root}>
        {data.map(tournament => (
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
  data: PropTypes.array.isRequired,
  fetch: PropTypes.func.isRequired,
};

Tournament.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Tournaments));
