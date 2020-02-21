import React from 'react';
import {Link} from 'react-router-dom';

const Navigation = () => {
  return(
    <div>
      <nav>
        <h1>Quick Draw</h1>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/signin'>Sign Up</Link>
      </nav>
    </div>
  );
};
export default Navigation;
