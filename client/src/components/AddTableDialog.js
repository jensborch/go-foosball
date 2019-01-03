import React from 'react';
import withRoot from '../withRoot';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { PropTypes } from 'prop-types';

class AddTableDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };
  render() {
    const { tables, ...other } = this.props;
    return (
      <Dialog onClose={this.handleClose} {...other}>
        <DialogTitle>Add table</DialogTitle>
        <div>
          <List>
            {tables.map(table => (
              <ListItem
                button
                key={table.name}
                onClick={() => this.handleListItemClick(table.name)}
              >
                <ListItemText primary={table.name} />
              </ListItem>
            ))}
            <ListItem
              button
              onClick={() => this.handleListItemClick('addAccount')}
            >
              <ListItemText primary="new table" />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }
}

AddTableDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  selectedValue: PropTypes.string,
  tables: PropTypes.array.isRequired,
};

export default withRoot(AddTableDialog);
