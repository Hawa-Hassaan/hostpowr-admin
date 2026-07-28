import { NextResponse } from 'next/server'

export async function POST(request) {
  const { username, password } = await request.json()

  const validUsername = process.env.ADMIN_USERNAME
  const validPassword = process.env.ADMIN_PASSWORD

  if (username === validUsername && password === validPassword) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('hp_auth', 'true', {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    return response
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}