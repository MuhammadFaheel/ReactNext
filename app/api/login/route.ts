import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/data-source';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log('Login attempt:', email);

    const pool = await getDataSource();
    const result = await pool.request()
      .input('email', email)
      .input('password', password)
      .query('SELECT * FROM [dbo].[User] WHERE Email = @email AND Password = @password');

    console.log('User found:', result.recordset.length);

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: result.recordset[0] });
  } catch (err) {
    console.error('DB error:', String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}