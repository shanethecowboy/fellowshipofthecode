import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function AthleteList() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const { data: athletes, isLoading, isError } = useQuery({
    queryKey: ['athletes'],
    queryFn: () => fetch('/api/athletes').then(res => {
      if (!res.ok) throw new Error('Failed to load athletes')
      return res.json()
    }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => fetch(`/api/athletes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => { if (!res.ok) throw new Error('Failed to update') }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`/api/athletes/${id}`, { method: 'DELETE' })
      .then(res => { if (!res.ok) throw new Error('Failed to delete') }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['athletes'] }),
  })

  const startEdit = (a) => {
    setEditingId(a.id)
    setEditForm({ name: a.name, grade: a.grade, event: a.event, pr: a.pr })
  }

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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {athletes.map(a => (
          <tr key={a.id}>
            {editingId === a.id ? (
              <>
                <td><input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} /></td>
                <td><input value={editForm.grade} onChange={e => setEditForm(f => ({ ...f, grade: e.target.value }))} style={{ width: '3rem' }} /></td>
                <td><input value={editForm.event} onChange={e => setEditForm(f => ({ ...f, event: e.target.value }))} /></td>
                <td><input value={editForm.pr} onChange={e => setEditForm(f => ({ ...f, pr: e.target.value }))} style={{ width: '5rem' }} /></td>
                <td>
                  <button onClick={() => updateMutation.mutate({ id: a.id, ...editForm })}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ marginLeft: '0.5rem' }}>Cancel</button>
                </td>
              </>
            ) : (
              <>
                <td>{a.name}</td>
                <td>{a.grade}</td>
                <td>{a.event}</td>
                <td>{a.pr}</td>
                <td>
                  <button onClick={() => startEdit(a)}>Edit</button>
                  <button onClick={() => deleteMutation.mutate(a.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AthleteList
