import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import AllTournaments, {
  RefreshTournaments,
} from '../containers/AllTournaments';
import Header from '../components/Header';
import Menu from '../components/Menu';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class Index extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Menu title="Foosball">
          <RefreshTournaments />
        </Menu>
        <Header />
        <AllTournaments />
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
