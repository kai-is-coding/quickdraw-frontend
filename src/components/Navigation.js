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

  // console.log(props);

  return(
    <div>
      <nav>
        {
          !props.loggedInStatus
          ?
          <div>
            <Link to='/login'>Login</Link>
            <br/>
            <Link to='/signup'>Sign Up</Link>
          </div>
          :
          <div>
            <h2>{ props.userDetails && props.userDetails.username}</h2>
            <Link to='/' onClick={handleClick}>Log Out</Link>
          </div>
        }
      </nav>
    </div>
  );
};
export default Navigation;
