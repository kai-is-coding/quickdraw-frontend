import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import '../css/PlayRooms.css';
import '../App.css';

class PlayRooms extends React.Component {

  state = {
    rooms: null
  }

  componentDidMount(){
    axios.get(
      `http://localhost:3001/playrooms`,{withCredentials: true})
    .then( res => {
      this.setState({ rooms: res.data });
      console.log('rooms:',this.state.rooms[0]);
    })
    .catch(err => console.warn('playrooms errors: ', err));
  }

  handleClick = (id) => {
    console.log('clicked!')
    this.props.history.push(`/playrooms/${id}`)
  }

  showRooms = () => {
    return(
      <div className='playrooms-container'>
        {this.state.rooms.map(room => {
          return(
            <div key={room.id} className='playrooms'>
              {room.title}
              { room.users ?
                <div className='users-container'>
                  {room.users.map(user => {
                    return (
                      <div key={user.id} className='users'>
                        {user.username}
                      </div>
                    )
                  })}
                </div> :
                null
              }
              <button className='start' onClick={() => this.handleClick(room.id)}>Start Game!</button>

            </div>
          );
        })}
      </div>
    )
  }



  render(){
    return(
      <div>
      {
        this.props.loggedInStatus
        ?
        <div>
          <h1>Select your PlayRoom!</h1>
          {
            this.state.rooms ?
            this.showRooms()
            :
            null
          }
        </div>
         :
        <div className="message">
          <h2>Please <Link to='/login' id="loginLink">Login</Link> to select playroom!</h2>
          <Home/>
        </div>
      }
      </div>
    );
  } // render()

}

export default PlayRooms;
