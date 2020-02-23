import React, { Fragment } from 'react';
import { ActionCable } from 'react-actioncable-provider';

const Cable = ({ playrooms, handleReceivedMessage }) => {
  return (
    <Fragment>
      {playrooms.map(playroom => {
        return (
          <ActionCable
            key={playroom.id}  
            channel={{ channel: 'MessagesChannel', playroom: playroom.id }}
            onReceived={handleReceivedMessage}
          />
        );
      })}
    </Fragment>
  );
};

export default Cable;
