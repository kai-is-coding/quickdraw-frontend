import React from 'react';
import {Link} from 'react-router-dom';

export default class Login extends React.Component{
  render(){
    return (
      <div>
        <h1>Login In</h1>
        <form>
          <input type='text' placeholder='email' name='email'/>
          <input type='text' placeholder='password' name='password'/>
          <button placeholder='submit' type='submit'>Log In</button>
        </form>

        <div>
          or <Link to='/signup'>Sign Up</Link>
        </div>
      </div>
    );
  }
}
