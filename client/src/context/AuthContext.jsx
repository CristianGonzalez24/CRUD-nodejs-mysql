import { createContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import * as authApi from '../api/auth.js';
import { handleError } from '../utils/errorHandler.js';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  let refreshTimeoutId = null;

  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      setErrors(null);
    
      try {
        const check = await authApi.hasRefreshTokenRequest();

        if (check.data.hasToken) {
          const response = await authApi.refreshTokenRequest();
          const { accessToken: newAccessToken } = response.data;
          
          setToken(newAccessToken);
          await getUser(newAccessToken);
          scheduleTokenRefresh(newAccessToken);
          setIsLogged(true);
        }
      } catch (error) {
        const formattedError = handleError(error, { showToast: true });
        setErrors(formattedError);
        setUser(null);
        setIsLogged(false);
        setIsAdmin(false);

        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
  
    initializeAuth();
  }, []);

  const validateReturnUrl = (url) => {
    try {
      const returnUrl = new URL(url, window.location.origin);
      return returnUrl.origin === window.location.origin ? returnUrl.pathname : '/';
    } catch {
      return '/';
    }
  };

  const getTokenExpiration = (token) => {
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp ? decoded.exp : null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const scheduleTokenRefresh = (accessToken) => {
    const expirationTime = getTokenExpiration(accessToken);

    if (!expirationTime) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilRefresh = expirationTime - currentTime; 

    const refreshInMs = (timeUntilRefresh - 10) * 1000;

    if (refreshInMs <= 0) return;

    if (refreshTimeoutId) clearTimeout(refreshTimeoutId);

    refreshTimeoutId = setTimeout(async () => {
      try {
        const response = await authApi.refreshTokenRequest();
        const { accessToken: newToken } = response.data;
  
        setToken(newToken);
        await getUser(newToken); 
        scheduleTokenRefresh(newToken);
      } catch (error) {
        console.error("Error auto-refreshing token:", error);
        logoutUser();
      }
    }, refreshInMs);
  };

  const loginUser = useCallback(async (email, password, rememberMe, returnUrl) => {
    setIsLoading(true);
    setErrors(null);
  
    try {
      const response = await authApi.loginRequest({ email, password, rememberMe });
  
      if (response.status >= 200 && response.status < 300) {
        const { accessToken } = response.data;
        setToken(accessToken);

        await getUser(accessToken);
        setIsLogged(true);

        scheduleTokenRefresh(accessToken);

        const safeReturnUrl = validateReturnUrl(returnUrl);
        return { success: true, returnUrl: safeReturnUrl };
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
      setToken(null);
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

  const getUser = useCallback(async (accessToken) => {
    setIsLoading(true);
    setErrors(null);
  
    try {
      const tokenToUse = accessToken || token;
      const response = await authApi.getUserRequest(tokenToUse);
      
      if (response.status >= 200 && response.status < 300) {
        const userData = response.data;
  
        const normalizedUser = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          created_at: userData.created_at,
          avatar: userData.avatar || null
        };
  
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
      });
      setErrors(formattedError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadImage = useCallback(async (id, imageData) => {
    setIsLoading(true);
    setErrors(null);
  
    try {
      const response = await authApi.uploadImageRequest(id, imageData, token);
  
      if (response.status >= 200 && response.status < 300) {
        await getUser(token);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const formattedError = handleError(error, {
        fallbackMessage: "Failed to upload image. Please try again later",
        showToast: false
      });
      setErrors(formattedError);
      return { error: error.response.data.error.message || 'Failed to upload image. Please try again later' };
    } finally {
      setIsLoading(false);
    }
  }, [token, getUser]);

  const deleteImage = useCallback(async (id) => {
    setIsLoading(true);
    setErrors(null);
  
    try {
      const response = await authApi.deleteImageRequest(id, token);
  
      if (response.status >= 200 && response.status < 300) {
        await getUser(token);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const formattedError = handleError(error, {
        fallbackMessage: "Failed to delete image. Please try again later",
        showToast: false
      });
      setErrors(formattedError);
      return {
        error: error.response?.data?.error?.message || "Failed to delete image. Please try again later"
      };
    } finally {
      setIsLoading(false);
    }
  }, [token, getUser]);

  const updateUser = useCallback(async (id, data) => {
    setIsLoading(true);
    setErrors(null);
  
    try {
      const response = await authApi.updateUserRequest(id, data, token);
  
      if (response.status >= 200 && response.status < 300) {
        await getUser(token);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const formattedError = handleError(error, {
        fallbackMessage: "Failed to update user. Please try again later",
        showToast: false
      });
      setErrors(formattedError);
      return { error: error.response.data.error.message || 'Failed to update user. Please try again later' };
    } finally {
      setIsLoading(false);
    }
  }, [token, getUser]);
  
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
    getUser,
    uploadImage,
    deleteImage,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;