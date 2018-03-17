import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { LinearProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';

const styles = theme => ({
  card: {
    minWidth: 275,
    margin: 20,
  },
  avatar: {
    margin: 20,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    maxWidth: '50%',
  },
  score: {
    padding: 10,
    margin: 5,
  },
  button: {
    margin: 15,
  },
});

class Game extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.row}>
            <Typography className={classes.name} variant="subheading">
              test
            </Typography>
            <Avatar className={classes.avatar}>H</Avatar>
            <Avatar className={classes.avatar}>J</Avatar>
            <Typography className={classes.name} variant="subheading">
              test
            </Typography>
          </div>
          <LinearProgress
            className={classes.score}
            color="secondary"
            variant="determinate"
            value="30"
          />
          <div size="small" className={classes.row}>
            <Button className={classes.button}>Red wins 30 points</Button>
          </div>
          <Divider />
          <div size="small" className={classes.row}>
            <Button className={classes.button}>Blue wins 20 points</Button>
          </div>
          <LinearProgress
            className={classes.score}
            color="secondary"
            variant="determinate"
            value="20"
          />
          <div className={classes.row}>
            <Typography className={classes.name} variant="subheading">
              test
            </Typography>
            <Avatar className={classes.avatar}>H</Avatar>
            <Avatar className={classes.avatar}>J</Avatar>
            <Typography className={classes.name} variant="subheading">
              test
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
}

Game.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Game));
