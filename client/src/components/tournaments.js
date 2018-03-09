import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: 20,
        justifyContent: 'space-between'
      },
});

class Tournament extends React.Component {
    render() {
        const { classes } = this.props;
        const { data } = this.props
        return (
            <div>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="headline" component="h2">{data.name}</Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

class Tournaments extends React.Component {

    state = {
        tournaments: []
    };

    componentWillMount() {
        this.loadAll();
    }

    loadAll = () => {
        fetch('http://localhost:8080/tournaments/', {
            method: 'GET',
            mode: 'cors'
        })
            .then(response => response.json())
            .then(json => {
                this.setState({ tournaments: json });
            })
            .catch(e => {
                console.error(e);
            });
    }

    render() {
        const { classes } = this.props;
        const tournaments = this.state.tournaments;
        return (
            <div className={classes.root}>
                {tournaments.map((tournament) =>
                    <Tournament key={tournament.uuid} data={tournament} classes={classes} />
                )}
            </div>
        );
    }
}

Tournament.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(Tournaments));
