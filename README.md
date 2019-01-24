# apollo2-subscriptions-example

This sample app is based on apollo graphql v2 subscriptions.

## Check other branches for

1. Using Query's "subscribeToMore" option

## How to use

### Run apollo server

```bash
cd be
npm install
npm start
```

### Run apollo client

```bash
cd fe
npm install
npm start
```

### About this branch 1_subscribeToMore

Ref: <https://www.apollographql.com/docs/react/advanced/subscriptions.html#subscribe-to-more>

When a new client joins we want to fetch the history of that particular channel and update with the new data on client as and when new message is added to channel.
