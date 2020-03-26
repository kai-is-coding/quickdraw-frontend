import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../css/PlayRooms.css';
import '../App.css';
import {API_WS_ROOT} from '../constants';
import ActionCable from 'actioncable';


class PlayRooms extends React.Component {

  state = {
    rooms: null,
    currentUser: null,
    eventValue: null,
    backgroundColor: null,
    pointerEvents: null,
    selected: {
      roomId: null,
      role: null, // drawer or guesser
      index: null,
      // userId: null
    },
    otherSelected: {}
  }


  componentDidMount(){
    // axios.get(`http://localhost:3001/playrooms`,{withCredentials: true})
    axios.get(`https://quickdraw-backend.herokuapp.com/playrooms`,{withCredentials: true})
    .then( res => {
      this.setState({
        rooms: res.data,
        currentUser: this.props.userDetails.id
       });
      // console.log('rooms:',this.state.rooms[0]);
    })
    .catch(err => console.warn('playrooms errors: ', err));

    //generate websocket connection
    this.cable = ActionCable.createConsumer(API_WS_ROOT);
    this.playroom = this.cable.subscriptions.create(
      {channel: 'PlayroomsChannel'},
      {
        connected: () => {
          // console.log('PlayroomsChannel WS CONNECTED!');
        },
        received: (data) => {
          // console.log('websocket received data:', data);
          this.getSelected(data.roomId, data.role, data.index, data.userId);

          if(data.action === 'send_room_selection'){
            if(data.userId === this.state.currentUser){
              return;
            }

            const otherSelected = {...this.state.otherSelected};
            const existingKey = Object.keys(otherSelected).find( k => k.startsWith(`${data.userId}-`) );
            if( existingKey ){
              delete otherSelected[existingKey]; // delete any previous selection!
            }

            const key = `${data.userId}-${data.roomId}-${data.role}-${data.index}`;
            // console.log('new key', key, data);
            otherSelected[key] = true; // set the new selection for this user
            // console.log('new selection', otherSelected);
            this.setState({ otherSelected });
          } // send_room_selection

        },

        sendValues: function(values){
          // console.log('sendValues', values);
          this.perform('send_values', values);
        },

        sendRoomSelectionUpdate: function(data){
          // console.log('sendRoomSelectionUpdate', data);
          this.perform('send_room_selection', data);
        }
      }
    );//this.playroom
  }//componentDidMount()

  handleClick = (id) => {
    // console.log('clicked!')
    this.props.history.push(`/playrooms/${id}`)
  }

  getSelected(roleRoomId, roomRole, roleIndex){

    // We don't know which other user might have selected a room, so we skip the user ID from the key
    // (and now we have to check the end of each key)
    const key = `-${roleRoomId}-${roomRole}-${roleIndex}`;

    const {roomId, role, index} = this.state.selected;
    if( roomId===roleRoomId && role===roomRole && roleIndex===index ){
      return 'pink'; // selected by you
    } else if( Object.keys(this.state.otherSelected).find(k => k.endsWith(key)) ){
      // else if(roomId===roleRoomId && role===roomRole && roleIndex===index && userId !== this.state.currentUser) {
      // Check if the arguments match any of the objects in
      // this.state.otherSelected (use .find())
      return 'orange'; // selected by someone else
    }
    else {
      return 'white';
    }
  }

  drawerSelect = (event, roomId, role, index) => {
    event.persist();
    // const roomId = event.target.value;
    // console.log('drawerSelect', {roomId, role, index});
    this.playroom.sendRoomSelectionUpdate({roomId, role, index, userId: this.state.currentUser});

    axios.patch(`https://quickdraw-backend.herokuapp.com/users/${this.props.userDetails.id}`,{playroom_id: roomId, draw: true }, {withCredentials: true})
    // axios.patch(`http://localhost:3001/users/${this.props.userDetails.id}`,{playroom_id: roomId, draw: true }, {withCredentials: true})
    .then(res => {
      // console.log('update user drawer successfully!');
      this.setState({ selected: {roomId, role, index} });
      // const style = event.target.style;
      // style.backgroundColor = 'blue';
      // style.pointerEvents = 'none';
      // this.playroom.sendValues({
      //   roomId: this.state.selected.roomId,
      //   role: this.state.selected.role,
      //   index: this.state.selected.index,
      //   userId: this.state.selected.userId
      //  })
    })
    .catch(err => console.warn('assign user role errors', err));

  }

  guesserSelect = (event, roomId, role, index, userId) => {
    event.persist();
    // console.log('guesserSelect', {roomId, role, index, userId});

    this.playroom.sendRoomSelectionUpdate({roomId, role, index, userId: this.state.currentUser});

    axios.patch(`https://quickdraw-backend.herokuapp.com/users/${this.props.userDetails.id}`, {playroom_id: roomId, draw: false }, {withCredentials: true})
    // axios.patch(`http://localhost:3001/users/${this.props.userDetails.id}`,{playroom_id: roomId, draw: false }, {withCredentials: true})
    .then(ren => {
      // console.log('update user guesser successfully!');
      this.setState({ selected: {roomId, role, index, userId} });
    })
    .catch(err => console.warn('assign user role errors', err));

  }

  showRooms = () => {
    return(
      <div className='playrooms-container'>
        {this.state.rooms.map(room => {
          return(
            <div key={room.id} className='playrooms'>
              <span className="roomTitle">{room.title}</span><br/>
              <button className='start' onClick={() => this.handleClick(room.id)}>Start Game!</button>
              <div className='drawer-guesser-container'>
                <div className='drawer-container'>
                  <span className="subTitle">Draw?</span>
                  { Array(room.drawer).fill(true).map( (elem, i) => {
                    return(
                      <div
                        key={i}
                        value={room.id}
                        onClick={(e) => this.drawerSelect(e, room.id, 'drawer', i)}
                        className='drawer'
                        style={{ backgroundColor: this.getSelected(room.id, 'drawer', i)}}
                      >
                      </div>
                    );
                  })
                  }
                </div>

                <div className='guesser-container'>
                    <span className="subTitle">Guess?</span>
                  { Array(room.guesser).fill(true).map( (elem, index) => {
                    return(
                      <div key={index} className="guesser"
                        value={room.id}
                        onClick={(e) => this.guesserSelect(e, room.id, 'guesser', index)}
                        style={{ backgroundColor: this.getSelected(room.id, 'guesser', index)}}
                        >

                      </div>
                    );
                  })
                  }
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )
  }



  render(){
    return(
      <div className="container">
      {
        this.props.loggedInStatus
        ?
        <div>
          <h1 className="title">Select Your PlayRoom!</h1>
          {
            this.state.rooms ?
            this.showRooms()
            :
            ''
          }
        </div>
         :
        <div className="message">
          <h2 className='error-message'>Please <Link to='/login' id="loginLink">Login</Link> to select playroom!</h2>
        </div>
      }
      </div>
    );
  } // render()

}

export default PlayRooms;
