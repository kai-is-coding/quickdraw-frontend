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
    .catch(err => console.warn('log out errors:', err));

    // axios.patch(`https://quickdraw-backend.herokuapp.com/users/${props.userDetails.id}`,{playroom_id: null, draw: null }, {withCredentials: true})
    // axios.patch(`http://localhost:3001/users/${props.userDetails.id}`,{playroom_id: null, draw: null }, {withCredentials: true})
    // .then(console.log('user playroom_id and draw deleted!'))
    // .catch(err => console.warn('clear user details errors:', err));
  }
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
