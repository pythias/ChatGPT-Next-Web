import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  name: string;
  token: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    // Here you would authenticate the user e.g., via an API
    // If successful, set the user state
    const userData: User = { name: 'John Doe', token: '' }; // Replace with real authentication logic
    setUser(userData);
  };

  const logout = () => {
    // Here you would clear the user session e.g., remove token from storage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
