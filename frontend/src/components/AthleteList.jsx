import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const emptyForm = { name: '', grade: '', event: '', pr: '' }

function AthleteList() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState(emptyForm)

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

  const createMutation = useMutation({
    mutationFn: (data) => fetch('/api/athletes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => { if (!res.ok) throw new Error('Failed to create') }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      setShowAdd(false)
      setAddForm(emptyForm)
    },
  })

  const startEdit = (a) => {
    setEditingId(a.id)
    setEditForm({ name: a.name, grade: a.grade, event: a.event, pr: a.pr })
  }

  if (isLoading) return <p>Loading athletes...</p>
  if (isError) return <p className="error">Failed to load athletes.</p>

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="add-btn" onClick={() => setShowAdd(true)}>+ Add Athlete</button>
      </div>

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

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add Athlete</h2>
            <div className="modal-field">
              <label>Name</label>
              <input
                value={addForm.name}
                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Full name"
              />
            </div>
            <div className="modal-field">
              <label>Grade</label>
              <input
                value={addForm.grade}
                onChange={e => setAddForm(f => ({ ...f, grade: e.target.value }))}
                placeholder="e.g. 10"
                style={{ width: '4rem' }}
              />
            </div>
            <div className="modal-field">
              <label>Event</label>
              <input
                value={addForm.event}
                onChange={e => setAddForm(f => ({ ...f, event: e.target.value }))}
                placeholder="e.g. 5K"
              />
            </div>
            <div className="modal-field">
              <label>PR</label>
              <input
                value={addForm.pr}
                onChange={e => setAddForm(f => ({ ...f, pr: e.target.value }))}
                placeholder="e.g. 18:45"
                style={{ width: '6rem' }}
              />
            </div>
            <div className="modal-actions">
              <button
                className="add-btn"
                onClick={() => createMutation.mutate(addForm)}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Saving...' : 'Add Athlete'}
              </button>
              <button onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
            {createMutation.isError && <p className="error">Failed to add athlete.</p>}
          </div>
        </div>
      )}
    </>
  )
}

export default AthleteList
