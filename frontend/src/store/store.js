import {create} from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true; // for every request axios will put cookie into the req header

export const useAuthStore = create((set) => ({
  // initial states
  user:null,
  isAuthenticated:false,
  error:null,
  isLoading:false,
  isCheckingAuth:true,

  signup: async(email, password, name) => {
    set({isLoading:true, error:null});
    try {
      const response = await axios.post(`${API_URL}/signup`,{email,password,name})
      set({
        user:response.data.user, // cuz we used "user" while sending the response in backend, see auth.controller.js > signup > res
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({
        error:error.response.data.message || "Error Signing Up",
        isLoading: false
      })
      throw error;
    }
  }
}))
