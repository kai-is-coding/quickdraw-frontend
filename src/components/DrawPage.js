import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../css/DrawPage.css';
import '../App.css';
import clear from '../image/clear.png';
import undo from '../image/undo.png';

import CanvasDraw from 'react-canvas-draw';
import Loadingpage from './Loadingpage';
import {API_WS_ROOT} from '../constants';
import ActionCable from 'actioncable';




export default class DrawPage extends React.Component{

  state = {
    width: window.innerWidth * 0.6,
    height: window.innerHeight * 0.5,
    color: '#fff',
    room: null,
    inputMessage: null,
    receivedMessage: null,
    // currentWord: null,
    // receivedCurrentWord: null,
    seconds: 30,
    receivedSeconds: 30
  };
  // inital values
  // give empty word container
  wordsArray = [];
  currentWord = null;
  receivedCurrentWord = null;

  //get current playroom details when the page first load.
  // create websocket channel, send and receive data through actioncable.
  componentDidMount(){
    const playroom_id = this.props.match.params.id;

    axios.get(
      // `http://localhost:3001/playrooms/${playroom_id}`,{withCredentials: true})
      `https://quickdraw-backend.herokuapp.com/playrooms/${playroom_id}`,{withCredentials: true})
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
          // console.log(data);
          if (this.loadableCanvas && data.action === "send_line"){
            // console.log('RECEIVED lines:', data.lines);
            this.loadableCanvas.clear();
            this.loadableCanvas.simulateDrawingLines({lines: data.lines, immediate: true});
          }
          else if (data.action === "send_message") {
            // console.log('receivedMessage:', data.inputMessage);
            this.setState({receivedMessage: data.inputMessage})
            // this.receivedMessage = data.inputMessage;
          }
          else if (data.action === "send_time") {
            // console.log('receivedTime:', data.time);
            this.setState({receivedSeconds: data.time});
          }
          else if (data.action === "send_word") {
            // this.setState({receivedCurrentWord: data.word});
            this.receivedCurrentWord = data.word
            console.log('receivedCurrentWord:', this.receivedCurrentWord);
          }
        },

        sendLine: function(lines){
          this.perform('send_line', lines);
        },

        sendMessage: function(message){
          this.perform('send_message', message);
        },

        sendTime: function(time){
          this.perform('send_time', time);
        },

