import { Route, Routes } from 'react-router-dom'
import './App.css'

import FloatingShape from './components/FloatingShape'

import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import EmailVerficationPage from './pages/EmailVerficationPage'

function App() {
  return (
    <div 
      className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900  to-emerald-900 
      flex items-center justify-center relative overflow-hidden'
    >
      <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' dealy={0} />
      <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='50%' left='60%' dealy={5} />
      <FloatingShape color='bg-lime-500' size='w-32 h-32' top='10%' left='70%' dealy={2} />

      <Routes>
        <Route path='/' element={"Home"} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verify-email' element={<EmailVerficationPage />} />
      </Routes>
    </div>
  )
}

export default App
