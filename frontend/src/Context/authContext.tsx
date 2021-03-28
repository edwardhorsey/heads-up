import React, { createContext, useState, useContext, useReducer } from 'react';
import { AuthReducerAction, initialAuthState, IAuthContext, initialAuthContext, AuthProviderProps, AuthState } from '../Interfaces/interfaces';

const authReducer = (authState: AuthState, action: AuthReducerAction): AuthState => {
  const { type, payload: response } = action;
  
  switch(type) {
    case 'login':
      const { userObject } = response;

      return { 
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

  return <AuthContext.Provider value={{ authState, authDispatch }}>{props.children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext);