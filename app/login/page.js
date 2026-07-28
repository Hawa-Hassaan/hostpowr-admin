'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError('Invalid username or password')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '48px', width: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>HostPowr</div>
          <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '6px' }}>Admin Panel — Authorized Access Only</div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Username</label>
          <input
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter username"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box', color: '#111827', backgroundColor: '#FFFFFF', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter password"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: error ? '1px solid #FCA5A5' : '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box', color: '#111827', backgroundColor: '#FFFFFF', outline: 'none' }}
          />
          {error && (
            <div style={{ fontSize: '13px', color: '#DC2626', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ⚠ {error}
            </div>
          )}
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', backgroundColor: loading ? '#93C5FD' : '#1D4ED8', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.3px' }}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>
      </div>
    </div>
  )
}