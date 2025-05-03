import { createContext, useState, useCallback, useEffect } from 'react';
import * as authApi from '../api/auth.js';
import { handleError } from '../utils/errorHandler.js';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const loginUser = useCallback(async (email, password, rememberMe) => {
    setIsLoading(true);
    setErrors(null);
  
    try {
      const response = await authApi.loginRequest({ email, password, rememberMe });
  
      if (response.status >= 200 && response.status < 300) {
        setIsLogged(true);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message;
      const formattedError = handleError(error, {
        fallbackMessage: "Failed to login. Please try again later"
      })
      setErrors(formattedError);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (username, email, password, role) => {
    setIsLoading(true);
    setErrors(null);
  
    try {
      const response = await authApi.registerRequest({ username, email, password, role });
  
      if (response.status >= 200 && response.status < 300) {
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message;
      const formattedError = handleError(error, {
        fallbackMessage: "Failed to register. Please try again later"
      })
      setErrors(formattedError);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logoutUser = useCallback(async () => {
    setIsLoading(true);
    setErrors(null);
  
    try {
      await authApi.logoutRequest();
      setUser(null);
      setIsLogged(false);
      setIsAdmin(false);
      toast.success('Logged out successfully');
    } catch (error) {
      const formattedError = handleError(error, {
        fallbackMessage: "Failed to logout. Please try again later"
      })
      setErrors(formattedError);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const getUser = useCallback(async () => {
    setIsLoading(true);
    setErrors(null);
  
    try {
      const response = await authApi.getUserRequest();
      
      if (response.status >= 200 && response.status < 300) {
        const userData = response.data
        
        const normalizedUser = { 
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar || null 
        }
        setUser(normalizedUser);
        setIsLogged(true);
        setIsAdmin(normalizedUser.role === 'admin');
      }
    } catch (error) {
      setUser(null);
      setIsLogged(false);
      setIsAdmin(false);
  
      const formattedError = handleError(error, {
        fallbackMessage: "Failed to get user. Please try again later",
        showToast: false
      })
      setErrors(formattedError);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.checkAuthRequest();
  
        if (response.status >= 200 && response.status < 300) {
          await getUser();
        }
      } catch (error) {
        const formattedError = handleError(error, {
          showToast: false
        });  
        setErrors(formattedError);

        setUser(null);
        setIsLogged(false);
        setIsAdmin(false);
      }
    };
  
    checkAuth();
  }, []);
  
  useEffect(() => {
    if (errors) {
      const timer = setTimeout(() => {
        setErrors(null);
      }, 8000);
  
      return () => clearTimeout(timer);
    }
  }, [errors]);


  const value = {
    user,
    isLogged,
    isAdmin,
    isLoading,
    errors,
    loginUser,
    registerUser,
    logoutUser,
    getUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;