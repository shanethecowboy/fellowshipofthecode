import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { isLoggedIn } = useAuth()

  return (
    <nav className="navbar">
      <NavLink to="/" end className="nav-tab">Athletes</NavLink>
      <NavLink to="/fellowship" className="nav-tab">Fellowship</NavLink>
      <NavLink to="/meets" className="nav-tab">Meets</NavLink>
      {isLoggedIn
        ? <NavLink to="/admin" className="nav-tab">Admin</NavLink>
        : <NavLink to="/login" className="nav-tab">Login</NavLink>
      }
    </nav>
  )
}

export default Navbar
