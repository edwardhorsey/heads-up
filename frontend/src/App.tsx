import React, { useContext } from 'react';
import styles from './App.module.scss';
import Lobby from './Components/Lobby';
import { ServerContext } from './Context/serverContext';
import GameContainer from './Components/GameContainer';
import ConnectedStatus from './Components/ConnectedStatus';
import { AuthContext } from "./Context/authContext";
import Login from './Components/Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Button from './Components/Button';

const App = () => {  
  const server = useContext(ServerContext);
  const { readyToStart } = server.serverState;

  const auth = useContext(AuthContext);
  const { authState, logout } = auth;
  
  return (
      <div className={styles.App}>
        <Route path="/">
          {authState.authToken ? (
            <Switch>
              <Route exact path="/">
                <h1>Heads Up Poker</h1>
                <Button logic={logout} text="Logout" />
                {/* <Link to="/display-name">Set display name</Link> */}
                {readyToStart ? <GameContainer /> : <Lobby />}
              </Route>
              {/* <Route exact path="/display-name">
                <Link to="/">Home</Link>
              </Route> */}
            </Switch>
          ) : (
            <Login />
          )}
        </Route>
        <ConnectedStatus />
      </div>
  );
}

export default App;