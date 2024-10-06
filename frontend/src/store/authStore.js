import {create} from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true; // for every request axios will put cookie into the req header

export const useAuthStore = create((set) => ({
  // initial states
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async(email, password, name) => {
    set({ isLoading:true, error:null });
    try {
      const response = await axios.post(`${API_URL}/signup`,{email,password,name})
      set({
        user: response.data.user, // cuz we used "user" while sending the response in backend, see auth.controller.js > signup > res
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Signing Up",
        isLoading: false
      });
      throw error;
    }
  },

  login: async(email, password) => {
    set({ isLoading: true, error: null});
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password});
      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
        isLoading: false
      });
    } catch (error) {
      set({
        error:error.response.data.message || "Error Logging In",
        isLoading: false
      });
      throw error;
    }
  },

  logout: async() => {
    set({ isLoading: true, error: null });
    try{
      await axios.post(`${API_URL}/logout`);
      set({ 
        user:null, 
        isAuthenticated:false,
        error:null,
        isLoading:false 
      });
    } catch (error) {
      set({
        error: "Error Logging Out",
        isLoading: false
      });
      throw error;
    }
  },

  verifyEmail: async(code) => {
    set({ isLoading:true, error:null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`,{code});
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error Verifying Email",
        isLoading: false
      });
      throw error;
    }
  },

  forgotPassword: async(email) => {
    set({ isLoading:true, error:null, message:null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {email});
      set({
        message: response.data.message,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Sending reset password link",
        isLoading: false
      });
      throw error;
    }
  },

  resetPassword: async(token,password) => {
    set({ isLoading:true, error:null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {password});
      set({
        message: response.data.message,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Resetting Password",
        isLoading: false
      });
      throw error;
    }
  },

  checkAuth: async() => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // to create a delay of 2 seconds to show the spinner
    set({ isCheckingAuth: true, error: null});
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false
      });
    } catch (error) {
      set({
        error: null,
        isAuthenticated: false,
        isCheckingAuth: false
      });
      throw error;
    }
  },
  
}))
