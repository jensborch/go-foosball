import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Divider } from '@material-ui/core';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
  }

  select() {
    this.props.select(this.props.tournamentId, this.props.tables.uuid);
  }

  deselect() {
    this.props.deselect(this.props.tournamentId, this.props.tables.uuid);
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
                tournament={this.props.tournamentId}
                select={this.props.select}
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
  tournament: PropTypes.string.isRequired,
  deselect: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
};

export default Tables;
