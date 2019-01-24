import React, { Component } from "react";
import gql from "graphql-tag";
import { Query, Mutation, Subscription } from "react-apollo";

import "./App.css";
import Messages from "./Messages";

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

const QUERY_CHANNEL = gql`
  query Messages($channelId: ID!) {
    messages(channelId: $channelId) {
      id
      text
    }
  }
`;

class App extends Component {
  state = {
    value: "",
    selectedChannel: "1"
  };

  _handleChange = e => {
    this.setState({ value: e.target.value });
  };

  _reset = () => {
    this.setState({ value: "" });
  };

  render() {
    const { value, selectedChannel, channelHistory } = this.state;
    return (
      <div className="App">
        <div>
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
          <div>
            <Query
              query={QUERY_CHANNEL}
              variables={{
                channelId: selectedChannel
              }}
            >
              {({ subscribeToMore, ...result }) => (
                <Messages
                  {...result}
                  subscribeToNewComments={() =>
                    subscribeToMore({
                      document: COMMENTS_SUBSCRIPTION,
                      variables: { channelId: selectedChannel },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;
                        const newFeedItem = subscriptionData.data.messageAdded;
                        return Object.assign({}, prev, {
                          messages: [...prev.messages, newFeedItem]
                        });
                      }
                    })
                  }
                />
              )}
            </Query>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
