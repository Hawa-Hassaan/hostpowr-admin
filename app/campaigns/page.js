'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', country: 'Belgium', industry: '', service: '' })
  const [showing, setShowing] = useState(false)

  useEffect(() => { fetchCampaigns() }, [])

  async function fetchCampaigns() {
    setLoading(true)
    const { data } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false })
    setCampaigns(data || [])
    setLoading(false)
  }

  async function createCampaign() {
    if (!form.name) return
    await supabase.from('campaigns').insert([{ ...form, status: 'active' }])
    setForm({ name: '', country: 'Belgium', industry: '', service: '' })
    setShowing(false)
    fetchCampaigns()
  }

  async function toggleStatus(id, status) {
    const next = status === 'active' ? 'paused' : 'active'
    await supabase.from('campaigns').update({ status: next }).eq('id', id)
    fetchCampaigns()
  }

  const inp = { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 32px', display: 'flex', alignItems: 'center', height: '60px', gap: '32px' }}>
        <span style={{ fontWeight: '700', fontSize: '16px', color: '#111827' }}>HostPowr CRM</span>
        {['Leads', 'CRM', 'Campaigns', 'Blacklist', 'Reports'].map(item => (
          <a key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: '14px', color: item === 'Campaigns' ? '#2563EB' : '#6B7280', textDecoration: 'none', fontWeight: item === 'Campaigns' ? '600' : '400' }}>{item}</a>
        ))}
      </div>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: 0 }}>Campaigns</h1>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0' }}>Manage your outreach campaigns</p>
          </div>
          <button onClick={() => setShowing(!showing)} style={{ backgroundColor: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            + New Campaign
          </button>
        </div>

        {showing && (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', marginBottom: '24px', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>Create Campaign</h3>
            <input placeholder="Campaign name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} />
            <input placeholder="Target country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} style={inp} />
            <input placeholder="Target industry (e.g. digital agency)" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} style={inp} />
            <input placeholder="Service to promote (e.g. AI VPS)" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} style={inp} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={createCampaign} style={{ backgroundColor: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Create</button>
              <button onClick={() => setShowing(false)} style={{ backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gap: '12px' }}>
          {loading ? <p style={{ color: '#9CA3AF' }}>Loading...</p> : campaigns.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '48px', textAlign: 'center', color: '#9CA3AF' }}>No campaigns yet — create one above</div>
          ) : campaigns.map(c => (
            <div key={c.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px', color: '#111827', marginBottom: '4px' }}>{c.name}</div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>{c.country} · {c.industry} · {c.service}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '999px', backgroundColor: c.status === 'active' ? '#ECFDF5' : '#F3F4F6', color: c.status === 'active' ? '#065F46' : '#6B7280' }}>{c.status}</span>
                <button onClick={() => toggleStatus(c.id, c.status)} style={{ fontSize: '13px', padding: '6px 14px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', cursor: 'pointer', color: '#374151' }}>
                  {c.status === 'active' ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}