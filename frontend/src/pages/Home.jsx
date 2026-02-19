import { Link } from 'react-router-dom'

const characters = [
  { path: '/frodo', name: 'Frodo Baggins', race: 'Hobbit', role: 'Ring-bearer', initials: 'FB', color: '#4a6741' },
  { path: '/sam', name: 'Samwise Gamgee', race: 'Hobbit', role: 'Ring-bearer\'s companion', initials: 'SG', color: '#6b8c42' },
  { path: '/gandalf', name: 'Gandalf', race: 'Maia (Wizard)', role: 'Guide & protector', initials: 'G', color: '#8a8a8a' },
  { path: '/aragorn', name: 'Aragorn', race: 'Man', role: 'Heir of Isildur', initials: 'A', color: '#5c4a3a' },
  { path: '/legolas', name: 'Legolas', race: 'Elf', role: 'Archer of the Woodland Realm', initials: 'L', color: '#3a6b5c' },
  { path: '/gimli', name: 'Gimli', race: 'Dwarf', role: 'Warrior of Erebor', initials: 'G', color: '#8b4513' },
  { path: '/boromir', name: 'Boromir', race: 'Man', role: 'Captain of Gondor', initials: 'B', color: '#6a5c8a' },
  { path: '/merry', name: 'Meriadoc Brandybuck', race: 'Hobbit', role: 'Esquire of Rohan', initials: 'MB', color: '#7a8b3a' },
  { path: '/pippin', name: 'Peregrin Took', race: 'Hobbit', role: 'Guard of the Citadel', initials: 'PT', color: '#8b7a3a' },
]

function Home() {
  return (
    <div className="home">
      <h1>The Fellowship of the Ring</h1>
      <p className="subtitle">Nine companions set out to destroy the One Ring and save Middle-earth.</p>
      <div className="character-grid">
        {characters.map(({ path, name, race, role, initials, color }) => (
          <Link key={path} to={path} className="character-card">
            <div className="avatar" style={{ backgroundColor: color }}>{initials}</div>
            <h2>{name}</h2>
            <span className="race">{race}</span>
            <span className="role">{role}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
