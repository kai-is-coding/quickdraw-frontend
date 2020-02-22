import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Home = (props) => {
  const handleClick = () => {
    axios.delete('http://localhost:3001/logout', {withCredentials: true})
    .then(res => {
      props.handleLogout()
      props.history.push('/')
    })
    .catch(err => console.warn('log out errors:', err))
  };
  return(
    <div>
      <nav>
        <h1>Quick Draw</h1>
        {
          // (!props.loggedInStatus)
          // ?
          <div>
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Sign Up</Link>
          </div>
          // :
          // <h2>{ props.userDetails.username}</h2>
        }

        {
          props.loggedInStatus ? <Link to='/' onClick={handleClick}>Log Out</Link> : null
        }
      </nav>
    </div>
  );
};
export default Home;
