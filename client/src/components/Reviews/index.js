import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { TextField, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Button, FormHelperText, Box } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';
import history from '../Navigation/history';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";


//Dev mode
const serverURL = ""

//Deployment mode instructions
//const serverURL = "http://ov-research-4.uwaterloo.ca:PORT"; //enable for deployed mode; Change PORT to the port number given to you;
//To find your port number: 
//ssh to ov-research-4.uwaterloo.ca and run the following command: 
//env | grep "PORT"
//copy the number only and paste it in the serverURL in place of PORT, e.g.: const serverURL = "http://ov-research-4.uwaterloo.ca:3000";

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

const MovieReviews = () => {

  return (
    <Box>
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
                onClick={() => history.push('/search')}
              >
                <Typography variant="h5" color="inherit" noWrap>
                  Search
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
    </Box >
  )

}

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: 1,
      mode: 0
    }
  };

  componentDidMount() {
    //this.loadUserSettings();
  }


  loadUserSettings() {
    this.callApiLoadUserSettings()
      .then(res => {
        //console.log("loadUserSettings returned: ", res)
        var parsed = JSON.parse(res.express);
        console.log("loadUserSettings parsed: ", parsed[0].mode)
        this.setState({ mode: parsed[0].mode });
      });
  }

  callApiLoadUserSettings = async () => {
    const url = serverURL + "/api/loadUserSettings";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({
        userID: this.state.userID
      })
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("User settings: ", body);
    return body;
  }

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
            <React.Fragment>
              <Review
                classes={classes}
              >
              </Review>
            </React.Fragment>
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

Reviews.propTypes = {
  classes: PropTypes.object.isRequired
};

const Review = () => {

  class Review {
    constructor(movie, reviewTitle, reviewBody, rating) {
      this.movie = movie
      this.reviewTitle = reviewTitle
      this.reviewBody = reviewBody
      this.rating = rating
    }
  }

  const [selectedMovie, setSelectedMovie] = React.useState(null)

  const [enteredTitle, setEnteredTitle] = React.useState(null)

  const [enteredReview, setEnteredReview] = React.useState(null)

  const [selectedRating, setSelectedRating] = React.useState(null)

  const [submitButtonClicked, setSubmitButtonClicked] = React.useState(false)

  const [userSubmissions, setUserSubmissions] = React.useState([])

  const [successfulSubmission, setSuccessfulSubmission] = React.useState(true)

  const [movies, setMovies] = React.useState([])

  const [userID, setUserID] = React.useState(1)

  const handleMovieSelection = (event) => {
    setSelectedMovie(event.target.value)
    setSubmitButtonClicked(false)
  }

  const handleTitleSelection = (event) => {
    setEnteredTitle(event.target.value)
    setSubmitButtonClicked(false)
  }

  const handleReviewSelection = (event) => {
    setEnteredReview(event.target.value)
    setSubmitButtonClicked(false)
  }

  const handleRatingSelection = (event) => {
    setSelectedRating(event.target.value)
    setSubmitButtonClicked(false)
  }

  const getIdFromMovieTitle = (title) => {
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].name === title) {
        return movies[i].id
      }
    }
  }

  const handleEmptySelections = (event) => {
    setSubmitButtonClicked(true)

    if ((selectedMovie !== null && selectedMovie !== '') & (enteredTitle !== null && enteredTitle !== '') & (enteredReview !== null && enteredReview !== '') & (selectedRating !== null && selectedRating !== '')) {
      const review = new Review(selectedMovie, enteredTitle, enteredReview, selectedRating)
      const tempUserSubmissions = [...userSubmissions]
      tempUserSubmissions.push(review)
      setUserSubmissions(tempUserSubmissions)
      setSuccessfulSubmission(true)

      const fullReview = {
        reviewTitle: enteredTitle,
        reviewContent: enteredReview,
        reviewScore: selectedRating,
        userID: userID,
        movieID: getIdFromMovieTitle(selectedMovie)
      }

      setSelectedMovie('')
      setEnteredTitle('')
      setEnteredReview('')
      setSelectedRating('')

      addReview(fullReview)
    }
    else {
      setSuccessfulSubmission(false)
    }

  }

  React.useEffect(() => {
    getMovies();
  }, []);

  const getMovies = () => {
    callApiGetMovies()
      .then(res => {
        console.log("callApiGetMovies returned: ", res)
        var parsed = JSON.parse(res.express);
        console.log("callApiGetMovies parsed: ", parsed);
        setMovies(parsed);
      })
  }

  const callApiGetMovies = async () => {
    const url = serverURL + '/api/getMovies';
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("Received movies: ", body);
    return body;
  }

  const addReview = (fullReview) => {
    callApiAddReview(fullReview)
      .then(res => {
        console.log("Was it successful: ", res)
      })
  }

  const callApiAddReview = async (fullReview) => {

    const url = serverURL + '/api/addReview';
    console.log(url);
    console.log(fullReview)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({
        fullReview: fullReview
      })
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("Added review: ", body);
    return body;
  }

  let reviewCount = 0

  return (

    <>
      <MovieReviews />
      <Grid
        container
        direction="column"
        justifyContent="center"
        wrap = "nowrap"
      // alignItems="center"
      >
        <Typography variant="h3"
        >
          Review a Movie
        </Typography>

        <MovieSelection
          label={"Select a movie"}
          onSelectMovie={handleMovieSelection}
          selectedMovie={selectedMovie}
          submitButtonClicked={submitButtonClicked}
          error={(selectedMovie === null || selectedMovie === '') & submitButtonClicked === true & successfulSubmission === false}
          movies={movies}
        />

        <ReviewTitle
          label={"Add a review title"}
          onEnterTitle={handleTitleSelection}
          enteredTitle={enteredTitle}
          submitButtonClicked={submitButtonClicked}
          error={(enteredTitle === null || enteredTitle === '') & submitButtonClicked === true & successfulSubmission === false}
        />

        <ReviewBody
          label={"Enter a review"}
          onEnterReview={handleReviewSelection}
          enteredReview={enteredReview}
          submitButtonClicked={submitButtonClicked}
          error={(enteredReview === null || enteredReview === '') & submitButtonClicked === true & successfulSubmission === false}
        />

        <ReviewRating
          label={"Select a rating"}
          onSelectRating={handleRatingSelection}
          selectedRating={selectedRating}
          submitButtonClicked={submitButtonClicked}
          error={(selectedRating === null || selectedRating === '') & submitButtonClicked === true & successfulSubmission === false}
        />

        <Button variant="contained" color="primary" onClick={handleEmptySelections}>
          Submit review
        </Button>
      </Grid>
        {userSubmissions.length > 0 & submitButtonClicked === true & successfulSubmission === true ?
          <>
            <Alert severity="success">Your review has been received</Alert>
            {Array.from(userSubmissions).map(function (review) {
              { reviewCount = reviewCount + 1 }
              return (<>
                <Box pt={2}>
                  <Typography variant="h6" >Review #{reviewCount}:</Typography>
                  <Typography>
                    The movie you selected was: {review.movie}
                  </Typography>
                  <Typography>
                    Your review title is: {review.reviewTitle}
                  </Typography>
                  <Typography>
                    Your review is: {review.reviewBody}
                  </Typography>
                  <Typography>
                    You rated the movie: {review.rating}
                  </Typography>
                </Box>
              </>)
            })}
          </> : <></>
        }
    </>
  )
}

