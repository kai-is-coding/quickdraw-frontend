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
import './css/Routes.css';

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
    // console.log("CHECKING IF USER LOGGED IN");
    // withCredentials: true is the key point!!
    // it allows out rails server to set and read the cookie on the front end
    // axios.get('https://quickdraw-backend.herokuapp.com/logged_in', {withCredentials: true})
    axios.get('http://localhost:3001/logged_in', {withCredentials: true})
    .then(res => {
      if (res.data.logged_in) {
        this.handleLogin(res.data)
      } else {
        this.handleLogout()
      }
    })
    .catch(err => console.warn("COULDN'T GET USER:", err));
  }
  render (){
    return (
      <div className="content">
      <Router>
        <div className='header'>
          <h1>Quick Draw</h1>
          <div className="routesNav">
            <div className="links">
              <Link to='/' className="navLinks">Home</Link>
              <Link to='/playrooms' className="navLinks">PlayRooms</Link>

            </div>
            <div className="Navigation">
              <Route path="/" render={props => (
                  <Navigation
                    {...props}
                    handleLogout={this.handleLogout}
                    loggedInStatus = {this.state.isLoggedIn}
                    userDetails = {this.state.user}
                    />
                )} />
              </div>
            </div>
        </div>
        <div className='components'>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/playrooms" render={
              props => (<PlayRooms {...props} handleLogin={this.handleLogin} loggedInStatus = {this.state.isLoggedIn}
              userDetails = {this.state.user}/>)
            }/>
            <Route exact path="/login" render={
              props => (<Login {...props} handleLogin={this.handleLogin} loggedInStatus = {this.state.isLoggedIn}/>)
            }/>
            <Route exact path="/signup" render={
              props => (<SignUp {...props} handleLogin={this.handleLogin} loggedInStatus = {this.state.isLoggedIn}/>)
            }/>
            <Route exact path="/playrooms/:id" render={
              props => (<DrawPage {...props} handleLogin={this.handleLogin} loggedInStatus = {this.state.isLoggedIn} userDetails = {this.state.user} /> )
            }/>
          </Switch>
        </div>
      </Router>
      <footer>&copy; Quick Draw By Kai Yang 2020</footer>
      </div>
    );
  }
}
