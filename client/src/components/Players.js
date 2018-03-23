import Avatar from 'material-ui/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import BottomNavigation, {
  BottomNavigationAction,
} from 'material-ui/BottomNavigation';
import AddIcon from 'material-ui-icons/Add';
import CheckIcon from 'material-ui-icons/Check';

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
  constructor(props) {
    super(props);
    this.activete = this.activete.bind(this);
    this.deactivete = this.deactivete.bind(this);
  }

  activete() {
    this.props.activate(this.props.tournament, this.props.data.nickname);
  }

  deactivete() {
    this.props.deactivete(this.props.tournament, this.props.data.nickname);
  }

  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <ListItem>
        {data.active ? (
          <Avatar className={classes.avatar} onClick={this.deactivete}>
            <CheckIcon />
          </Avatar>
        ) : (
          <Avatar className={classes.avatar} onClick={this.activete}>
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
              <Player
                data={p}
                tournament={this.props.id}
                activate={this.props.activate}
                deactivete={this.props.deactivete}
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
  tournament: PropTypes.string.isRequired,
  deactivete: PropTypes.func.isRequired,
  activate: PropTypes.func.isRequired,
};

export default withRoot(withStyles(styles)(Players));
