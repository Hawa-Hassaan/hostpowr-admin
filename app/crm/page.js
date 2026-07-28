'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STAGES = ['Contacted', 'Opened', 'Replied', 'Proposal Sent', 'Closed Won', 'Closed Lost']

const STAGE_COLORS = {
  'Contacted':     { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  'Opened':        { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
  'Replied':       { bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
  'Proposal Sent': { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
  'Closed Won':    { bg: '#F0FDF4', color: '#14532D', border: '#86EFAC' },
  'Closed Lost':   { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
}

export default function CRMPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')

  useEffect(() => { fetchLeads() }, [])

  async function fetchLeads() {
    setLoading(true)
    const { data } = await supabase
      .from('leads')
      .select('*, emails(*)')
      .in('status', STAGES)
      .order('score', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  async function updateStage(id, status) {
    await supabase.from('leads').update({ status }).eq('id', id)
    fetchLeads()
  }

  async function saveNote() {
    if (!selected) return
    await supabase.from('leads').update({ assigned_agent: note }).eq('id', selected.id)
    setSelected(null)
    setNote('')
    fetchLeads()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 32px', display: 'flex', alignItems: 'center', height: '60px', gap: '32px' }}>
        <span style={{ fontWeight: '700', fontSize: '16px', color: '#111827' }}>HostPowr CRM</span>
        {['Leads', 'CRM', 'Campaigns', 'Blacklist', 'Reports'].map(item => (
          <a key={item} href={`/${item.toLowerCase()}`}
            style={{ fontSize: '14px', color: item === 'CRM' ? '#2563EB' : '#6B7280', textDecoration: 'none', fontWeight: item === 'CRM' ? '600' : '400' }}>
            {item}
          </a>
        ))}
      </div>

      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>CRM Pipeline</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px' }}>Track contacted leads through deal stages</p>

        {loading ? <p style={{ color: '#9CA3AF' }}>Loading...</p> : (

          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
            {STAGES.map(stage => {
              const stageLeads = leads.filter(l => l.status === stage)
              const sc = STAGE_COLORS[stage]
              return (
                <div key={stage} style={{ minWidth: '240px', flex: '1' }}>
                  {/* Stage header */}
                  <div style={{ backgroundColor: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: sc.color }}>{stage}</span>
                    <span style={{ fontSize: '12px', backgroundColor: sc.color, color: '#fff', borderRadius: '999px', padding: '1px 8px' }}>{stageLeads.length}</span>
                  </div>

                  {/* Cards */}
                  {stageLeads.map(lead => (
                    <div key={lead.id} onClick={() => { setSelected(lead); setNote(lead.assigned_agent || '') }}
                      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px', marginBottom: '10px', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827', marginBottom: '4px' }}>{lead.company}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>{(lead.website || '').replace('https://', '').replace('www.', '').split('/')[0]}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#6B7280' }}>Score: <b style={{ color: '#111827' }}>{lead.score}</b></span>
                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{lead.emails?.length || 0} emails</span>
                      </div>
                      {/* Move stage */}
                      <select value={lead.status} onClick={e => e.stopPropagation()}
                        onChange={e => updateStage(lead.id, e.target.value)}
                        style={{ marginTop: '10px', width: '100%', padding: '4px 8px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#374151', cursor: 'pointer' }}>
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#D1D5DB', fontSize: '13px' }}>Empty</div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '28px', width: '480px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>{selected.company}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9CA3AF' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                ['Website', (selected.website || '-').replace('https://', '').replace('www.', '').split('/')[0]],
                ['Email', selected.email || '-'],
                ['Phone', selected.phone || '-'],
                ['Score', selected.score],
                ['Status', selected.status],
                ['Emails Sent', selected.emails?.length || 0],
              ].map(([label, value]) => (
                <div key={label} style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Notes</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
                placeholder="Add notes about this lead..." />
            </div>
            <button onClick={saveNote}
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: '100%' }}>
              Save Notes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}