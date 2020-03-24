import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../css/Navigation.css';
import '../index.css';



const Navigation = (props) => {
  const handleClick = () => {
    // axios.delete('http://localhost:3001/logout', {withCredentials: true})
    axios.delete('https://quickdraw-backend.herokuapp.com/logout', {withCredentials: true})
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
          <div className="user">
            <Link to='/login' className="links">Login</Link>
            <Link to='/signup' className="links">Sign Up</Link>
          </div>
          :
          <div className="user">
            <span className="user">{ props.userDetails && props.userDetails.username}</span>
            <Link to='/' onClick={handleClick} className="links">Log Out</Link>
          </div>
        }
      </nav>
    </div>
  );
};
export default Navigation;