        sendWord: function(word){
          this.perform('send_word', word);
        }
      }
    );//this.draw
  }//componentDidMount()

  // handle draw lines change
  handleChange = (event) => {
    // window.lines = event.lines;
    // window.canvas = this.saveableCanvas
    // console.log('change', event.lines );
    this.draw.sendLine({lines: event.lines});
  }

  //clear canvas and send empty array to websocket to clear the canvas on the other client side.
  clearCanvas = () => {
    this.saveableCanvas.clear();
    this.draw.sendLine({lines: []});
  }

  //handle answer submit.
  handleSubmit = (event) => {
    event.preventDefault();
    // console.log('message submit:', this.state.inputMessage);
    this.draw.sendMessage({inputMessage: this.state.inputMessage});
  }

  // handle answer input change
  handleMessageChange = (event) => {
    this.setState({inputMessage: event.target.value})
  }


  // generateRandomWords and display
  generateRandomWords = () => {
    // wwords container
    const words = ['aircraft carrier', 'airplane', 'alarm clock', 'ambulance', 'angel',
    'animal migration', 'ant', 'anvil', 'apple', 'arm', 'asparagus', 'axe',
    'backpack', 'banana', 'bandage', 'barn', 'baseball', 'baseball bat', 'basket',
    'basketball', 'bat', 'bathtub', 'beach', 'bear', 'beard', 'bed', 'bee',
    'belt', 'bench', 'bicycle', 'binoculars', 'bird', 'birthday cake',
    'blackberry', 'blueberry', 'book', 'boomerang', 'bottlecap', 'bowtie',
    'bracelet', 'brain', 'bread', 'bridge', 'broccoli', 'broom', 'bucket',
    'bulldozer', 'bus', 'bush', 'butterfly', 'cactus', 'cake', 'calculator',
    'calendar', 'camel', 'camera', 'camouflage', 'campfire', 'candle', 'cannon',
    'canoe', 'car', 'carrot', 'castle', 'cat', 'ceiling fan', 'cello',
    'cell phone', 'chair', 'chandelier', 'church', 'circle', 'clarinet', 'clock',
    'cloud', 'coffee cup', 'compass', 'computer', 'cookie', 'cooler', 'couch',
    'cow', 'crab', 'crayon', 'crocodile', 'crown', 'cruise ship', 'cup',
    'diamond', 'dishwasher', 'diving board', 'dog', 'dolphin', 'donut', 'door',
    'dragon', 'dresser', 'drill', 'drums', 'duck', 'dumbbell', 'ear', 'elbow',
    'elephant', 'envelope', 'eraser', 'eye', 'eyeglasses', 'face', 'fan',
    'feather', 'fence', 'finger', 'fire hydrant', 'fireplace', 'firetruck',
    'fish', 'flamingo', 'flashlight', 'flip flops', 'floor lamp', 'flower',
    'flying saucer', 'foot', 'fork', 'frog', 'frying pan', 'garden',
    'garden hose', 'giraffe', 'goatee', 'golf club', 'grapes', 'grass', 'guitar',
    'hamburger', 'hammer', 'hand', 'harp', 'hat', 'headphones', 'hedgehog',
    'helicopter', 'helmet', 'hexagon', 'hockey puck', 'hockey stick', 'horse',
    'hospital', 'hot air balloon', 'hot dog', 'hot tub', 'hourglass', 'house',
    'house plant', 'hurricane', 'ice cream', 'jacket', 'jail', 'kangaroo', 'key',
    'keyboard', 'knee', 'knife', 'ladder', 'lantern', 'laptop', 'leaf', 'leg',
    'light bulb', 'lighter', 'lighthouse', 'lightning', 'line', 'lion',
    'lipstick', 'lobster', 'lollipop', 'mailbox', 'map', 'marker', 'matches',
    'megaphone', 'mermaid', 'microphone', 'microwave', 'monkey', 'moon',
    'mosquito', 'motorbike', 'mountain', 'mouse', 'moustache', 'mouth', 'mug',
    'mushroom', 'nail', 'necklace', 'nose', 'ocean', 'octagon', 'octopus',
    'onion', 'oven', 'owl', 'paintbrush', 'paint can', 'palm tree', 'panda',
    'pants', 'paper clip', 'parachute', 'parrot', 'passport', 'peanut', 'pear',
    'peas', 'pencil', 'penguin', 'piano', 'pickup truck', 'picture frame', 'pig',
    'pillow', 'pineapple', 'pizza', 'pliers', 'police car', 'pond', 'pool',
    'popsicle', 'postcard', 'potato', 'power outlet', 'purse', 'rabbit',
    'raccoon', 'radio', 'rain', 'rainbow', 'rake', 'remote control', 'rhinoceros',
    'rifle', 'river', 'roller coaster', 'rollerskates', 'sailboat', 'sandwich',
    'saw', 'saxophone', 'school bus', 'scissors', 'scorpion', 'screwdriver',
    'sea turtle', 'see saw', 'shark', 'sheep', 'shoe', 'shorts', 'shovel', 'sink',
    'skateboard', 'skull', 'skyscraper', 'sleeping bag', 'smiley face', 'snail',
    'snake', 'snorkel', 'snowflake', 'snowman', 'soccer ball', 'sock',
    'speedboat', 'spider', 'spoon', 'spreadsheet', 'square', 'squiggle',
    'squirrel', 'stairs', 'star', 'steak', 'stereo', 'stethoscope', 'stitches',
    'stop sign', 'stove', 'strawberry', 'streetlight', 'string bean', 'submarine',
    'suitcase', 'sun', 'swan', 'sweater', 'swing set', 'sword', 'syringe',
    'table', 'teapot', 'teddy-bear', 'telephone', 'television', 'tennis racquet',
    'tent', 'The Eiffel Tower', 'The Great Wall of China', 'The Mona Lisa',
    'tiger', 'toaster', 'toe', 'toilet', 'tooth', 'toothbrush', 'toothpaste',
    'tornado', 'tractor', 'traffic light', 'train', 'tree', 'triangle',
    'trombone', 'truck', 'trumpet', 't-shirt', 'umbrella', 'underwear', 'van',
    'vase', 'violin', 'washing machine', 'watermelon', 'waterslide', 'whale',
    'wheel', 'windmill', 'wine bottle', 'wine glass', 'wristwatch', 'yoga',
    'zebra', 'zigzag'];

    const randomIndex = Math.floor(Math.random() * (words.length+1));
    if (!this.wordsArray.includes(words[randomIndex])) {
      this.wordsArray.push(words[randomIndex]);
      console.log(this.wordsArray);
      // console.log(words[randomIndex]);
      // this.setState({currentWord: words[randomIndex]});
      this.currentWord = words[randomIndex];
      // console.log(this.currentWord);
      this.draw.sendWord({word: this.currentWord});
    }

    const timer = window.setInterval(() => {
      this.setState({seconds: this.state.seconds - 1});
      this.draw.sendTime({time: this.state.seconds});
      if (this.state.seconds <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  }

  compareResults = () => {
    console.log('currentWord:', this.receivedCurrentWord);
    console.log('receivedMessage:', this.state.inputMessage);
    let question = this.receivedCurrentWord;
    let answer = this.state.inputMessage;

    if (question === answer || answer.includes(question)) {
      console.log('yes you are right!');
    }
    else {
      console.log('try again!');
    }

  }

  // <Loadingpage/>
  render(){
    return(

      <div className="container">
      {
        this.props.loggedInStatus
        ?
        this.props.userDetails.draw ?
        <div className='draw-container'>
          <div className='drawPanel-container-top'>
            <button onClick={this.generateRandomWords}>Run</button>
            <div className="draw-word">Please Draw
              {
                this.currentWord ?

                  <span>
                    {this.currentWord}
                  </span>

                :
                null
              }
            </div>

            <h3>Time Remaining: <span>{this.state.seconds}</span> seconds!</h3>

            {
              this.state.receivedMessage?
              <div className='message-from-gusser'>
                {
                  // this.state.receivedMessage
                }
              </div>
              :
              null
            }

            <div className="draw">
              <div className="buttons">
                <img src={clear} alt="clear" onClick={() => {
                    this.clearCanvas();
                  }} className="clear"/>

                <img src={undo} alt="undo" onClick={() => {
                    this.saveableCanvas.undo();
                  }}className="undo"/>
              </div>
              <CanvasDraw className='drawPanel'
                onChange={this.handleChange}
                canvasWidth={this.state.width}
                canvasHeight={this.state.height}
                brushRadius = {4}
                hideGrid
                ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                />
            </div>
          </div>
        </div>
        :
        <div className="guess-container">
          <h3>Guess!</h3>

          <h3>Time Remaining: {this.state.receivedSeconds} seconds!</h3>
          <CanvasDraw className='drawPanel'
            canvasWidth={this.state.width}
            canvasHeight={this.state.height}
            brushRadius = {0}
            brushColor = {this.state.color}
            catenaryColor = {this.state.color}
            disabled
            hideGrid

            ref={canvasDraw => (this.loadableCanvas = canvasDraw)}
          />

        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Type Your Answer Here!" onChange={this.handleMessageChange}/>
          <button onClick={this.compareResults} type="submit">Answer!</button>
        </form>
        </div>
         :
        <h2>Please <Link to='/login'>Login</Link> to continue draw!</h2>
      }
      </div>
    );
  }
}
