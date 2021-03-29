import React, { createContext, useContext, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import {
  AuthProviderProps,
  AuthReducerAction,
  AuthState,
  initialAuthContext,
  initialAuthState,
  IAuthContext,
  WebsocketResponse,
} from '../Interfaces/interfaces';

const authReducer = (
  authState: AuthState,
  action: AuthReducerAction,
): AuthState => {
  switch (action.type) {
    case 'login':
      return {
        ...authState,
        authToken: action.userObject.authToken,
        displayName: action.userObject.displayName,
        email: action.userObject.email,
      };

    case 'logout':
      return initialAuthState;

    case 'forceLogout':
      console.error(action.message);
      return initialAuthState;

    default: {
      throw new Error(`Action - ${action} - not matched`);
    }
  }
};

export const AuthContext = createContext<IAuthContext>(initialAuthContext);

export const AuthProvider = (props: AuthProviderProps): JSX.Element => {
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState);
  const history = useHistory();

  const login = (response: WebsocketResponse) => {
    if (response.userObject) {
      authDispatch({ type: 'login', userObject: response.userObject });
    } else {
      console.error(response.message);
    }
    history.push('/');
  };

  const { children } = props;
  return (
    <AuthContext.Provider value={{ authState, authDispatch, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => useContext(AuthContext);
