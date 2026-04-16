import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-6">Meets</h1>

      <h2 className="text-xl font-semibold text-foreground mb-3">Schedule</h2>
      {meetsLoading && <p className="text-muted-foreground">Loading meets...</p>}
      {meetsError && <p className="text-destructive">Failed to load meets.</p>}
      {meets && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meets.map(m => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.date.slice(0, 10)}</TableCell>
                <TableCell>{m.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <h2 className="text-xl font-semibold text-foreground mt-10 mb-3">Results</h2>
      {resultsLoading && <p className="text-muted-foreground">Loading results...</p>}
      {resultsError && <p className="text-destructive">Failed to load results.</p>}
      {results && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Place</TableHead>
              <TableHead>Athlete</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Meet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.place}</TableCell>
                <TableCell>{r.athleteName}</TableCell>
                <TableCell>{r.time}</TableCell>
                <TableCell>{r.meetName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default Meets
