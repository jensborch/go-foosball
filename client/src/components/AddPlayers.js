import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import Players from './Players';
import Modal from 'material-ui';

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  list: {
    flex: 1,
  },
});

class AddPlayers extends React.Component {
  componentWillMount() {
    this.props.fetch(this.props.id);
  }

  render() {
    const { classes } = this.props;
    const { paper, ...childClasses } = classes;
    return (
      <Modal>
        <Players
          classes={childClasses}
          fetch={this.props.fetch}
          select={this.props.select}
          deselect={this.props.deselect}
          data={this.props.data}
          id={this.props.id}
        />
      </Modal>
    );
  }
}

AddPlayers.propTypes = {
  classes: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
};

export default withRoot(withStyles(styles)(AddPlayers));