const MovieSelection = (props) => {
  return (
    <>
      <InputLabel id="Movies">{props.label}</InputLabel>
      <Select labelId="selectMovie" id="select" value={props.selectedMovie} onChange={props.onSelectMovie} error={props.error}>
        {props.movies.map(movie => {
          return (
            <MenuItem key={movie.name} value={movie.name}>
              {movie.name}
            </MenuItem>
          )
        })}
      </Select>
      {props.error ?
        <FormHelperText>Please select a movie</FormHelperText> : <></>
      }
    </>
  )
}

const ReviewTitle = (props) => {
  return (
    <form noValidate autoComplete="off">
      <TextField id="ReviewTitle" label={props.label} value={props.enteredTitle} onChange={props.onEnterTitle} error={props.error} />
      {props.error ?
        <FormHelperText>Please enter your review title</FormHelperText> : <></>
      }
    </form>
  )
}

const ReviewBody = (props) => {
  return (
    <form noValidate autoComplete="off">
      <TextField id="ReviewBody" label={props.label} multiline={true} inputProps={{ maxLength: 200 }} size="medium" value={props.enteredReview} onChange={props.onEnterReview} error={props.error} />
      {props.error ?
        <FormHelperText>Please enter your review</FormHelperText> : <></>
      }
    </form>
  )
}

const ReviewRating = (props) => {
  return (
    <>
      <FormControl error={props.error}>
        <FormLabel id="demo-radio-buttons-group-label">{props.label}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue=""
          name="ratings-radio-buttons-group"
          onChange={props.onSelectRating}
          value={props.selectedRating}
          row
        >
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
          <FormControlLabel value="3" control={<Radio />} label="3" />
          <FormControlLabel value="4" control={<Radio />} label="4" />
          <FormControlLabel value="5" control={<Radio />} label="5" />
        </RadioGroup>
      </FormControl>
      {props.error ?
        <FormHelperText>Please select the rating</FormHelperText> : <></>
      }
    </>
  )
}

export default withStyles(styles)(Reviews);
