import Avatar from 'material-ui/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardHeader } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';

const styles = theme => ({
  card: {
    width: 50,
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
});

class Player extends React.Component {
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
        />
      </Card>
    );
  }
}

class Players extends React.Component {
  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <div className={classes.root}>
        {data.players.map(p => (
          <Player key={p.nickname} data={p} classes={classes} />
        ))}
      </div>
    );
  }
}

Players.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.shape({
    players: PropTypes.array.isRequired,
  }).isRequired,
};

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Players));
