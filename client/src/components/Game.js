import React from 'react';
import PropTypes from 'prop-types';
import Card, {
  CardMedia,
  CardContent,
} from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';

const styles = theme => ({
  card: {
    minWidth: 275,
    margin: 20,
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
        <CardContent>
        <Typography variant="body2">Game</Typography>
        </CardContent>
      </Card>
    );
  }
}

Game.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Game));
