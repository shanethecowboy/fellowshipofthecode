import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const emptyAthlete = { name: '', grade: '', event: '', pr: '' }
const emptyMeet = { name: '', date: '', location: '' }

function AdminModal({ title, fields, form, setForm, onSave, onClose, saving, error }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl p-8 min-w-80 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        {fields.map(({ label, key, placeholder, type = 'text' }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</label>
            <input
              type={type}
              className="bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
            />
          </div>
        ))}
        <div className="flex gap-3 justify-end mt-2">
          <Button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    </div>
  )
}

export default function Admin() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  // Athletes
  const { data: athletes, isLoading: athletesLoading } = useQuery({
    queryKey: ['athletes'],
    queryFn: () => fetch('/api/athletes').then(r => r.json()),
  })
  const [editingAthlete, setEditingAthlete] = useState(null)
  const [editAthleteForm, setEditAthleteForm] = useState({})
  const [showAddAthlete, setShowAddAthlete] = useState(false)
  const [addAthleteForm, setAddAthleteForm] = useState(emptyAthlete)

  const updateAthlete = useMutation({
    mutationFn: ({ id, ...data }) => fetch(`/api/athletes/${id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(data) })
      .then(r => { if (!r.ok) throw new Error() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['athletes'] }); setEditingAthlete(null) },
  })
  const deleteAthlete = useMutation({
    mutationFn: (id) => fetch(`/api/athletes/${id}`, { method: 'DELETE', headers: authHeaders })
      .then(r => { if (!r.ok) throw new Error() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['athletes'] }),
  })
  const createAthlete = useMutation({
    mutationFn: (data) => fetch('/api/athletes', { method: 'POST', headers: authHeaders, body: JSON.stringify(data) })
      .then(r => { if (!r.ok) throw new Error() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['athletes'] }); setShowAddAthlete(false); setAddAthleteForm(emptyAthlete) },
  })

  // Meets
  const { data: meets, isLoading: meetsLoading } = useQuery({
    queryKey: ['meets'],
    queryFn: () => fetch('/api/meets').then(r => r.json()),
  })
  const [editingMeet, setEditingMeet] = useState(null)
  const [editMeetForm, setEditMeetForm] = useState({})
  const [showAddMeet, setShowAddMeet] = useState(false)
  const [addMeetForm, setAddMeetForm] = useState(emptyMeet)

  const updateMeet = useMutation({
    mutationFn: ({ id, ...data }) => fetch(`/api/meets/${id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify({ ...data, date: new Date(data.date + 'T00:00:00') }) })
      .then(r => { if (!r.ok) throw new Error() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['meets'] }); setEditingMeet(null) },
  })
  const deleteMeet = useMutation({
    mutationFn: (id) => fetch(`/api/meets/${id}`, { method: 'DELETE', headers: authHeaders })
      .then(r => { if (!r.ok) throw new Error() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meets'] }),
  })
  const createMeet = useMutation({
    mutationFn: (data) => fetch('/api/meets', { method: 'POST', headers: authHeaders, body: JSON.stringify({ ...data, date: new Date(data.date + 'T00:00:00') }) })
      .then(r => { if (!r.ok) throw new Error() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['meets'] }); setShowAddMeet(false); setAddMeetForm(emptyMeet) },
  })

  const handleLogout = () => { logout(); navigate('/login') }

  const athleteFields = [
    { label: 'Name', key: 'name', placeholder: 'Full name' },
    { label: 'Grade', key: 'grade', placeholder: 'e.g. 10' },
    { label: 'Event', key: 'event', placeholder: 'e.g. 5K' },
    { label: 'PR', key: 'pr', placeholder: 'e.g. 18:45' },
  ]
  const meetFields = [
    { label: 'Name', key: 'name', placeholder: 'Meet name' },
    { label: 'Date', key: 'date', placeholder: '', type: 'date' },
    { label: 'Location', key: 'location', placeholder: 'City, GA' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Log Out</Button>
      </div>

      {/* Athletes */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Athletes</h2>
          <Button onClick={() => setShowAddAthlete(true)}>+ Add Athlete</Button>
        </div>
        {athletesLoading && <p className="text-muted-foreground">Loading...</p>}
        {athletes && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>PR</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {athletes.map(a => (
                <TableRow key={a.id}>
                  {editingAthlete === a.id ? (
                    <>
                      <TableCell><input className="bg-input border border-border rounded px-2 py-1 text-sm w-full" value={editAthleteForm.name} onChange={e => setEditAthleteForm(f => ({ ...f, name: e.target.value }))} /></TableCell>
                      <TableCell><input className="bg-input border border-border rounded px-2 py-1 text-sm w-16" value={editAthleteForm.grade} onChange={e => setEditAthleteForm(f => ({ ...f, grade: e.target.value }))} /></TableCell>
                      <TableCell><input className="bg-input border border-border rounded px-2 py-1 text-sm w-full" value={editAthleteForm.event} onChange={e => setEditAthleteForm(f => ({ ...f, event: e.target.value }))} /></TableCell>
                      <TableCell><input className="bg-input border border-border rounded px-2 py-1 text-sm w-24" value={editAthleteForm.pr} onChange={e => setEditAthleteForm(f => ({ ...f, pr: e.target.value }))} /></TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="sm" onClick={() => updateAthlete.mutate({ id: a.id, ...editAthleteForm })}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingAthlete(null)}>Cancel</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{a.name}</TableCell>
                      <TableCell>{a.grade}</TableCell>
                      <TableCell>{a.event}</TableCell>
                      <TableCell>{a.pr}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingAthlete(a.id); setEditAthleteForm({ name: a.name, grade: a.grade, event: a.event, pr: a.pr }) }}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteAthlete.mutate(a.id)}>Delete</Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Meets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Meets</h2>
          <Button onClick={() => setShowAddMeet(true)}>+ Add Meet</Button>
        </div>
        {meetsLoading && <p className="text-muted-foreground">Loading...</p>}
        {meets && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meets.map(m => (
                <TableRow key={m.id}>
                  {editingMeet === m.id ? (
                    <>
                      <TableCell><input className="bg-input border border-border rounded px-2 py-1 text-sm w-full" value={editMeetForm.name} onChange={e => setEditMeetForm(f => ({ ...f, name: e.target.value }))} /></TableCell>
                      <TableCell><input type="date" className="bg-input border border-border rounded px-2 py-1 text-sm" value={editMeetForm.date} onChange={e => setEditMeetForm(f => ({ ...f, date: e.target.value }))} /></TableCell>
                      <TableCell><input className="bg-input border border-border rounded px-2 py-1 text-sm w-full" value={editMeetForm.location} onChange={e => setEditMeetForm(f => ({ ...f, location: e.target.value }))} /></TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="sm" onClick={() => updateMeet.mutate({ id: m.id, ...editMeetForm })}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingMeet(null)}>Cancel</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{m.name}</TableCell>
                      <TableCell>{m.date.slice(0, 10)}</TableCell>
                      <TableCell>{m.location}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingMeet(m.id); setEditMeetForm({ name: m.name, date: m.date.slice(0, 10), location: m.location }) }}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteMeet.mutate(m.id)}>Delete</Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {showAddAthlete && (
        <AdminModal
          title="Add Athlete"
          fields={athleteFields}
          form={addAthleteForm}
          setForm={setAddAthleteForm}
          onSave={() => createAthlete.mutate(addAthleteForm)}
          onClose={() => setShowAddAthlete(false)}
          saving={createAthlete.isPending}
          error={createAthlete.isError ? 'Failed to add athlete.' : null}
        />
      )}

      {showAddMeet && (
        <AdminModal
          title="Add Meet"
          fields={meetFields}
          form={addMeetForm}
          setForm={setAddMeetForm}
          onSave={() => createMeet.mutate(addMeetForm)}
          onClose={() => setShowAddMeet(false)}
          saving={createMeet.isPending}
          error={createMeet.isError ? 'Failed to add meet.' : null}
        />
      )}
    </div>
  )
}
