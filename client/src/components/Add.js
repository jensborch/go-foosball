import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import SpeedDial from '@material-ui/lab/SpeedDial';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

const actions = [
  { icon: <PersonIcon />, name: 'Add player' },
  { icon: <AddIcon />, name: 'Add table' },
];

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class Add extends React.Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
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
          {actions.map(action => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={this.handleClick}
            />
          ))}
        </SpeedDial>
      </div>
    );
  }
}

Add.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Add));
