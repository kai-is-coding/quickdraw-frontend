import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../css/DrawPage.css';
import Sketch from 'react-p5';



export default class DrawPage extends React.Component{
  render(){
    return(
      <div>
      {
        this.props.loggedInStatus
        ?
        <div className='drawPanel'>
          <h2>Draw here!</h2>
        </div>
         :
        <h2>Please <Link to='/login'>Login</Link> to continue draw!</h2>
      }
      </div>
    );
  }
}
