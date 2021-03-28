import React from 'react';
import styles from './App.module.scss';
import ConnectedStatus from './Components/ConnectedStatus';
import { useAuth } from "./Context/authContext";
import Login from './Components/Login';
import LoggingIn from './Components/LoggingIn';
import Home from './Components/Home';
import {
  Switch,
  Route,
  // Link,
  // Redirect,
} from "react-router-dom";

const App: React.FC = () => {
  const { authState } = useAuth();

  return (
      <div className={styles.App}>
        <Route path="/">
          {authState.authToken ? (
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/">
                <Login />
              </Route>
              <Route exact path="/logging-in">
                <LoggingIn />
              </Route>
            </Switch>
          )}
        </Route>
        <ConnectedStatus />
      </div>
  );
}

export default App;