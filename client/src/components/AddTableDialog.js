import React from 'react';
import withRoot from '../withRoot';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { PropTypes } from 'prop-types';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddIcon from '@material-ui/icons/Add';
import { Grid, TextField, Button } from '@material-ui/core';
class AddTableDialog extends React.Component {
  state = {
    name: '',
    rightColor: '',
    leftColor: '',
  };

  handleClose = () => {
    this.props.onClose();
  };

  handleSelect = table => {
    this.props.addTable(this.props.tournament, table);
  };

  handleAdd = () => {
    this.props.onClose();
  };

  componentDidMount() {
    this.props.fetch();
  }

  create = () => {
    this.props.createTable(
      this.state.name,
      this.state.rightColor,
      this.state.leftColor
    );
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
                onClick={() => this.handleSelect(table.uuid)}
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
          <Grid container direction="column">
            <Grid item>
              <TextField
                helperText="Name"
                value={this.state.name}
                onChange={event =>
                  this.setState({
                    name: event.target.value,
                  })
                }
                lable="Name"
              />
            </Grid>
            <Grid item>
              <TextField
                helperText="Right Color"
                value={this.state.rightColor}
                onChange={event =>
                  this.setState({ rightColor: event.target.value })
                }
                lable="Right Color"
              />
            </Grid>
            <Grid item>
              <TextField
                helperText="Left Color"
                value={this.state.leftColor}
                onChange={event =>
                  this.setState({ leftColor: event.target.value })
                }
                lable="Lef Color"
              />
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={this.create}>
                Create
              </Button>
            </Grid>
          </Grid>
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
  fetch: PropTypes.func.isRequired,
};

export default withRoot(AddTableDialog);
