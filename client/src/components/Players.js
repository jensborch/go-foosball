import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CheckIcon from '@material-ui/icons/Check';

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
      <ListItem>
        {data.active ? (
          <Avatar className={classes.avatar} onClick={this.deselect}>
            <CheckIcon />
          </Avatar>
        ) : (
          <Avatar className={classes.avatar} onClick={this.select}>
            {data.nickname.substring(0, 2)}
          </Avatar>
        )}
        <ListItemText primary={data.nickname} secondary={data.realname} />
      </ListItem>
    );
  }
}

class Players extends React.Component {
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
      <List className={classes.list}>
        {players.map((p, i) => (
          <div key={p.nickname}>
            <Player
              data={p}
              tournament={this.props.id}
              select={this.props.select}
              deselect={this.props.deselect}
              classes={classes}
            />
            {i !== players.length - 1 ? (
              <li>
                <Divider inset />
              </li>
            ) : null}
          </div>
        ))}
      </List>
    );
  }
}

Players.propTypes = {
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

export default Players;
