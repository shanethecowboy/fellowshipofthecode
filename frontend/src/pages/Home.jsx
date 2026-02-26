import { useEffect, useState } from 'react'

function Home() {
  const [athletes, setAthletes] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/athletes')
      .then(res => res.json())
      .then(setAthletes)
      .catch(() => setError('Failed to load athletes.'))
  }, [])

  return (
    <div className="athletes-page">
      <h1>Athletes</h1>
      {error && <p className="error">{error}</p>}
      <table className="athletes-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Grade</th>
            <th>PR</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((a, i) => (
            <tr key={i}>
              <td>{a.name}</td>
              <td>{a.grade}</td>
              <td>{a.pr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Home
