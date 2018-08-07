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
      this.props.data.nickname,
      this.state.ranking
    );
  };

  deselect = () => {
    this.props.deselect(this.props.tournament, this.props.data.nickname);
  };

  updateRanking = event => {
    this.setState({ ranking: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <GridListTile key={data.nickname}>
        <div class={classes.cell} />
        <GridListTileBar
          title={data.nickname}
          subtitle={data.realname}
          actionIcon={
            <div>
              <TextField
                id="ranking"
                type="text"
                value={this.state.ranking}
                onChange={this.updateRanking}
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
    //const players = this.props.data.players ? this.props.data.players : [];
    return (
      <GridList className={classes.list}>
        {players.map((p, i) => (
          <div key={p.nickname}>
            <Player
              player={p}
              tournament={this.props.id}
              ranking={this.props.ranking}
              select={this.props.select}
              deselect={this.props.deselect}
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
  deselect: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
};

export default PlayersGrid;
