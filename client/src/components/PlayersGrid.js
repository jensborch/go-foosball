import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class Player extends React.Component {
  state = { ranking: this.props.ranking };

  select = () => {
    this.props.select(
      this.props.tournament,
      this.props.player.nickname,
      parseInt(this.state.ranking, 10)
    );
  };

  render() {
    const { classes, player } = this.props;
    return (
      <Card className={classes.card} key={player.nickname}>
        <div className={classes.cell} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h3">
            {player.nickname} - {player.realname}
          </Typography>
        </CardContent>
        <CardActions>
          <div>
            <TextField
              type="number"
              value={this.state.ranking}
              onChange={(e) => this.setState({ ranking: e.target.value })}
              helperText="Ranking"
              lable="Ranking"
              margin="dense"
            />
            <Button
              variant="outlined"
              className={classes.cardButton}
              onClick={this.select}
            >
              Add
            </Button>
          </div>
        </CardActions>
      </Card>
    );
  }
}

class NewPlayer extends React.Component {
  state = {
    nickname: '',
    realname: '',
  };

  create = () => {
    this.props.create(this.state.nickname, this.state.realname);
  };

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Grid container direction="column">
            <Grid item>
              <TextField
                helperText="Name"
                value={this.state.realname}
                onChange={(event) =>
                  this.setState({
                    realname: event.target.value,
                  })
                }
                lable="Name"
              />
            </Grid>
            <Grid item>
              <TextField
                helperText="Nickname"
                value={this.state.nickname}
                onChange={(event) =>
                  this.setState({ nickname: event.target.value })
                }
                lable="Nickname"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            className={classes.cardButton}
            onClick={this.create}
          >
            Create
          </Button>
        </CardActions>
      </Card>
    );
  }
}

class PlayersGrid extends React.Component {
  componentDidMount() {
    if (this.props.fetch) {
      this.props.fetch(this.props.id);
    }
  }

  render() {
    const { classes, players } = this.props;
    return (
      <Grid container spacing={16} direction="row">
        {players.map((p, i) => (
          <Grid item key={p.nickname}>
            <Player
              player={p}
              tournament={this.props.tournament}
              ranking={this.props.ranking}
              select={this.props.select}
              classes={classes}
            />
          </Grid>
        ))}
        <Grid item>
          <NewPlayer classes={classes} create={this.props.create} />
        </Grid>
      </Grid>
    );
  }
}

PlayersGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  tournament: PropTypes.string.isRequired,
  ranking: PropTypes.number.isRequired,
  fetch: PropTypes.func,
  create: PropTypes.func.isRequired,
};

NewPlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  create: PropTypes.func.isRequired,
};

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  tournament: PropTypes.string.isRequired,
  ranking: PropTypes.number.isRequired,
  select: PropTypes.func.isRequired,
};

export default PlayersGrid;
