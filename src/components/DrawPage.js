import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../css/DrawPage.css';
import CanvasDraw from 'react-canvas-draw';

import {API_WS_ROOT} from '../constants';
import ActionCable from 'actioncable';




export default class DrawPage extends React.Component{

  state = {
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.5,
    color: '#fff',
    room: null,
    inputMessage: null,
    receivedMessage: null
  };

  componentDidMount(){
    const playroom_id = this.props.match.params.id;

    axios.get(
      `http://localhost:3001/playrooms/${playroom_id}`,{withCredentials: true})
    .then(res => {
      console.log(`you are in room ${playroom_id}`);
      this.setState({room: res.data})
      // console.log(this.state.room);
    })
    .catch(err => console.warn('playroom errors: ', err));

    this.cable = ActionCable.createConsumer(API_WS_ROOT);
    this.draw = this.cable.subscriptions.create(
      {channel: 'DrawsChannel', playroom: `${playroom_id}`},
      {
        connected: () => {
          console.log('DrawsChannel WS CONNECTED!');
        },
        received: (data) => {
          console.log('RECEIVED DrawsChannel DATA', data);
          if (this.loadableCanvas && data.action === "send_line"){
            this.loadableCanvas.clear();
            this.loadableCanvas.simulateDrawingLines({lines: data.lines, immediate: true});
          }
          else if (data.action === "send_message") {
            console.log('receivedMessage:', data.inputMessage);
            this.setState({receivedMessage: data.inputMessage})
          }
        },

        sendLine: function(lines){
          this.perform('send_line', lines);
        },

        sendMessage: function(message){
          this.perform('send_message', message)
        }
      }
    );//this.draw
  }//componentDidMount()

  handleChange = (event) => {
    // window.lines = event.lines;
    // window.canvas = this.saveableCanvas
    console.log('change', event.lines );
    this.draw.sendLine({lines: event.lines});
  }

  clearCanvas = () => {
    this.saveableCanvas.clear();
    this.draw.sendLine({lines: []});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log('message submit:', this.state.inputMessage);
    this.draw.sendMessage({inputMessage: this.state.inputMessage});
  }

  handleMessageChange = (event) => {
    this.setState({inputMessage: event.target.value})
  }


  render(){
    return(
      <div>
      {
        this.props.loggedInStatus
        ?
        this.props.userDetails.draw ?
        <div className='drawPanel-container'>
          <div className='drawPanel-container-top'>
            <h2>Draw here!</h2>
            {
              this.state.receivedMessage?
              <div className='message-from-gusser'>
                {this.state.receivedMessage}
              </div>
              :
              null
            }
            <button onClick={() => {
              this.clearCanvas();
            }}>
            Clear
            </button>
            <button onClick={() => {
              this.saveableCanvas.undo();
            }}>
            Undo
            </button>
          </div>
            <CanvasDraw className='drawPanel'
              onChange={this.handleChange}
              canvasWidth={this.state.width}
              canvasHeight={this.state.height}

              ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
            />

        </div>
        :
        <div>
          <h3>Guess!</h3>
          <CanvasDraw className='drawPanel'
            canvasWidth={this.state.width}
            canvasHeight={this.state.height}
            brushRadius = {0}
            brushColor = {this.state.color}
            catenaryColor = {this.state.color}
            disabled
            ref={canvasDraw => (this.loadableCanvas = canvasDraw)}
          />

        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Type Your Answer Here!" onChange={this.handleMessageChange}/>
          <button type="submit">Answer!</button>
        </form>
        </div>
         :
        <h2>Please <Link to='/login'>Login</Link> to continue draw!</h2>
      }
      </div>
    );
  }
}
