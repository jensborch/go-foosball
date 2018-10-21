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
              onChange={e => this.setState({ ranking: e.target.value })}
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

const AddNewPlayer = ({ player, onChange, classes }) => {
  return (
    <Card className={classes.card}>
      <CardContent>
        <Grid container direction="column">
          <Grid item>
            <TextField
              helperText="Name"
              value={player.realname}
              onChange={onChange}
              lable="Name"
            />
          </Grid>
          <Grid item>
            <TextField
              helperText="Nickname"
              value={player.nickname}
              onChange={onChange}
              lable="Nickname"
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button variant="outlined" className={classes.cardButton}>
          Create
        </Button>
      </CardActions>
    </Card>
  );
};

class PlayersGrid extends React.Component {
  state = {
    player: {
      nickname: '',
      realname: '',
    },
  };

  componentDidMount() {
    if (this.props.fetch) {
      this.props.fetch(this.props.id);
    }
  }

  render() {
    const { classes, players } = this.props;
    const { player } = this.state;
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
          <AddNewPlayer
            player={player}
            classes={classes}
            onChange={event =>
              this.setState({ player: { realname: event.target.value } })
            }
          />
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
};

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  tournament: PropTypes.string.isRequired,
  ranking: PropTypes.number.isRequired,
  select: PropTypes.func.isRequired,
};

export default PlayersGrid;
