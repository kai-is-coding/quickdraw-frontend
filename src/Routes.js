import React from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Navigation from './components/Navigation';
import Home from './components/Home';
import PlayRooms from './components/PlayRooms';
import Login from './components/Login';
import SignUp from './components/SignUp';
import DrawPage from './components/DrawPage';

export default class Routes extends React.Component {
  // maintain login status data
  state = {
    isLoggedIn: false,
    user: {}
  };

  // call loginStatus() when first load
  componentDidMount(){
    this.loginStatus()
  }

  // data received from backend server
  handleLogin = (data) => {
    this.setState({
      isLoggedIn: true,
      user: data.user
    });
    // console.log(this.state.user);
  }

  handleLogout = () => {
    this.setState({
      isLoggedIn: false,
      user: {}
    })
  }

  loginStatus = () => {
    // withCredentials: true is the key point!!
    // it allows out rails server to set and read the cookie on the front end
    axios.get('http://localhost:3001/logged_in', {withCredentials: true})
    .then(res => {
      if (res.data.logged_in) {
        this.handleLogin(res.data)
      } else {
        this.handleLogout()
      }
    })
    .catch(err => console.warn('api errors:', err));
  }
  render (){
    return (
      <div>
      <Router>
        <h1>Quick Draw</h1>

        <Link to='/'>Home</Link> <br/>
        <Link to='/playrooms'>PlayRooms</Link>
        <Route path="/" render={props => (
            <Navigation
              {...props}
              handleLogout={this.handleLogout}
              loggedInStatus = {this.state.isLoggedIn}
              userDetails = {this.state.user}
            />
        )} />
        <hr/>
        <div>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/playrooms" render={
              props => (<PlayRooms {...props} handleLogin={this.handleLogin} loggedInStatus = {this.state.isLoggedIn}/>)
            }/>
            <Route exact path="/login" render={
              props => (<Login {...props} handleLogin={this.handleLogin} loggedInStatus = {this.state.isLoggedIn}/>)
            }/>
            <Route exact path="/signup" render={
              props => (<SignUp {...props} handleLogin={this.handleLogin} loggedInStatus = {this.state.isLoggedIn}/>)
            }/>
          <Route exact path="/playrooms/:id" render={
              props => (<DrawPage {...props} handleLogin={this.handleLogin} loggedInStatus = {this.state.isLoggedIn}/>)
            }/>
          </Switch>
        </div>
      </Router>
      </div>
    );
  }
}
