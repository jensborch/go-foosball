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
import Button from 'material-ui/Button';
import BottomNavigation, {
  BottomNavigationAction,
} from 'material-ui/BottomNavigation';
import AddIcon from 'material-ui-icons/Add';

const styles = theme => ({
  paper: {
    maxWidth: 275,
    minWidth: 200,
    margin: 20,
    display: 'flex',
    flexFlow: 'column',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  list: {
    flex: 1,
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
    const players = data ? data : [];
    return (
      <Paper className={classes.paper} elevation={4}>
        <List className={classes.list}>
          <ListItem>
            <ListItemText primary="Players" />
          </ListItem>
          <Divider />
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
        <Divider />
        <BottomNavigation showLabels>
          <BottomNavigationAction label="Add" icon={<AddIcon />} />
        </BottomNavigation>
      </Paper>
    );
  }
}

Players.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  fetch: PropTypes.func.isRequired,
};

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Players));
