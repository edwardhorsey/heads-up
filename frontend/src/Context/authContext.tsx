import React, { createContext, useState, useContext } from 'react';
import { AuthReducerAction, initialAuthState, IAuthContext, initialAuthContext, AuthProviderProps, AuthState } from '../Interfaces/interfaces';

const authReducer = (authState: AuthState, action: AuthReducerAction) => {
  const { type, payload: response } = action;
  
  switch(type) {
    case 'login':
      return { ...authState, authToken: 'logged-in' };

      default: {
        throw new Error(`Action - ${type} - not matched`);
      }
  }

};

export const AuthContext = createContext<IAuthContext>(initialAuthContext);

export const AuthProvider = (props: AuthProviderProps) => {
  const [authState, setAuthState] = useState(initialAuthState)

  const login = () => setAuthState({ authToken: 'logged-in' });
  const logout = () => setAuthState({ authToken: '' });

  return <AuthContext.Provider value={{ authState, setAuthState, login, logout }}>{props.children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext);