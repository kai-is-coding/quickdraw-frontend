import React from 'react';
import axios from 'axios';

import { API_ROOT, HEADERS } from '../constants';

class NewPlayroomForm extends React.Component {
  state = {
    title: ''
  };

  handleChange = e => {
    this.setState({ title: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault()
    axios.post(`${API_ROOT}/playrooms`,  {withCredentials: true}, {
      headers: HEADERS,
      body: JSON.stringify(this.state)
    });
    this.setState({ title: '' });
  };

  render = () => {
    return (
      <div className="newPlayroomForm">
        <form onSubmit={this.handleSubmit}>
          <label>New Playroom:</label>
          <br />
          <input
            type="text"
            value={this.state.title}
            onChange={this.handleChange}
          />
          <input type="submit" />
        </form>
      </div>
    );
  };
}

export default NewPlayroomForm;
