import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import FloatingShape from './components/FloatingShape'
import LoadingSpinner from './components/LoadingSpinner'

import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import EmailVerficationPage from './pages/EmailVerficationPage'
import DashboardPage from './pages/DashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

import {Toaster} from "react-hot-toast"
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'


// redirect authenticated users to the homepage
const RedirectUser = ({children}) => {
  const { isAuthenticated, user } = useAuthStore();

  if(isAuthenticated && user.isVerified){
    return <Navigate to='/' replace />  // replace -> to replace it with the current page
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

  const { checkAuth, isCheckingAuth } = useAuthStore();

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
        <Route path='/forgot-password' element={
          <RedirectUser>
            <ForgotPasswordPage/>
          </RedirectUser>
        } />
        <Route path='/reset-password/:token' element={
          <RedirectUser>
            <ResetPasswordPage/>
          </RedirectUser>
        } />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
