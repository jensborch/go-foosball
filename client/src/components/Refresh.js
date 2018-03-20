import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import Button from 'material-ui/Button';
import RefreshIcon from 'material-ui-icons/Refresh';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class Refresh extends React.Component {
  handleClick = () => {
    this.props.refresh(this.props.id);
  };

  render() {
    const { classes } = this.props;
    return (
      <Button
        onClick={this.handleClick}
        variant="fab"
        color="default"
        aria-label="add"
        className={classes.button}
      >
        <RefreshIcon />
      </Button>
    );
  }
}

Refresh.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default withRoot(withStyles(styles)(Refresh));
