import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheck from '@material-ui/icons/PlaylistAddCheck';
import IconButton from '@material-ui/core/IconButton';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
  }

  select() {
    this.props.select(this.props.tournament, this.props.data.nickname);
  }

  deselect() {
    this.props.deselect(this.props.tournament, this.props.data.nickname);
  }

  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <GridListTile key={data.nickname}>
        <GridListTileBar
          title={data.nickname}
          subtitle={data.realname}
          actionIcon={
            <IconButton className={classes.icon}>
              {data.active ? <PlaylistAdd /> : <PlaylistAddCheck />}
            </IconButton>
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
  id: PropTypes.string.isRequired,
  fetch: PropTypes.func,
};

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  tournament: PropTypes.string.isRequired,
  deselect: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
};

export default PlayersGrid;
