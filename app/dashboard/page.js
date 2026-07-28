'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const router = useRouter()

  useEffect(() => { fetchStats() }, [])

  async function fetchStats() {
    const [{ data: leads }, { data: emails }] = await Promise.all([
      supabase.from('leads').select('status, score'),
      supabase.from('emails').select('type, replied')
    ])
    const l = leads || []
    const e = emails || []
    setStats({
      total: l.length,
      highPriority: l.filter(x => x.score >= 60).length,
      qualified: l.filter(x => x.status === 'Qualified').length,
      contacted: l.filter(x => x.status === 'Contacted').length,
      closedWon: l.filter(x => x.status === 'Closed Won').length,
      emailsSent: e.length,
    })
  }

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  const navItems = [
    { label: 'Leads', href: '/leads', icon: '👥', desc: 'View and qualify new leads' },
    { label: 'CRM', href: '/crm', icon: '📊', desc: 'Track deals through pipeline' },
    { label: 'Campaigns', href: '/campaigns', icon: '📢', desc: 'Manage outreach campaigns' },
    { label: 'Blacklist', href: '/blacklist', icon: '🚫', desc: 'Manage blocked emails' },
    { label: 'Reports', href: '/reports', icon: '📈', desc: 'View performance metrics' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 32px', display: 'flex', alignItems: 'center', height: '60px', gap: '32px' }}>
        <span style={{ fontWeight: '800', fontSize: '16px', color: '#111827' }}>HostPowr CRM</span>
        {['Dashboard','Leads','CRM','Campaigns','Blacklist','Reports'].map(item => (
          <a key={item} href={item === 'Dashboard' ? '/dashboard' : `/${item.toLowerCase()}`}
            style={{ fontSize: '14px', color: item === 'Dashboard' ? '#2563EB' : '#6B7280', textDecoration: 'none', fontWeight: item === 'Dashboard' ? '600' : '400' }}>{item}</a>
        ))}
        <button onClick={handleLogout} style={{ marginLeft: 'auto', fontSize: '13px', padding: '6px 16px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', cursor: 'pointer', color: '#6B7280' }}>Logout</button>
      </div>
      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>Welcome back 👋</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 32px' }}>HostPowr Admin Panel</p>
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { label: 'Total Leads', value: stats.total, color: '#1D4ED8', bg: '#EFF6FF' },
              { label: 'High Priority', value: stats.highPriority, color: '#065F46', bg: '#ECFDF5' },
              { label: 'Qualified', value: stats.qualified, color: '#6D28D9', bg: '#F5F3FF' },
              { label: 'Contacted', value: stats.contacted, color: '#0369A1', bg: '#F0F9FF' },
              { label: 'Closed Won', value: stats.closedWon, color: '#14532D', bg: '#F0FDF4' },
              { label: 'Emails Sent', value: stats.emailsSent, color: '#92400E', bg: '#FFFBEB' },
            ].map(card => (
              <div key={card.label} style={{ backgroundColor: card.bg, borderRadius: '12px', padding: '20px 24px' }}>
                <div style={{ fontSize: '13px', color: card.color, fontWeight: '600', marginBottom: '8px' }}>{card.label}</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>
        )}
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 16px' }}>Quick Access</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {navItems.map(item => (
            <a key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>{item.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}