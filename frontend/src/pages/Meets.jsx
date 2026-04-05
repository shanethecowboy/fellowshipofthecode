import { useQuery } from '@tanstack/react-query'

function Meets() {
  const { data: meets, isLoading: meetsLoading, isError: meetsError } = useQuery({
    queryKey: ['meets'],
    queryFn: () => fetch('/api/meets').then(res => {
      if (!res.ok) throw new Error('Failed to load meets')
      return res.json()
    }),
  })

  const { data: results, isLoading: resultsLoading, isError: resultsError } = useQuery({
    queryKey: ['results'],
    queryFn: () => fetch('/api/results').then(res => {
      if (!res.ok) throw new Error('Failed to load results')
      return res.json()
    }),
  })

  const { data: athletes } = useQuery({
    queryKey: ['athletes'],
    queryFn: () => fetch('/api/athletes').then(res => {
      if (!res.ok) throw new Error('Failed to load athletes')
      return res.json()
    }),
  })

  return (
    <div className="meets-page">
      <h1>Meets</h1>

      <h2>Upcoming Meets</h2>
      {meetsLoading && <p>Loading meets...</p>}
      {meetsError && <p className="error">Failed to load meets.</p>}
      {meets && (
        <table className="athletes-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {meets.map(m => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.date}</td>
                <td>{m.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: '2rem' }}>Results</h2>
      {resultsLoading && <p>Loading results...</p>}
      {resultsError && <p className="error">Failed to load results.</p>}
      {results && meets && athletes && (
        <table className="athletes-table">
          <thead>
            <tr>
              <th>Place</th>
              <th>Athlete</th>
              <th>Time</th>
              <th>Meet</th>
            </tr>
          </thead>
          <tbody>
            {results.sort((a, b) => a.place - b.place).map(r => (
              <tr key={r.id}>
                <td>{r.place}</td>
                <td>{athletes.find(a => a.id === r.athleteId)?.name ?? `Athlete ${r.athleteId}`}</td>
                <td>{r.time}</td>
                <td>{meets.find(m => m.id === r.meetId)?.name ?? r.meetId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Meets
