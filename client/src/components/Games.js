import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  card: {
    minWidth: 300,
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

function Players(props) {
  const { classes } = props;
  const { data } = props;
  return (
    <div className={classes.row}>
      <div className={classes.row}>
        <Typography className={classes.name} variant="subtitle1">
          {data[0]}
        </Typography>
        <Avatar className={classes.avatar}>{data[0].substring(0, 2)}</Avatar>
      </div>
      {data.length > 1 ? (
        <div className={classes.row}>
          <Avatar className={classes.avatar}>{data[1].substring(0, 2)}</Avatar>
          <Typography className={classes.name} variant="subtitle1">
            {data[1]}
          </Typography>
        </div>
      ) : null}
    </div>
  );
}

class Game extends React.Component {
  registerGame(wereRightWinner) {
    this.props.registerGame(
      this.props.data.tournamentId,
      this.props.data.table.uuid,
      this.props.data.leftPlayers,
      this.props.data.rightPlayers,
      wereRightWinner
    );
  }

  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <Card className={classes.card} elevation={4}>
        <CardContent>
          <Players data={data.rightPlayers} classes={classes} />
          <LinearProgress
            className={classes.score}
            color="secondary"
            variant="determinate"
            value={(data.rightScore / (data.rightScore + data.leftScore)) * 100}
          />
          <div size="small" className={classes.row}>
            <Button
              className={classes.button}
              onClick={() => this.registerGame(true)}
            >
              {data.table.color.right} wins {data.rightScore} points
            </Button>
          </div>
          <Divider />
          <div size="small" className={classes.row}>
            <Button
              className={classes.button}
              onClick={() => this.registerGame(false)}
            >
              {data.table.color.left} wins {data.leftScore} points
            </Button>
          </div>
          <LinearProgress
            className={classes.score}
            color="secondary"
            variant="determinate"
            value={(data.leftScore / (data.rightScore + data.leftScore)) * 100}
          />
          <Players data={data.leftPlayers} classes={classes} />
        </CardContent>
      </Card>
    );
  }
}

class Games extends React.Component {
  componenDidMount() {
    this.props.fetch(this.props.id);
  }

  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <div>
        {data.map(game => (
          <Game
            key={game.uuid}
            classes={classes}
            data={game}
            registerGame={this.props.registerGame}
          />
        ))}
      </div>
    );
  }
}

Players.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};

Game.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

Games.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  fetch: PropTypes.func.isRequired,
};

export default withRoot(withStyles(styles)(Games));
