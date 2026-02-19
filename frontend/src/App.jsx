import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Frodo from './pages/Frodo'
import Sam from './pages/Sam'
import Gandalf from './pages/Gandalf'
import Aragorn from './pages/Aragorn'
import Legolas from './pages/Legolas'
import Gimli from './pages/Gimli'
import Boromir from './pages/Boromir'
import Merry from './pages/Merry'
import Pippin from './pages/Pippin'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/frodo" element={<Frodo />} />
          <Route path="/sam" element={<Sam />} />
          <Route path="/gandalf" element={<Gandalf />} />
          <Route path="/aragorn" element={<Aragorn />} />
          <Route path="/legolas" element={<Legolas />} />
          <Route path="/gimli" element={<Gimli />} />
          <Route path="/boromir" element={<Boromir />} />
          <Route path="/merry" element={<Merry />} />
          <Route path="/pippin" element={<Pippin />} />
        </Routes>
      </main>
    </>
  )
}

export default App
