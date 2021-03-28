import React, { createContext, useContext, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthReducerAction, initialAuthState, IAuthContext, initialAuthContext, AuthProviderProps, AuthState } from '../Interfaces/interfaces';

const authReducer = (authState: AuthState, action: AuthReducerAction): AuthState => {
  const { type, payload: response } = action;
  
  switch(type) {
    case 'login':
      const { userObject } = response;

      return { ...authState,
        authToken: userObject.authToken,
        displayName: userObject.displayName,
        email: userObject.email,
      };

    case 'logout':
      return initialAuthState

    case 'forceLogout':
      const { message } = response;
      console.error(message);

      return initialAuthState

      default: {
        throw new Error(`Action - ${type} - not matched`);
      }
  }

};

export const AuthContext = createContext<IAuthContext>(initialAuthContext);

export const AuthProvider = (props: AuthProviderProps) => {
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState)
  let history = useHistory();

  const login = (response: any) => {
    response.userObject
      ? authDispatch({ type: 'login', payload: response })
      : console.error(response.message);
    history.push('/');
  };

  return <AuthContext.Provider value={{ authState, authDispatch, login }}>{props.children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext);