import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Navigation = (props) => {
  const handleClick = () => {
    axios.delete('http://localhost:3001/logout', {withCredentials: true})
    .then(res => {
      props.handleLogout()
      props.history.push('/')
    })
    .catch(err => console.warn('log out errors:', err))
  }
  return(
    <div>
      <nav>
        <h1>Quick Draw</h1>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/signup'>Sign Up</Link>
        <br/><br/>
        {
          props.loggedInStatus ? <Link to='/' onClick={handleClick}>Log Out</Link> : null
        }
      </nav>
    </div>
  );
};
export default Navigation;
