'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [resources, setResources] = useState([])
  const [members, setMembers] = useState([])

  const ADMIN_PIN = '1234'

  useEffect(() => {
    if (authenticated) {
      fetchResources()
      fetchMembers()
    }
  }, [authenticated])

  async function fetchResources() {
    const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
    setResources(data || [])
  }

  async function fetchMembers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setMembers(data || [])
  }

  async function handleDelete(id) {
    if (!confirm('මෙම Resource එක මකා දැමීමට විශ්වාසද?')) return
    const { error } = await supabase.from('resources').delete().eq('id', id)
    if (error) alert(error.message)
    else {
      alert('සාර්ථකව මකා දමන ලදී!')
      fetchResources()
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-sm w-full text-center space-y-4">
          <h1 className="text-xl font-bold text-white">Admin Security Access</h1>
          <input type="password" placeholder="Enter Admin PIN" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg text-center" />
          <button onClick={() => pin === ADMIN_PIN ? setAuthenticated(true) : alert('වැරදි PIN අංකයකි!')} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg">Access Admin Panel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-red-500">Admin Control Panel</h1>
        <button onClick={() => setAuthenticated(false)} className="bg-slate-800 px-4 py-2 rounded-lg text-xs">Logout</button>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200">Registered Campus Members ({members.length})</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="p-3">Email</th>
                <th className="p-3">WhatsApp Number</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="p-3 font-mono text-blue-400">{m.email}</td>
                  <td className="p-3 font-mono text-emerald-400">{m.whatsapp || 'N/A'}</td>
                  <td className="p-3">{m.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200">Uploaded Resources ({resources.length})</h2>
        <div className="space-y-2">
          {resources.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs text-slate-400">{item.university} | {item.degree} | {item.category}</p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg text-xs hover:bg-red-600 hover:text-white transition">Delete Resource</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}