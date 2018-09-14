import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import AddCircle from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

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
      <Card key={player.nickname}>
        <CardHeader title={player.nickname} subheader={player.realname} />
        <CardContent>
          <div className={classes.cell} />
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
            <IconButton className={classes.icon} onClick={this.select}>
              <AddCircle />
            </IconButton>
          </div>
        </CardActions>
      </Card>
    );
  }
}

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
      <div className={classes.list}>
        {players.map((p, i) => (
          <div key={p.nickname}>
            <Player
              player={p}
              tournament={this.props.tournament}
              ranking={this.props.ranking}
              select={this.props.select}
              classes={classes}
            />
          </div>
        ))}
        <Card className={classes.card}>
          <CardContent>
            <TextField
              helperText="Name"
              value={player.realname}
              onChange={event =>
                this.setState({ player: { realname: event.target.value } })
              }
              lable="Name"
            />
            <TextField
              helperText="Nickname"
              value={player.nickname}
              onChange={event =>
                this.setState({ player: { nickname: event.target.value } })
              }
              lable="Nickname"
            />
          </CardContent>
          <CardActions>
            <Button variant="outlined" className={classes.button}>
              Create
            </Button>
          </CardActions>
        </Card>
      </div>
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
