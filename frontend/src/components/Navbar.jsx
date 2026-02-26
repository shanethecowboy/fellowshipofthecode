import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end className="nav-tab">Athletes</NavLink>
      <NavLink to="/fellowship" className="nav-tab">Fellowship</NavLink>
      <NavLink to="/referee" className="nav-tab">Intramural Referee</NavLink>
    </nav>
  )
}

export default Navbar
