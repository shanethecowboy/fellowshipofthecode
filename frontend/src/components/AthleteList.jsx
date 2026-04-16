import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function AthleteList() {
  const { data: athletes, isLoading, isError } = useQuery({
    queryKey: ['athletes'],
    queryFn: () => fetch('/api/athletes').then(res => {
      if (!res.ok) throw new Error('Failed to load athletes')
      return res.json()
    }),
  })

  if (isLoading) return <p className="text-muted-foreground">Loading athletes...</p>
  if (isError) return <p className="text-destructive">Failed to load athletes.</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>PR</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {athletes.map(a => (
          <TableRow key={a.id}>
            <TableCell>{a.name}</TableCell>
            <TableCell>{a.grade}</TableCell>
            <TableCell>{a.event}</TableCell>
            <TableCell>{a.pr}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default AthleteList
