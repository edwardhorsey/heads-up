import React from 'react';
import styles from './App.module.scss';
import ConnectedStatus from './Components/ConnectedStatus';
import { useAuth } from "./Context/authContext";
import Login from './Components/Login';
import Home from './Components/Home';
import {
  Switch,
  Route,
  // Link,
  // Redirect,
} from "react-router-dom";

const App = () => {  
  const { authState } = useAuth();

  return (
      <div className={styles.App}>
        <Route path="/">
          {authState.authToken ? (
            <Switch>
              <Route exact path="/">
                <Home />
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