import Avatar from 'material-ui/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';

const styles = theme => ({
  card: {
    maxWidth: 200,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },  
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
});

class Player extends React.Component {
  render() {
    const { classes } = this.props;
    const { data } = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              {data.nickname.substring(0, 2)}
            </Avatar>
          }          
          title={data.nickname}
          subheader={data.realname}
        />
      </Card>
    );
  }
}

class Players extends React.Component {

  componentWillMount() {
    this.props.fetchPlayers(this.props.id);
  }

  render() {
    const { classes } = this.props;
    const { data } = this.props;
    const players = Array.from(data.values());
    return (
      <div className={classes.root}>
        {players.map(p => (
          <Player key={p.nickname} data={p} classes={classes} />
        ))}
      </div>
    );
  }
}

Players.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Players));
