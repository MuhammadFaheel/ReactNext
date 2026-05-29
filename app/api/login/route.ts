import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('email', email)
      .input('password', password)
      .query('SELECT * FROM [NFA].[dbo].[User] WHERE Email = @email AND Password = @password');

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: result.recordset[0] });
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}