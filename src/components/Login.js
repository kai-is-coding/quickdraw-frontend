import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import '../css/Login.css';

export default class Login extends React.Component{
  state = {
    email: '', // TODO: remove in prod!
    password: '',
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

    // axios.post('http://localhost:3001/login', {user}, {withCredentials: true})
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

  render(){
    const {email, password} = this.state

    return (
      <div className="login">
        <h1>Login</h1>
          <div>
            {
              this.state.errors ?
               <span>oophs...something wrong try again!</span>
               :
               null
            }
          </div>
          <form onSubmit={this.handleSubmit}>
            <input placeholder="email" type="text" name="email" value={email} onChange={this.handleChange}/>
            <br/>
            <input placeholder="password" type="password" name="password" value={password} onChange={this.handleChange}/>
            <br/>
            <button placeholder="submit" type="submit" className="submit">Log In</button>
            <div className="or">
             <span>OR |</span> <Link to='/signup' className="signup">Sign Up</Link>
            </div>
          </form>
      </div>
    );
  }

}
