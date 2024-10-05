import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import FloatingShape from './components/FloatingShape'

import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import EmailVerficationPage from './pages/EmailVerficationPage'

import {Toaster} from "react-hot-toast"
import { useAuthStore } from './store/authStore'
import { Children, useEffect } from 'react'
import DashboardPage from './pages/DashboardPage'
import LoadingSpinner from './components/LoadingSpinner'

// redirect authenticated users to the homepage
const RedirectUser = ({children}) => {
  const { isAuthenticated, user } = useAuthStore();

  if(isAuthenticated && user.isVerified){
    return <Navigate to="/" replace />  // replace -> to replace it with the current page
  }

  return children
}

// protect routes that require authentication
const ProtectedRoute =({children}) => {
  const { isAuthenticated, user } = useAuthStore();

  if(!isAuthenticated)
    return <Navigate to='/login' replace />
  
  if(!user.isVerified)
    return <Navigate to='/verify-email' replace />

  return children;
}

function App() {

  const { checkAuth, isCheckingAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  },[checkAuth])

  if(isCheckingAuth) return <LoadingSpinner/>

  // console.log("Is authenticated:", isAuthenticated);
  // console.log("user:", user);

  return (
    <div 
      className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900  to-emerald-900 
      flex items-center justify-center relative overflow-hidden'
    >
      <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' dealy={0} />
      <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='50%' left='60%' dealy={5} />
      <FloatingShape color='bg-lime-500' size='w-32 h-32' top='10%' left='70%' dealy={2} />

      <Routes>
        <Route path='/' element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route path='/signup' element={
            <RedirectUser>
              <SignUpPage />
            </RedirectUser>
          } 
        />
        <Route path='/login' element={
            <RedirectUser>
              <LoginPage />
            </RedirectUser>
          }
        />
        <Route path='/verify-email' element={<EmailVerficationPage />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
