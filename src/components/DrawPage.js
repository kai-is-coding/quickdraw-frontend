import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../css/DrawPage.css';
// import Sketch from 'react-p5';
import CanvasDraw from 'react-canvas-draw';



export default class DrawPage extends React.Component{

  state = {
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.5
  };
  handleChange = (event) => {
    console.log('change', event.lines);
  }
  //
  // resizeDrawPanel = () => {
  //   const width = window.innerWidth * 0.8;
  //   const height = window.innerHeight * 0.5;
  //   this.setState({width: width, height: height})
  // }

  render(){
    return(
      <div>
      {
        this.props.loggedInStatus
        ?
        <div className='drawPanel-container'>
          <div className='drawPanel-container-top'>
            <h2>Draw here!</h2>

            <button onClick={() => {
              this.saveableCanvas.clear();
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
        <h2>Please <Link to='/login'>Login</Link> to continue draw!</h2>
      }
      </div>
    );
  }
}
