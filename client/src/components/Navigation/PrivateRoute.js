import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import Reviews from '../Reviews';
import history from './history';
import Landing from '../Landing';
import Search from '../Search'
import ActorProfile from '../ActorProfile'

export default function PrivateRoute({
  //authenticated,
  //...rest
}) {
  return (

    <Router history={history}>
      <Switch>
      <Route path="/reviews" exact component={Reviews} />
      <Route path= "/" exact component = {Landing} />
      <Route path = "/search" exact component = {Search} />
      <Route path = "/actor-profiles" exact component = {ActorProfile} />
      </Switch>
    </Router>
  );
}