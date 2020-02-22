import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class PlayRoom extends React.Component {

  state = {
    rooms: null
  }

  componentDidMount(){
    axios.get(
      'http://localhost:3001/testuser',    {withCredentials: true}
    )
    .then( res => this.setState({ rooms: res.data }) );

  }

  render(){
    return(
      <div>
      {
        this.props.loggedInStatus ? <h2>Select your PlayRoom!</h2> : <h2>Please <Link to='/login'>Login</Link> </h2>
      }
      </div>
    );
  } // render()

}

export default PlayRoom;
