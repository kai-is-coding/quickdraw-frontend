import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../css/DrawPage.css';
// import Sketch from 'react-p5';
import CanvasDraw from 'react-canvas-draw';

// import {ActionCableConsumer} from 'react-actioncable-provider';

import {API_WS_ROOT} from '../constants';
import ActionCable from 'actioncable';




export default class DrawPage extends React.Component{

  state = {
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.5,
    color: '#fff',
    room: null
  };

  componentDidMount(){
    const playroom_id = this.props.match.params.id;
    // const id = this.props.params.match;

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
      {channel: 'DrawsChannel'},
      {
        connected: () => {
          console.log('WS CONNECTED!');
        },
        received: (data) => {
          console.log('RECEIVED DATA', data);
          if (this.loadableCanvas && data.line){
            this.loadableCanvas.clear();
            this.loadableCanvas.simulateDrawingLines({lines: data.line.lines, immediate: true});
          }
        },
        sendLine: function(lines){
          console.log('BEFORE STRINGIFY', lines);
          this.perform('send_line', lines);
        }
      }
    );
  }

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
        </div>
         :
        <h2>Please <Link to='/login'>Login</Link> to continue draw!</h2>
      }
      </div>
    );
  }
}
