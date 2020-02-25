import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

export default class Login extends React.Component{
  state = {
    email: 'test1@ga.co', // TODO: remove in prod!
    password: 'chicken',
    errors: ''
  };

  handleChange = (event) => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    let user = {
      email: this.state.email,
      password: this.state.password
    }

    axios.post('https://quickdraw-backend.herokuapp.com/login', {user}, {withCredentials: true})
    .then(res => {
      if (res.data.logged_in) {
        console.log(res.data)
        this.props.handleLogin(res.data)
        this.redirect()
      } else {
        this.setState({
          errors: res.data.errors
        })
      }
    })
    .catch(err => console.warn('login errors:', err));
  }

  redirect = () => {
    this.props.history.push('/playrooms')
  }

  handleErrors = () => {
    return(
      <div>
        <ul>
          {this.state.errors.map(err => {
            return <li key={err}>{err}</li>
          })}
        </ul>
      </div>
    )
  }

  render(){
    const {username, email, password} = this.state
    return (
      <div>
        <h1>Login</h1>
          <form onSubmit={this.handleSubmit}>
            <input placeholder="email" type="text" name="email" defaultValue="test1@ga.co" onChange={this.handleChange}/>
            <input placeholder="password" type="password" name="password" defaultValue="chicken" onChange={this.handleChange}/>
            <button placeholder="submit" type="submit">Log In</button>
            <div>
             or <Link to='/signup'>sign up</Link>
            </div>
          </form>
          <div>
            {
              this.state.errors ? this.handleErrors() : null
            }
          </div>
      </div>
    );
  }
}
