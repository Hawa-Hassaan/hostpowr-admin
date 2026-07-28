'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_OPTIONS = ['New', 'Reviewed', 'Qualified', 'Rejected', 'Follow Later', 'Contacted', 'Closed']

const STATUS_COLORS = {
  'New': { bg: '#EFF6FF', color: '#1D4ED8' },
  'Reviewed': { bg: '#F5F3FF', color: '#6D28D9' },
  'Qualified': { bg: '#ECFDF5', color: '#065F46' },
  'Rejected': { bg: '#FEF2F2', color: '#991B1B' },
  'Follow Later': { bg: '#FFFBEB', color: '#92400E' },
  'Contacted': { bg: '#F0F9FF', color: '#0369A1' },
  'Closed': { bg: '#F9FAFB', color: '#374151' },
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => { fetchLeads() }, [])

  async function fetchLeads() {
    setLoading(true)
    const { data } = await supabase
      .from('leads')
      .select('*, enrichment(*)')
      .order('score', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('leads').update({ status }).eq('id', id)
    fetchLeads()
  }

  const filtered = filter === 'All' ? leads : leads.filter(l => l.status === filter)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Top Nav */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 32px', display: 'flex', alignItems: 'center', height: '60px', gap: '32px' }}>
        <span style={{ fontWeight: '700', fontSize: '16px', color: '#111827', letterSpacing: '-0.3px' }}>HostPowr CRM</span>
        {['Leads', 'CRM', 'Campaigns', 'Blacklist', 'Reports'].map(item => (
          <a key={item} href={`/${item.toLowerCase()}`}
            style={{ fontSize: '14px', color: item === 'Leads' ? '#2563EB' : '#6B7280', textDecoration: 'none', fontWeight: item === 'Leads' ? '600' : '400' }}>
            {item}
          </a>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#6B7280' }}>
          {leads.length} leads total
        </div>
      </div>

      <div style={{ padding: '32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: 0 }}>Lead Qualification</h1>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0' }}>Review and qualify leads by score</p>
          </div>

          {/* Score summary cards */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { label: 'High Priority', value: leads.filter(l => l.score >= 60).length, color: '#065F46', bg: '#ECFDF5' },
              { label: 'Medium', value: leads.filter(l => l.score >= 30 && l.score < 60).length, color: '#92400E', bg: '#FFFBEB' },
              { label: 'Low', value: leads.filter(l => l.score < 30).length, color: '#374151', bg: '#F3F4F6' },
            ].map(card => (
              <div key={card.label} style={{ backgroundColor: card.bg, borderRadius: '8px', padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: card.color }}>{card.value}</div>
                <div style={{ fontSize: '11px', color: card.color, fontWeight: '500' }}>{card.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {['All', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                padding: '6px 14px', borderRadius: '6px', border: '1px solid',
                fontSize: '13px', cursor: 'pointer', fontWeight: filter === s ? '600' : '400',
                backgroundColor: filter === s ? '#2563EB' : '#FFFFFF',
                color: filter === s ? '#FFFFFF' : '#374151',
                borderColor: filter === s ? '#2563EB' : '#E5E7EB'
              }}>
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Company', 'Website', 'Email', 'Score', 'Issues Detected', 'Source', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Loading leads...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>No leads found</td></tr>
              ) : filtered.map((lead, i) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #F3F4F6', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '500', color: '#111827' }}>{lead.company || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <a href={lead.website} target="_blank" rel="noreferrer" style={{ color: '#2563EB', textDecoration: 'none', fontSize: '13px' }}>
                      {(lead.website || '').replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0] || '-'}
                    </a>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6B7280', fontSize: '13px' }}>{lead.email || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      backgroundColor: lead.score >= 60 ? '#ECFDF5' : lead.score >= 30 ? '#FFFBEB' : '#FEF2F2',
                      color: lead.score >= 60 ? '#065F46' : lead.score >= 30 ? '#92400E' : '#991B1B',
                      padding: '3px 10px', borderRadius: '999px', fontWeight: '700', fontSize: '13px'
                    }}>{lead.score}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6B7280', fontSize: '13px', maxWidth: '200px' }}>
                    {lead.enrichment?.[0]?.flagged_issues || '-'}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6B7280', fontSize: '13px' }}>{lead.source || '-'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                      style={{
                        padding: '5px 10px', borderRadius: '6px', border: '1px solid #E5E7EB',
                        fontSize: '13px', backgroundColor: STATUS_COLORS[lead.status]?.bg || '#F9FAFB',
                        color: STATUS_COLORS[lead.status]?.color || '#374151',
                        fontWeight: '500', cursor: 'pointer'
                      }}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
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