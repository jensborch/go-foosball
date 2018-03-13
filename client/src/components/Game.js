import Avatar from 'material-ui/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';

const styles = theme => ({
  card: {
    minWidth: 275,
  },
});

class Game extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="/foosball.jpg"
          title="Game"
        />
      </Card>
    );
  }
}

Tournament.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Game));
