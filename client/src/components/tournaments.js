import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';

const styles = theme => ({
    card: {
        minWidth: 275,
    }
});

class Tournament extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        const { tournament } = this.props
        return (
            <div>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="headline" component="h2">{tournament.uuid}</Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }

}


class Tournaments extends React.Component {

    state = {
        tournaments: {}
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
                this.setState({ tournaments: { ...this.state.tournaments, [json.uuid]: json } });
            })
            .catch(e => {
                // console.error(e);
            });
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

Tournaments.propTypes = {
    classes: PropTypes.object.isRequired,
};

Tournament.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Tournaments));
