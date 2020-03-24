import React from 'react';
import axios from 'axios';
import '../css/SignUp.css';


export default class SignUp extends React.Component{
  state = {
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
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
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation
    }

    // axios.post('http://localhost:3001/users', {user}, {withCredentials: true})
    axios.post('https://quickdraw-backend.herokuapp.com/users', {user}, {withCredentials: true})
    .then(res => {
      if (res.data.status === 'created') {
        this.props.handleLogin(res.data)
        this.redirect()
      } else {
        this.setState({
          errors: res.data.errors
        })
      }
    })
    .catch(err => console.warn('signup errors:', err));
  }

  redirect = () => {
    this.props.history.push('/playrooms')
  }

  render(){
    const {username, email, password, password_confirmation} = this.state

    return (
      <div className='sign'>
        <h1>Sign Up</h1>
          <div>
            {
              this.state.errors ?
               <span>oophs...something wrong try again!</span>
               :
               null
            }
          </div>
          <form onSubmit={this.handleSubmit}>
            <input placeholder="username" type="text" name="username" value={username} onChange={this.handleChange}/>
            <br/>
            <input placeholder="email" type="text" name="email" value={email} onChange={this.handleChange}/>
            <br/>
            <input placeholder="password" type="password" name="password" value={password} onChange={this.handleChange}/>
            <br/>
            <input placeholder="password confirmation" type="password" name="password_confirmation" value={password_confirmation} onChange={this.handleChange}/>
            <br/>
            <button placeholder="submit" type="submit" className="submit">Sign Up</button>
          </form>
      </div>
    );
  }
}
