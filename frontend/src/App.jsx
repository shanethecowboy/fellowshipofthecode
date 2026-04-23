import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Fellowship from './pages/Fellowship'
import Frodo from './pages/Frodo'
import Sam from './pages/Sam'
import Gandalf from './pages/Gandalf'
import Aragorn from './pages/Aragorn'
import Legolas from './pages/Legolas'
import Gimli from './pages/Gimli'
import Boromir from './pages/Boromir'
import Merry from './pages/Merry'
import Pippin from './pages/Pippin'
import Meets from './pages/Meets'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Tracker from './pages/Tracker'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fellowship" element={<Fellowship />} />
          <Route path="/frodo" element={<Frodo />} />
          <Route path="/sam" element={<Sam />} />
          <Route path="/gandalf" element={<Gandalf />} />
          <Route path="/aragorn" element={<Aragorn />} />
          <Route path="/legolas" element={<Legolas />} />
          <Route path="/gimli" element={<Gimli />} />
          <Route path="/boromir" element={<Boromir />} />
          <Route path="/merry" element={<Merry />} />
          <Route path="/pippin" element={<Pippin />} />
          <Route path="/meets" element={<Meets />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/tracker" element={<Tracker />} />
        </Routes>
      </main>
    </AuthProvider>
  )
}

export default App
