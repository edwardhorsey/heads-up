import React, { useContext } from 'react';
import styles from './App.module.scss';

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
import Home from './Components/Home';

const App = () => {  


  const auth = useContext(AuthContext);
  const { authState } = auth;
  
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