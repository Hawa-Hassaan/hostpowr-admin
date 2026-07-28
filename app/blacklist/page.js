'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BlacklistPage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [domain, setDomain] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    setLoading(true)
    const { data } = await supabase.from('blacklist').select('*').order('added_at', { ascending: false })
    setList(data || [])
    setLoading(false)
  }

  async function addEntry() {
    if (!email && !domain) return
    await supabase.from('blacklist').insert([{ email, domain, reason }])
    setEmail(''); setDomain(''); setReason('')
    fetchList()
  }

  async function removeEntry(id) {
    await supabase.from('blacklist').delete().eq('id', id)
    fetchList()
  }

  const inp = { padding: '9px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', flex: 1 }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 32px', display: 'flex', alignItems: 'center', height: '60px', gap: '32px' }}>
        <span style={{ fontWeight: '700', fontSize: '16px', color: '#111827' }}>HostPowr CRM</span>
        {['Leads', 'CRM', 'Campaigns', 'Blacklist', 'Reports'].map(item => (
          <a key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: '14px', color: item === 'Blacklist' ? '#2563EB' : '#6B7280', textDecoration: 'none', fontWeight: item === 'Blacklist' ? '600' : '400' }}>{item}</a>
        ))}
      </div>
      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>Blacklist</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px' }}>Emails and domains that will never be contacted</p>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>Add to Blacklist</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
            <input placeholder="Domain (e.g. example.com)" value={domain} onChange={e => setDomain(e.target.value)} style={inp} />
            <input placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} style={inp} />
            <button onClick={addEntry} style={{ backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>Add</button>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Email', 'Domain', 'Reason', 'Added', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Loading...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Blacklist is empty</td></tr>
              ) : list.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 16px', color: '#111827' }}>{item.email || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#6B7280' }}>{item.domain || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#6B7280' }}>{item.reason || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#9CA3AF', fontSize: '13px' }}>{new Date(item.added_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => removeEntry(item.id)} style={{ fontSize: '13px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', color: '#991B1B', cursor: 'pointer' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}