import React, { Component } from "react";

export default class Messages extends Component {
  componentDidMount() {
    this.props.subscribeToNewComments();
  }
  render() {
    const {
      data: { messages = [] }
    } = this.props;
    return (
      <div>
        <h6>messages </h6>
        <ul>
          {messages.map(mes => (
            <li key={mes.id}>{mes.text}</li>
          ))}
        </ul>
      </div>
    );
  }
}
