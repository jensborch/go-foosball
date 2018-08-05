import React from 'react';
import PropTypes from 'prop-types';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheck from '@material-ui/icons/PlaylistAddCheck';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

class Player extends React.Component {
  state = { score: this.props.score };

  select = () => {
    this.props.select(
      this.props.tournament,
      this.props.data.nickname,
      this.state.score
    );
  };

  deselect = () => {
    this.props.deselect(this.props.tournament, this.props.data.nickname);
  };

  updateScore = event => {
    this.setState({ score: event.target.value });
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
                id="score"
                type="text"
                value={this.state.score}
                onChange={this.updateScore}
              />
              {data.active ? (
                <IconButton className={classes.icon} onClick={this.select}>
                  <PlaylistAdd />
                </IconButton>
              ) : (
                <IconButton className={classes.icon} onClick={this.deselect}>
                  <PlaylistAddCheck />
                </IconButton>
              )}
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
    const { classes } = this.props;
    const { data } = this.props;
    const players = data ? data : [];
    return (
      <GridList className={classes.list}>
        {players.map((p, i) => (
          <div key={p.nickname}>
            <Player
              data={p}
              tournament={this.props.id}
              score={this.props.score}
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
  data: PropTypes.array.isRequired,
  score: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  fetch: PropTypes.func,
};

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  tournament: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  deselect: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
};

export default PlayersGrid;
