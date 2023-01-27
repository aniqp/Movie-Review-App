import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Box } from '@material-ui/core'
import Link from '@material-ui/core/Link';
import history from '../Navigation/history';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const fetch = require("node-fetch");

const opacityValue = 0.9;

const theme = createTheme({
    palette: {
        type: 'dark',
        background: {
            default: "#000000"
        },
        primary: {
            main: "#52f1ff",
        },
        secondary: {
            main: "#b552f7",
        },
    },
});

const styles = theme => ({
    root: {
        body: {
            backgroundColor: "#000000",
            opacity: opacityValue,
            overflow: "hidden",
        },
    },
    mainMessage: {
        opacity: opacityValue,
    },

    mainMessageContainer: {
        marginTop: "20vh",
        marginLeft: theme.spacing(20),
        [theme.breakpoints.down('xs')]: {
            marginLeft: theme.spacing(4),
        },
    },
    paper: {
        overflow: "hidden",
    },
    message: {
        opacity: opacityValue,
        maxWidth: 250,
        paddingBottom: theme.spacing(2),
    },
});

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: 1,
            mode: 0
        }
    };


    render() {

        const { classes } = this.props;

        const mainMessage = (
            <Grid
                container
                spacing={0}
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                style={{ minHeight: '100vh' }}
                className={classes.mainMessageContainer}
            >
                <Grid item>

                    <Typography
                        variant={"h3"}
import 
className={classes.mainMessage}
                        align="flex-start"
                    >
                        Welcome to my Movie Review Site!
                        <React.Fragment>
                            <LandingPage
                                classes={classes}
                            >
                            </LandingPage>
                        </React.Fragment>
                    </Typography>

                    <br></br>
                    <Typography
                        variant={"h6"}
                    >
                        Here, you'll be able to review some of the world's most famous movies, and see how fellow users are rating these films as well. Enjoy!
                    </Typography>
                </Grid>
            </Grid>
        )


        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>
                    <CssBaseline />
                    <Paper
                        className={classes.paper}
                    >
                        {mainMessage}
                    </Paper>

                </div>
            </MuiThemeProvider>
        );
    }
}

Landing.propTypes = {
    classes: PropTypes.object.isRequired
};

const LandingPage = () => {

    return (
        <Box >
            <AppBar color='primary'>
                <Toolbar>
                    <Grid
                        container spacing={3}
                        direction="row"
                        alignItems="center"
                    >
                        <Grid item xs = {0}>
                            <Link
                                color="inherit"
                                style={{ cursor: "pointer" }}
                                onClick={() => history.push('/search')}
                            >
                                <Typography variant="h5" align='center' color="inherit" noWrap>
                                    Search
                                </Typography>
                            </Link>
                        </Grid>
                        <Grid item xs = {0}>
                            <Link
                                color="inherit"
                                style={{ cursor: "pointer" }}
                                onClick={() => history.push('/reviews')}
                            >
                                <Typography variant="h5" color="inherit" noWrap>
                                    Review
                                </Typography>
                            </Link>
                        </Grid>
                        <Grid item xs = {0}>
                            <Link
                                color="inherit"
                                style={{ cursor: "pointer" }}
                                onClick={() => history.push('/actor-profiles')}
                            >
                                <Typography variant="h5" color="inherit" noWrap>
                                    Actor Profiles
                                </Typography>
                            </Link>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default withStyles(styles)(Landing);