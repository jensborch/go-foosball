import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import BottomNavigation, {
  BottomNavigationAction,
} from '@material-ui/core/BottomNavigation';
import AddIcon from '@material-ui/icons/Add';
import Players from './Players';
import AddPlayers from '../containers/AddPlayer';

const styles = theme => ({
  paper: {
    maxWidth: 200,
    minWidth: 150,
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

class TournamentPlayers extends React.Component {
  state = {
    open: false,
  };

  componentWillMount() {
    this.props.fetch(this.props.id);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { classes } = this.props;
    const { paper, ...childClasses } = classes;
    return (
      <Paper className={paper} elevation={4}>
        <Players
          classes={childClasses}
          fetch={this.props.fetch}
          select={this.props.select}
          deselect={this.props.deselect}
          data={this.props.data}
          id={this.props.id}
        />
        <Divider />
        <BottomNavigation showLabels>
          <BottomNavigationAction
            onClick={this.handleOpen}
            label="Add"
            icon={<AddIcon />}
          />
          <AddPlayers
            select={this.props.select}
            deselect={this.props.deselect}
            data={this.props.data}
            open={this.state.open}
            onClose={this.handleClose}
            id={this.props.id}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

TournamentPlayers.propTypes = {
  classes: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
};

export default withRoot(withStyles(styles)(TournamentPlayers));
