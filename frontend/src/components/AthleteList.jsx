import { useQuery } from '@tanstack/react-query'

function AthleteList() {
  const { data: athletes, isLoading, isError } = useQuery({
    queryKey: ['athletes'],
    queryFn: () => fetch('/api/athletes').then(res => {
      if (!res.ok) throw new Error('Failed to load athletes')
      return res.json()
    }),
  })

  if (isLoading) return <p>Loading athletes...</p>
  if (isError) return <p className="error">Failed to load athletes.</p>

  return (
    <table className="athletes-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Grade</th>
          <th>Event</th>
          <th>PR</th>
        </tr>
      </thead>
      <tbody>
        {athletes.map((a, i) => (
          <tr key={i}>
            <td>{a.name}</td>
            <td>{a.grade}</td>
            <td>{a.event}</td>
            <td>{a.pr}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AthleteList
