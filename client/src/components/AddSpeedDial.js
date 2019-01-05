import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import SpeedDial from '@material-ui/lab/SpeedDial';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import AddPlayers from '../containers/AddPlayers';
import AddTableDialog from '../containers/AddTableDialog';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class AddSpeedDial extends React.Component {
  state = {
    open: false,
    playersOpen: false,
    tablesOpen: false,
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handlePlayersClose = () => {
    this.setState({ playersOpen: false });
  };

  handlePlayersOpen = () => {
    this.setState({ playersOpen: true });
  };

  handleTablesClose = () => {
    this.setState({ tablesOpen: false });
  };

  handleTablesOpen = () => {
    this.setState({ tablesOpen: true });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <SpeedDial
          ButtonProps={{ color: 'default' }}
          color="green"
          ariaLabel="Add"
          className={classes.button}
          icon={<SpeedDialIcon />}
          onBlur={this.handleClose}
          onClick={this.handleClick}
          onClose={this.handleClose}
          onFocus={this.handleOpen}
          onMouseEnter={this.handleOpen}
          onMouseLeave={this.handleClose}
          open={this.state.open}
          direction="down"
        >
          <SpeedDialAction
            tooltipTitle="Add table"
            icon={<PersonIcon />}
            onClick={this.handlePlayersOpen}
          />
          <SpeedDialAction
            tooltipTitle="Add table"
            icon={<AddIcon />}
            onClick={this.handleTablesOpen}
          />
        </SpeedDial>
        <AddPlayers
          open={this.state.playersOpen}
          onClose={this.handlePlayersClose}
          id={this.props.tournament}
        />
        <AddTableDialog
          open={this.state.tablesOpen}
          tournament={this.props.tournament}
          onClose={this.handleTablesClose}
        />
      </div>
    );
  }
}

AddSpeedDial.propTypes = {
  classes: PropTypes.object.isRequired,
  tournament: PropTypes.string.isRequired,
};

export default withRoot(withStyles(styles)(AddSpeedDial));
