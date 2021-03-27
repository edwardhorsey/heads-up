import React, { ReactChild, createContext, useState, useContext } from 'react';
import { AuthState, initialAuthState, IAuthContext, initialAuthContext } from '../Interfaces/interfaces';

interface Iprops {
  children: ReactChild
}

export const AuthContext = createContext<IAuthContext>(initialAuthContext);

export const AuthProvider = (props: Iprops) => {
  const [authState, setAuthState] = useState(initialAuthState)

  const login = (userObject: AuthState) => setAuthState({ 
    authToken: userObject.authToken,
    displayName: userObject.displayName,
    email: userObject.email,
  });
  const logout = () => setAuthState(initialAuthState);
  const forceLogout = (message: string) => {
    console.error(message);
    setAuthState(initialAuthState);
  }

  return <AuthContext.Provider value={{ authState, setAuthState, login, logout, forceLogout }}>{props.children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext);