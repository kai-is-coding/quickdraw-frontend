import React from 'react';
import axios from 'axios';
import { ActionCable } from 'react-actioncable-provider';
import { API_ROOT } from '../constants';
import NewPlayroomForm from './NewPlayroomForm';
import MessagesArea from './MessagesArea';
import Cable from './Cable';

class PlayroomsList extends React.Component {
  state = {
    playrooms: [],
    activePlayroom: null
  };

  componentDidMount = () => {
    axios.get(`${API_ROOT}/playrooms`, {withCredentials: true})
      // .then(res => res.json())
      .then(playrooms => this.setState({ playrooms }));
  };

  handleClick = id => {
    this.setState({ activePlayroom: id });
  };

  handleReceivedPlayroom = response => {
    const { playroom } = response;
    this.setState({
      playrooms: [...this.state.playrooms, playroom]
    });
  };

  handleReceivedMessage = response => {
    const { message } = response;
    const playrooms = [...this.state.playrooms];
    const playroom = playrooms.find(
      playroom => playroom.id === message.conversation_id
    );
    playroom.messages = [...playroom.messages, message];
    this.setState({ playrooms });
  };

  render = () => {
    const { playrooms, activePlayroom } = this.state;
    return (
      <div className="playroomsList">
        <ActionCable
          channel={{ channel: 'PlayroomsChannel' }}
          onReceived={this.handleReceivedPlayroom}
        />
        {this.state.playrooms.length ? (
          <Cable
            playrooms={playrooms}
            handleReceivedMessage={this.handleReceivedMessage}
          />
        ) : null}
        <h2>Playrooms</h2>
        <ul>{mapPlayrooms(playrooms, this.handleClick)}</ul>
        <NewPlayroomForm />
        {activePlayroom ? (
          <MessagesArea
            playroom={findActivePlayroom(
              playrooms,
              activePlayroom
            )}
          />
        ) : null}
      </div>
    );
  };
}

export default PlayroomsList;

// helpers

const findActivePlayroom = (playrooms, activePlayroom) => {
  return playrooms.find(
    playroom => playroom.id === activePlayroom
  );
};

const mapPlayrooms = (playrooms, handleClick) => {
  return playrooms.(playroom => {
    return (
      <li key={playroom.id} onClick={() => handleClick(playroom.id)}>
        {playroom.title}
      </li>
    );
  });
};
