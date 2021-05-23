# heads-up-poker

## 🃏 All-In-Or-Fold poker for two players 🃏

A game of heads up All-In-or-Fold poker. Players can sign in to view their bankroll, create a new game (10 character code to share with a friend) or join an existing game and play poker. If a player runs out of chips they can add more into the game from their bankroll. When leaving a game, players withdraw their chips to their bankroll to be used on their next game. If a player disconnects in the middle of a game their chips will be credited to their account.

This app uses AWS Gateway API for the websocket, AWS lambda, a single DynamoDB table, AWS Cognito for authentication and React TypeScript for the frontend. I am using AWS CodePipeline to deploy the application direct from GitHub.

This is an ongoing project - here are some plans for the future:

- Extend the game to a full 'Flop, Turn & River' game of poker
- Add Serverless DynamoDB Local for easier development
- Implement end-to-end testing
- Add Storybook.js for organising the UI components

### Install, deploy and run the websocket (using Serverless framework)

This app uses Python 3.8

`cd websocket`

`npm install -g serverless@1.48.2` --> `sls login`

`npm install`

`pip3 install -r python-packages.txt -t ./lib/python`

`sls deploy`

then to run locally...

`sls offline`

### Tests for both frontend & websocket 
`npm test`

