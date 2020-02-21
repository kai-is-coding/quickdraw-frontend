import React from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';

const Routes = (
  <div>
  <Router>
  <Navigation/>
    <div>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/login" component={Login}></Route>
      <Route exact path="signup" component={SignUp}></Route>
    </div>
  </Router>
  </div>
);
export default Routes;
