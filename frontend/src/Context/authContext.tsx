import React, { ReactChild, createContext, useState } from 'react';
import { initialAuthState, AuthContextType, initialAuthContext } from './interfaces';

interface Iprops {
  children: ReactChild
}

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

export const AuthProvider = (props: Iprops) => {
  const [authState, setAuthState] = useState(initialAuthState)

  return <AuthContext.Provider value={{ authState, setAuthState }}>{props.children}</AuthContext.Provider>
};