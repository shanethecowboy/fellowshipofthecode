import { Link } from 'react-router-dom'

const characters = [
  { path: '/frodo', name: 'Frodo Baggins', race: 'Hobbit', role: 'Ring-bearer', image: '/images/Frodo.png' },
  { path: '/sam', name: 'Samwise Gamgee', race: 'Hobbit', role: 'Ring-bearer\'s companion', image: '/images/Samwise.png' },
  { path: '/gandalf', name: 'Gandalf', race: 'Maia (Wizard)', role: 'Guide & protector', image: '/images/Gandolf.png' },
  { path: '/aragorn', name: 'Aragorn', race: 'Man', role: 'Heir of Isildur', image: '/images/Aragon.png' },
  { path: '/legolas', name: 'Legolas', race: 'Elf', role: 'Archer of the Woodland Realm', image: '/images/Legolas.png' },
  { path: '/gimli', name: 'Gimli', race: 'Dwarf', role: 'Warrior of Erebor', image: '/images/Gimli.png' },
  { path: '/boromir', name: 'Boromir', race: 'Man', role: 'Captain of Gondor', image: '/images/Boromir.png' },
  { path: '/merry', name: 'Meriadoc Brandybuck', race: 'Hobbit', role: 'Esquire of Rohan', image: '/images/Merry.png' },
  { path: '/pippin', name: 'Peregrin Took', race: 'Hobbit', role: 'Guard of the Citadel', image: '/images/Pippin.png' },
]

function Home() {
  return (
    <div className="home">
      <h1>The Fellowship of the Ring</h1>
      <p className="subtitle">Nine companions set out to destroy the One Ring and save Middle-earth.</p>
      <div className="character-grid">
        {characters.map(({ path, name, race, role, image, initials, color }) => (
          <Link key={path} to={path} className="character-card">
            {image
              ? <img className="avatar" src={image} alt={name} />
              : <div className="avatar" style={{ backgroundColor: color }}>{initials}</div>
            }
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
