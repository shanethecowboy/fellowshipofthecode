import { Link } from 'react-router-dom'

const characters = [
  { path: '/frodo', name: 'Frodo Baggins', race: 'Hobbit', role: 'Ring-bearer' },
  { path: '/sam', name: 'Samwise Gamgee', race: 'Hobbit', role: 'Ring-bearer\'s companion' },
  { path: '/gandalf', name: 'Gandalf', race: 'Maia (Wizard)', role: 'Guide & protector' },
  { path: '/aragorn', name: 'Aragorn', race: 'Man', role: 'Heir of Isildur' },
  { path: '/legolas', name: 'Legolas', race: 'Elf', role: 'Archer of the Woodland Realm' },
  { path: '/gimli', name: 'Gimli', race: 'Dwarf', role: 'Warrior of Erebor' },
  { path: '/boromir', name: 'Boromir', race: 'Man', role: 'Captain of Gondor' },
  { path: '/merry', name: 'Meriadoc Brandybuck', race: 'Hobbit', role: 'Esquire of Rohan' },
  { path: '/pippin', name: 'Peregrin Took', race: 'Hobbit', role: 'Guard of the Citadel' },
]

function Home() {
  return (
    <div className="home">
      <h1>The Fellowship of the Ring</h1>
      <p className="subtitle">Nine companions set out to destroy the One Ring and save Middle-earth.</p>
      <div className="character-grid">
        {characters.map(({ path, name, race, role }) => (
          <Link key={path} to={path} className="character-card">
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
