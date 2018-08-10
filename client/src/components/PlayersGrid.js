import React from 'react';
import PropTypes from 'prop-types';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import AddCircle from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

class Player extends React.Component {
  state = { ranking: this.props.ranking };

  select = () => {
    this.props.select(
      this.props.tournament,
      this.props.player.nickname,
      this.state.ranking
    );
  };

  render() {
    const { classes, player } = this.props;
    return (
      <GridListTile key={player.nickname}>
        <div className={classes.cell} />
        <GridListTileBar
          title={player.nickname}
          subtitle={player.realname}
          actionIcon={
            <div>
              <TextField
                value={this.state.ranking}
                onChange={(e) => this.setState({ ranking: e.target.value })}
              />
              <IconButton className={classes.icon} onClick={this.select}>
                <AddCircle />
              </IconButton>
            </div>
          }
        />
      </GridListTile>
    );
  }
}

class PlayersGrid extends React.Component {
  componentWillMount() {
    if (this.props.fetch) {
      this.props.fetch(this.props.id);
    }
  }

  render() {
    const { classes, players } = this.props;
    return (
      <GridList className={classes.list}>
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
      </GridList>
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
