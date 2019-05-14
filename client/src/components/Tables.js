import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Divider, ListItemSecondaryAction, Chip } from '@material-ui/core';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.deselect = this.deselect.bind(this);
  }

  deselect() {
    this.props.deselect(this.props.tournamentId, this.props.table.uuid);
  }

  render() {
    const { classes } = this.props;
    const { table } = this.props;
    return (
      <ListItem>
        <Avatar className={classes.avatar}>{table.name.substring(0, 2)}</Avatar>
        <ListItemText primary={table.name} secondary="Name" />
        <ListItemText primary={table.color.right} secondary="Right color" />
        <ListItemText primary={table.color.left} secondary="Left color" />
        <ListItemSecondaryAction>
          <Chip
            label="Remove"
            className={classes.chip}
            onClick={this.deselect}
          />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

class Tables extends React.Component {
  componentDidMount() {
    this.props.fetch(this.props.tournamentId);
  }

  render() {
    const { classes } = this.props;
    const { tables } = this.props;
    return (
      <List className={classes.list}>
        {tables &&
          tables.map((p, i) => (
            <div key={p.uuid}>
              <Table
                table={p}
                tournamentId={this.props.tournamentId}
                deselect={this.props.deselect}
                classes={classes}
              />
              {i !== tables.length - 1 ? (
                <li>
                  <Divider variant="inset" />
                </li>
              ) : null}
            </div>
          ))}
      </List>
    );
  }
}

Tables.propTypes = {
  classes: PropTypes.object.isRequired,
  tables: PropTypes.array.isRequired,
  tournamentId: PropTypes.string.isRequired,
  fetch: PropTypes.func,
};

Table.propTypes = {
  classes: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
  tournamentId: PropTypes.string.isRequired,
  deselect: PropTypes.func.isRequired,
};

export default Tables;
