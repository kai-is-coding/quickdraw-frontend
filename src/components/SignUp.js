import React from 'react';

export default class SignUp extends React.Component{
  render(){
    return (
      <div>
        <h1>Sign Up</h1>
        <form>
          <input type='text' placeholder='username' name='username'/>
          <input type='text' placeholder='email' name='email'/>
          <input type='password' placeholder='password' name='password'/>
          <input type='password' placeholder='password confirmation' name='password_confirmation'/>
          <button placeholder='submit' type='submit'>Sign Up</button>
        </form>
      </div>
    );
  }
}
