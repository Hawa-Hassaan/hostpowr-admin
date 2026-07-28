'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ReportsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  async function fetchStats() {
    setLoading(true)
    const [{ data: leads }, { data: emails }] = await Promise.all([
      supabase.from('leads').select('status, score, source, country'),
      supabase.from('emails').select('type, sent_at, opened_at, replied')
    ])
    const l = leads || []
    const e = emails || []
    setStats({
      total: l.length,
      qualified: l.filter(x => x.status === 'Qualified').length,
      contacted: l.filter(x => x.status === 'Contacted').length,
      replied: l.filter(x => x.status === 'Replied').length,
      closedWon: l.filter(x => x.status === 'Closed Won').length,
      closedLost: l.filter(x => x.status === 'Closed Lost').length,
      highPriority: l.filter(x => x.score >= 60).length,
      emailsSent: e.length,
      emailsOpened: e.filter(x => x.opened_at).length,
      emailsReplied: e.filter(x => x.replied).length,
      bySource: l.reduce((acc, x) => { acc[x.source] = (acc[x.source] || 0) + 1; return acc }, {}),
      byStatus: l.reduce((acc, x) => { acc[x.status] = (acc[x.status] || 0) + 1; return acc }, {}),
    })
    setLoading(false)
  }

  const pct = (a, b) => b === 0 ? '0%' : Math.round(a / b * 100) + '%'

  const Card = ({ label, value, sub, color }) => (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: '700', color: color || '#111827' }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{sub}</div>}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 32px', display: 'flex', alignItems: 'center', height: '60px', gap: '32px' }}>
        <span style={{ fontWeight: '700', fontSize: '16px', color: '#111827' }}>HostPowr CRM</span>
        {['Leads', 'CRM', 'Campaigns', 'Blacklist', 'Reports'].map(item => (
          <a key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: '14px', color: item === 'Reports' ? '#2563EB' : '#6B7280', textDecoration: 'none', fontWeight: item === 'Reports' ? '600' : '400' }}>{item}</a>
        ))}
      </div>
      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>Reports</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px' }}>System-wide metrics and performance</p>

        {loading ? <p style={{ color: '#9CA3AF' }}>Loading stats...</p> : !stats ? null : (
          <>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#374151', margin: '0 0 12px' }}>Lead Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '28px' }}>
              <Card label="Total Leads" value={stats.total} />
              <Card label="High Priority" value={stats.highPriority} sub="Score ≥ 60" color="#065F46" />
              <Card label="Qualified" value={stats.qualified} color="#1D4ED8" />
              <Card label="Contacted" value={stats.contacted} color="#6D28D9" />
              <Card label="Closed Won" value={stats.closedWon} color="#14532D" />
              <Card label="Closed Lost" value={stats.closedLost} color="#991B1B" />
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#374151', margin: '0 0 12px' }}>Email Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '28px' }}>
              <Card label="Emails Sent" value={stats.emailsSent} />
              <Card label="Opened" value={stats.emailsOpened} sub={pct(stats.emailsOpened, stats.emailsSent) + ' open rate'} color="#1D4ED8" />
              <Card label="Replied" value={stats.emailsReplied} sub={pct(stats.emailsReplied, stats.emailsSent) + ' reply rate'} color="#065F46" />
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#374151', margin: '0 0 12px' }}>Leads by Status</h3>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', marginBottom: '28px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Count</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.byStatus).map(([status, count]) => (
                    <tr key={status} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 16px', color: '#111827', fontWeight: '500' }}>{status}</td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>{count}</td>
                      <td style={{ padding: '12px 16px', color: '#6B7280' }}>{pct(count, stats.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}