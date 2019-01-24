import React, { Component } from "react";
import gql from "graphql-tag";
import { Query, Mutation, Subscription } from "react-apollo";

import "./App.css";

const COMMENTS_SUBSCRIPTION = gql`
  subscription onMessageAdd($channelId: ID!) {
    messageAdded(channelId: $channelId) {
      id
      text
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation AddMessage($channelId: ID!, $text: String!) {
    addMessage(message: { channelId: $channelId, text: $text }) {
      id
      text
    }
  }
`;

class App extends Component {
  state = {
    value: "",
    channelHistory: {},
    selectedChannel: "1"
  };

  _handleChange = e => {
    this.setState({ value: e.target.value });
  };

  _reset = () => {
    this.setState({ value: "" });
  };

  // this is not required as we have "subscribeToMore" option
  // but to make the app look simple doing this
  _addToHistory = ({ client, subscriptionData: { data } }) => {
    const { channelHistory, selectedChannel } = this.state;
    const { messageAdded } = data;
    const prevData = channelHistory[selectedChannel];
    const newData = prevData
      ? [...prevData, messageAdded.text]
      : [messageAdded.text];
    this.setState({
      channelHistory: {
        ...channelHistory,
        [selectedChannel]: newData
      }
    });
  };

  render() {
    const { value, selectedChannel, channelHistory } = this.state;
    return (
      <div className="App">
        <div>
          <div>
            <Subscription
              subscription={COMMENTS_SUBSCRIPTION}
              variables={{ channelId: selectedChannel }}
              onSubscriptionData={this._addToHistory}
            >
              {({ data: { messageAdded } = {}, loading }) => {
                return (
                  <div>
                    <h4>
                      {" "}
                      Channel 1 latest:{" "}
                      {!loading && messageAdded && messageAdded.text}
                    </h4>
                    <textarea
                      readOnly
                      value={
                        channelHistory[selectedChannel] &&
                        channelHistory[selectedChannel].join("\r\n")
                      }
                      cols={30}
                      rows={10}
                    />
                  </div>
                );
              }}
            </Subscription>
          </div>
          <div>
            <Mutation mutation={ADD_MESSAGE}>
              {(addMessage, { data }) => (
                <div>
                  <h4> INPUT </h4>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      addMessage({
                        variables: { channelId: selectedChannel, text: value }
                      });
                      this._reset();
                    }}
                  >
                    <input
                      type="text"
                      value={value}
                      onChange={this._handleChange}
                    />
                    <button type="submit">SEND</button>
                  </form>
                </div>
              )}
            </Mutation>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
