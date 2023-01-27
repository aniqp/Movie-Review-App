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

class SearchMovies extends Component {
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
                        Search Movies
                    </Typography>
                    <br></br>
                    <Typography
                        variant={"h5"}
                        className={classes.mainMessage}
                        align="flex-start"
                    >
                        Search to see reviews for movies and average user scores!
                    </Typography>
                    <React.Fragment>
                        <Search
                            classes={classes}
                        >
                        </Search>
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

SearchMovies.propTypes = {
    classes: PropTypes.object.isRequired
};

const Search = () => {

    const [movieSearchTerm, setMovieSearchTerm] = React.useState('')

    const [actorSearchTerm, setActorSearchTerm] = React.useState('')

    const [directorSearchTerm, setDirectorSearchTerm] = React.useState('')

    const [submitButtonClicked, setSubmitButtonClicked] = React.useState(false)

    const [successfulSubmission, setSuccessfulSubmission] = React.useState(false)

    const [returnedResult, setReturnedResult] = React.useState([])

    const handleMovieSearch = (event) => {
        setMovieSearchTerm(event.target.value)
        setSubmitButtonClicked(false)
    }

    const handleActorSearch = (event) => {
        setActorSearchTerm(event.target.value)
        setSubmitButtonClicked(false)
    }

    const handleDirectorSearch = (event) => {
        setDirectorSearchTerm(event.target.value)
        setSubmitButtonClicked(false)
    }

    const searchDatabase = () => {
        setSubmitButtonClicked(true)
        if ((movieSearchTerm !== null && movieSearchTerm !== '') || (actorSearchTerm !== null && actorSearchTerm !== '') || (directorSearchTerm !== null && directorSearchTerm !== '')) {
            searchMovies()
            setSuccessfulSubmission(true)
            console.log('movieSearchTerm: ' + movieSearchTerm)
            console.log('actorSearchTerm: ' + actorSearchTerm)
            console.log('directorSearchTerm: ' + directorSearchTerm)
        }
        else {
            setSuccessfulSubmission(false)
        }
    }

    const searchMovies = () => {
        callApiSearchMovies()
            .then(res => {
                console.log("callApiGetMovies returned: ", res)
                var parsed = JSON.parse(res.express);
                console.log("callApiGetMovies parsed: ", parsed);
                setReturnedResult(parsed)
                console.log(parsed)
            })
    }

    const callApiSearchMovies = async () => {
        const url = serverURL + '/api/searchMovies';
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //authorization: `Bearer ${this.state.token}`
            },
            body: JSON.stringify({
                movieSearchTerm: movieSearchTerm.toLowerCase(),
                directorSearchTerm: directorSearchTerm.toLowerCase(),
                actorSearchTerm: actorSearchTerm.toLowerCase()
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("Added review: ", body);
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
                                    onClick={() => history.push('/reviews')}
                                >
                                    <Typography variant="h5" align='center' color="inherit" noWrap>
                                        Reviews
                                    </Typography>
                                </Link>
                            </Grid>
                            <Grid item xs={0}>
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
            <SearchBox
                label="Search by Movie Title: "
                onSearch={handleMovieSearch}
                enteredMovieTitle={movieSearchTerm}
            // error={(movieSearchTerm === null || movieSearchTerm === '') & submitButtonClicked === true & successfulSubmission === false}
            />
            <SearchBox
                label="Search by Actor Name: "
                onSearch={handleActorSearch}
                enteredActor={actorSearchTerm}
            // error={(actorSearchTerm === null || actorSearchTerm === '') & submitButtonClicked === true & successfulSubmission === false}
            />
            <SearchBox
                label="Search by Director Name: "
                onSearch={handleDirectorSearch}
                enteredActor={directorSearchTerm}
            // error={(actorSearchTerm === null || actorSearchTerm === '') & submitButtonClicked === true & successfulSubmission === false}
            />
            <Button variant="contained" color="primary" onClick={searchDatabase}>
                Search
            </Button>
            {submitButtonClicked === true & successfulSubmission === false ?
                <>
                    <Alert severity="error">Please enter a search term</Alert>
                </> : <></>
            }
            {successfulSubmission === true ?
                <h1>
                    <u>Search Results:</u>
                </h1> : <></>
            }
            {(returnedResult.length > 0 & successfulSubmission === true) ?
                <>
                    {returnedResult.map(function (movie) {
                        return (
                            <>
                                <Typography variant="h5">Movie Information:</Typography>
                                <br></br>
                                <Typography variant="h6">Movie Title: {movie.movie_title}</Typography>
                                <br></br>
                                <Typography variant="h6">Director Name(s): {movie.director_name}</Typography>
                                <br></br>
                                <Typography variant="h6">Movie Reviews:</Typography>
                                {movie.review_content ?
                                    movie.review_content.split(';;;;;').map(function (review) {
                                        return (<li>{review}</li>)
                                    }) :
                                    <Typography variant="p">
                                        This movie has no reviews.
                                    </Typography>
                                }
                                <br></br>
                                {movie.average_review ?
                                    <Typography variant="h6">Average User Review Score: {movie.average_review} </Typography> :
                                    <>
                                        <br></br>
                                        <Typography variant="h6">This movie has no average review score.</Typography>
                                    </>
                                }
                                <hr></hr>
                                <br></br>
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

export default withStyles(styles)(SearchMovies);