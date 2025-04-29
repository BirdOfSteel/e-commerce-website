import { createContext, useContext, useState, JSX } from 'react';
import { UserType, AuthContextType, AuthProviderProps } from '../types/types';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ initialUser = null, children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<UserType>(initialUser);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
