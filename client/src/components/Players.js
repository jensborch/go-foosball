import Avatar from 'material-ui/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

const styles = theme => ({
  paper: {
    maxWidth: 275,
    minWidth: 200,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
});

class Player extends React.Component {
  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <ListItem>
        <Avatar className={classes.avatar}>
          {data.nickname.substring(0, 2)}
        </Avatar>
        <ListItemText primary={data.nickname} secondary={data.realname} />
        <ListItemSecondaryAction>
          <Checkbox />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

class Players extends React.Component {
  componentWillMount() {
    this.props.fetch(this.props.id);
  }

  render() {
    const { classes } = this.props;
    const { data } = this.props;
    const players = Array.from(data.values());
    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={4}>
          <List>
            {players.map((p, i) => (
              <div key={p.nickname}>
                <Player data={p} classes={classes} />
                {i !== players.length - 1 ? (
                  <li>
                    <Divider inset />
                  </li>
                ) : null}
              </div>
            ))}
          </List>
        </Paper>
      </div>
    );
  }
}

Players.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  fetch: PropTypes.func.isRequired,
};

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Players));
