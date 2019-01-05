import React from 'react';
import withRoot from '../withRoot';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { PropTypes } from 'prop-types';
import { Divider } from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddIcon from '@material-ui/icons/Add';
class AddTableDialog extends React.Component {
  handleClose = () => {
    this.props.onClose();
  };

  handleSelect = table => {
    this.props.addTable(this.props.tournament, table);
    this.props.onClose();
  };

  handleAdd = () => {
    this.props.onClose();
  };

  render() {
    const { tables, open } = this.props;
    return (
      <Dialog onClose={this.handleClose} open={open}>
        <DialogTitle>Add table</DialogTitle>
        <div>
          <List>
            {tables.map(table => (
              <ListItem
                button
                key={table.name}
                onClick={() => this.handleSelect(table.name)}
              >
                <ListItemText primary={table.name} />
              </ListItem>
            ))}
            {tables.length > 0 && <Divider />}
            <ListItem button onClick={() => this.handleAdd()}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="New table" />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }
}

AddTableDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  addTable: PropTypes.func.isRequired,
  tables: PropTypes.array.isRequired,
  tournament: PropTypes.string.isRequired,
};

export default withRoot(AddTableDialog);
