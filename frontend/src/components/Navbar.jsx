import { NavLink } from 'react-router-dom'
import './Navbar.css'

const characters = [
  { path: '/frodo', name: 'Frodo' },
  { path: '/sam', name: 'Sam' },
  { path: '/gandalf', name: 'Gandalf' },
  { path: '/aragorn', name: 'Aragorn' },
  { path: '/legolas', name: 'Legolas' },
  { path: '/gimli', name: 'Gimli' },
  { path: '/boromir', name: 'Boromir' },
  { path: '/merry', name: 'Merry' },
  { path: '/pippin', name: 'Pippin' },
]

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end className="nav-tab">Home</NavLink>
      {characters.map(({ path, name }) => (
        <NavLink key={path} to={path} className="nav-tab">{name}</NavLink>
      ))}
    </nav>
  )
}

export default Navbar
