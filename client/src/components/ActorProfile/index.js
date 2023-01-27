import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Box, FormHelperText, TextField, Button } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';
import history from '../Navigation/history';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const serverURL = ""

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

class ActorProfile extends Component {
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
                        className={classes.mainMessage}
                        align="flex-start"
                    >
                        Actor Profiles
                    </Typography>
                    <br></br>
                    <Typography
                        variant={"h5"}
                        className={classes.mainMessage}
                        align="flex-start"
                    >
                        Search actors to view their filmography, and toggle on/off what roles they played in their films!
                    </Typography>
                    <React.Fragment>
                        <Profile
                            classes={classes}
                        >
                        </Profile>
                    </React.Fragment>
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

ActorProfile.propTypes = {
    classes: PropTypes.object.isRequired
};

const Profile = () => {

    const [actorSearchTerm, setActorSearchTerm] = React.useState('')

    const [returnedResult, setReturnedResult] = React.useState([])

    const [submitButtonClicked, setSubmitButtonClicked] = React.useState(false)

    const [successfulSubmission, setSuccessfulSubmission] = React.useState(false)

    const handleActorSearch = (event) => {
        setActorSearchTerm(event.target.value)
        setSubmitButtonClicked(false)
    }

    const searchDatabase = () => {
        setSubmitButtonClicked(true)
        if ((actorSearchTerm !== null && actorSearchTerm !== '' && actorSearchTerm.length >= 3)) {
            searchActors()
            setSuccessfulSubmission(true)
            console.log('actorSearchTerm: ' + actorSearchTerm)
        }
        else {
            setSuccessfulSubmission(false)
        }
    }

    const searchActors = () => {
        callApiSearchActors()
            .then(res => {
                console.log("callApiSearchActors returned: ", res)
                var parsed = JSON.parse(res.express);
                console.log("callApiSearchActors: ", parsed);
                setReturnedResult(parsed)
                console.log(returnedResult)
            })
    }

    const callApiSearchActors = async () => {
        const url = serverURL + '/api/searchActors';
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //authorization: `Bearer ${this.state.token}`
            },
            body: JSON.stringify({
                actorSearchTerm: actorSearchTerm.toLowerCase()
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("Searched actor: ", body);
        return body;
    }

    return (
        <>
            <Box >
                <AppBar color='primary'>
                    <Toolbar>
                        <Grid
                            container spacing={3}
                            direction="row"
                            alignItems="center"
                            wrap = "nowrap"
                        >
                            <Grid item xs={0}>
                                <Link
                                    color="inherit"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => history.push('/')}
                                >
                                    <Typography variant="h5" color="inherit" noWrap>
                                        Landing Page
                                    </Typography>
                                </Link>
                            </Grid>
                            <Grid item xs={0}>
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
                            <Grid item xs={0}>
                                <Link
                                    color="inherit"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => history.push('/reviews')}
                                >
                                    <Typography variant="h5" align='center' color="inherit" noWrap>
                                        Reviews
                                    </Typography>
                                </Link>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Box>
            <SearchBox
                label="Actor Name: "
                onSearch={handleActorSearch}
                enteredActor={actorSearchTerm}
            />
            <Button variant="contained" color="primary" onClick={searchDatabase}>
                Search
            </Button>
            {submitButtonClicked === true & successfulSubmission === false ?
                <>
                    <Alert severity="error">Please enter a search term (3 characters or greater)</Alert>
                </> : <></>
            }
            {successfulSubmission === true ?
                <h1>
                    <u>Actor Profiles:</u>
                </h1> : <></>
            }
            {(returnedResult.length > 0 & successfulSubmission === true) ?
                <>
                    {returnedResult.map(function (actor) {
                        return (
                            <>
                                <Actor
                                    actor={actor}
                                />
                            </>
                        )
                    })}
                </> :
                <></>
            }
        </>
    )
}

const SearchBox = (props) => {
    return (
        <form noValidate autoComplete="off">
            <TextField id="SearchBox" label={props.label} value={props.enteredTitle} onChange={props.onSearch} />
        </form>
    )
}

const Actor = (props) => {

    const [hideRoles, setHideRoles] = React.useState(true)
    const handleToggleRoles = () => {
        if (hideRoles === false) {
            setHideRoles(true)
        }
        else {
            setHideRoles(false)
        }
    }

    return (
        <>
            <Typography variant="h6">{props.actor.actor_name}</Typography>
            {hideRoles === false ?
                <>
                    {props.actor.movie_role.split(';;;;;').map(function (movie_role) {
                        return (<li>{movie_role}</li>)
                    })}
                </>
                : <></>}
            <Button
                onClick={handleToggleRoles}
                color = "secondary"
            >
                {hideRoles === false ? ('Hide Actor Movies/Roles') : ('Show Actor Movies/Roles')}
            </Button>
            <hr></hr>
        </>
    )
}

export default withStyles(styles)(ActorProfile);