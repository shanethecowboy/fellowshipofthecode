import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const emptyMeetForm = { name: '', date: '', location: '' }

function Meets() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState(emptyMeetForm)

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

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => fetch(`/api/meets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => { if (!res.ok) throw new Error('Failed to update') }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meets'] })
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`/api/meets/${id}`, { method: 'DELETE' })
      .then(res => { if (!res.ok) throw new Error('Failed to delete') }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meets'] }),
  })

  const createMutation = useMutation({
    mutationFn: (data) => fetch('/api/meets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, date: new Date(data.date + 'T00:00:00') }),
    }).then(res => { if (!res.ok) throw new Error('Failed to create') }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meets'] })
      setShowAdd(false)
      setAddForm(emptyMeetForm)
    },
  })

  const startEdit = (m) => {
    setEditingId(m.id)
    setEditForm({ name: m.name, date: m.date.slice(0, 10), location: m.location })
  }

  return (
    <div className="meets-page">
      <h1>Meets</h1>

      <h2>Upcoming Meets</h2>
      {meetsLoading && <p>Loading meets...</p>}
      {meetsError && <p className="error">Failed to load meets.</p>}
      {meets && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="add-btn" onClick={() => setShowAdd(true)}>+ Add Meet</button>
          </div>
          <table className="athletes-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {meets.map(m => (
                <tr key={m.id}>
                  {editingId === m.id ? (
                    <>
                      <td><input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} /></td>
                      <td><input type="date" value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} /></td>
                      <td><input value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} /></td>
                      <td>
                        <button onClick={() => updateMutation.mutate({ id: m.id, ...editForm, date: new Date(editForm.date + 'T00:00:00') })}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ marginLeft: '0.5rem' }}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{m.name}</td>
                      <td>{m.date.slice(0, 10)}</td>
                      <td>{m.location}</td>
                      <td>
                        <button onClick={() => startEdit(m)}>Edit</button>
                        <button onClick={() => deleteMutation.mutate(m.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2 style={{ marginTop: '2rem' }}>Results</h2>
      {resultsLoading && <p>Loading results...</p>}
      {resultsError && <p className="error">Failed to load results.</p>}
      {results && (
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
            {results.map(r => (
              <tr key={r.id}>
                <td>{r.place}</td>
                <td>{r.athleteName}</td>
                <td>{r.time}</td>
                <td>{r.meetName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add Meet</h2>
            <div className="modal-field">
              <label>Name</label>
              <input
                value={addForm.name}
                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Meet name"
              />
            </div>
            <div className="modal-field">
              <label>Date</label>
              <input
                type="date"
                value={addForm.date}
                onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="modal-field">
              <label>Location</label>
              <input
                value={addForm.location}
                onChange={e => setAddForm(f => ({ ...f, location: e.target.value }))}
                placeholder="City, GA"
              />
            </div>
            <div className="modal-actions">
              <button
                className="add-btn"
                onClick={() => createMutation.mutate(addForm)}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Saving...' : 'Add Meet'}
              </button>
              <button onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
            {createMutation.isError && <p className="error">Failed to add meet.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default Meets
