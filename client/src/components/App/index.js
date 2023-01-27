import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import Reviews from '../Reviews';
import Landing from '../Landing';
import PrivateRoute from '../Navigation/PrivateRoute.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //
    };
  }

  componentDidMount() {
    //
  }


  componentWillUnmount() {
    this.listener();
  }


  render() {
    return (
	  <Router>
	    <div>
        <PrivateRoute exact path="/" component={Landing}/>
	    </div>
	  </Router>
    );
  }
}

export default App;