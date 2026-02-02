import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    monthlyIncome?: number;
    budgetGoal?: number;
    currency?: string;
    darkMode?: boolean;
  };
}

interface ResetToken {
  email: string;
  code: string;
  expiresAt: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updatePreferences: (preferences: User['preferences']) => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message?: string; code?: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// In-memory storage
let USERS = [
  {
    id: '1',
    name: 'Mahira Noor',
    email: 'mahiranoor.088@gmail.com',
    password: 'password123',
    avatar: 'MN',
    preferences: {
      monthlyIncome: 4000,
      budgetGoal: 20,
      currency: 'USD',
      darkMode: false,
    },
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'JS',
    preferences: {
      monthlyIncome: 3500,
      budgetGoal: 25,
      currency: 'EUR',
      darkMode: false,
    },
  },
];

let RESET_TOKENS: ResetToken[] = [];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('budget_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user by email (case insensitive)
      const foundUser = USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (foundUser) {
        // Check password
        if (foundUser.password === password) {
          const userData: User = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            avatar: foundUser.avatar,
            preferences: foundUser.preferences,
          };
          
          setUser(userData);
          localStorage.setItem('budget_user', JSON.stringify(userData));
          localStorage.setItem('budget_token', `token_${Date.now()}`);
          
          return { success: true };
        } else {
          return { 
            success: false, 
            message: 'Incorrect password. Please try again.' 
          };
        }
      } else {
        // If email doesn't exist, create a new user on the fly
        // This allows any email to login if they provide a password
        // In a real app, you would redirect to signup instead
        const newUser = {
          id: Date.now().toString(),
          name: email.split('@')[0], // Use email username as name
          email: email.toLowerCase(),
          password: password, // Store the provided password
          avatar: email.substring(0, 2).toUpperCase(),
          preferences: {
            monthlyIncome: 0,
            budgetGoal: 20,
            currency: 'USD',
            darkMode: false,
          },
        };

        // Add to users list
        USERS.push(newUser);

        const userData: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          preferences: newUser.preferences,
        };

        setUser(userData);
        localStorage.setItem('budget_user', JSON.stringify(userData));
        localStorage.setItem('budget_token', `token_${Date.now()}`);
        
        return { 
          success: true, 
          message: 'New account created automatically!' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Keep other functions (signup, logout, etc.) the same as before...
  const signup = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!name || !email || !password) {
        return { 
          success: false, 
          message: 'All fields are required' 
        };
      }

      if (password.length < 6) {
        return { 
          success: false, 
          message: 'Password must be at least 6 characters' 
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { 
          success: false, 
          message: 'Please enter a valid email address' 
        };
      }

      const userExists = USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return { 
          success: false, 
          message: 'An account with this email already exists' 
        };
      }

      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        avatar: name.substring(0, 2).toUpperCase(),
        preferences: {
          monthlyIncome: 0,
          budgetGoal: 20,
          currency: 'USD',
          darkMode: false,
        },
      };

      USERS.push(newUser);

      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        preferences: newUser.preferences,
      };

      setUser(userData);
      localStorage.setItem('budget_user', JSON.stringify(userData));
      localStorage.setItem('budget_token', `token_${Date.now()}`);

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: 'Failed to create account. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('budget_user');
    localStorage.removeItem('budget_token');
    window.location.replace('/login');
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      
      const updatedUser = { ...prevUser, ...userData };
      
      localStorage.setItem('budget_user', JSON.stringify(updatedUser));
      
      const userIndex = USERS.findIndex(u => u.id === prevUser.id);
      if (userIndex !== -1) {
        const { password, ...safeUserData } = userData as any;
        USERS[userIndex] = { ...USERS[userIndex], ...safeUserData };
      }
      
      return updatedUser;
    });
  }, []);

  const updatePreferences = useCallback((preferences: User['preferences']) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      
      const updatedUser = { 
        ...prevUser, 
        preferences: { ...prevUser.preferences, ...preferences } 
      };
      
      localStorage.setItem('budget_user', JSON.stringify(updatedUser));
      
      const userIndex = USERS.findIndex(u => u.id === prevUser.id);
      if (userIndex !== -1) {
        USERS[userIndex].preferences = { 
          ...USERS[userIndex].preferences, 
          ...preferences 
        };
      }
      
      return updatedUser;
    });
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const userExists = USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (!userExists) {
        return { 
          success: false, 
          message: 'No account found with this email address' 
        };
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      const expiresAt = Date.now() + 15 * 60 * 1000;
      
      RESET_TOKENS = RESET_TOKENS.filter(token => token.email !== email.toLowerCase());
      
      RESET_TOKENS.push({
        email: email.toLowerCase(),
        code,
        expiresAt,
      });

      console.log(`Password reset code for ${email}: ${code}`);

      return { 
        success: true, 
        message: 'Reset code sent to your email',
        code
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { 
        success: false, 
        message: 'Failed to send reset code. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string, code: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!email || !code || !newPassword) {
        return { 
          success: false, 
          message: 'All fields are required' 
        };
      }

      if (newPassword.length < 6) {
        return { 
          success: false, 
          message: 'Password must be at least 6 characters' 
        };
      }

      const now = Date.now();
      const validToken = RESET_TOKENS.find(
        token => 
          token.email === email.toLowerCase() && 
          token.code === code && 
          token.expiresAt > now
      );

      if (!validToken) {
        return { 
          success: false, 
          message: 'Invalid or expired reset code' 
        };
      }

      const userIndex = USERS.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (userIndex === -1) {
        return { 
          success: false, 
          message: 'User not found' 
        };
      }

      USERS[userIndex].password = newPassword;

      RESET_TOKENS = RESET_TOKENS.filter(token => token.email !== email.toLowerCase());

      if (user && user.email.toLowerCase() === email.toLowerCase()) {
        logout();
      }

      return { 
        success: true, 
        message: 'Password reset successful. You can now login with your new password.' 
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        message: 'Failed to reset password. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  }, [user, logout]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    updatePreferences,
    requestPasswordReset,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};