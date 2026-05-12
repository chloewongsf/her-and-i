import { NextRequest, NextResponse } from 'next/server'

const BIN_URL = `https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN_ID}`
const HEADERS = {
  'Content-Type': 'application/json',
  'X-Access-Key': process.env.JSONBIN_API_KEY!,
}

export async function POST(req: NextRequest) {
  try {
    const { body, closing, category } = await req.json()

    if (!body || !closing) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Read current letters
    const getRes = await fetch(`${BIN_URL}/latest`, { headers: HEADERS })
    const current = getRes.ok ? await getRes.json() : { record: [] }
    const letters = Array.isArray(current.record) ? current.record : []

    const letter = {
      id: `pub-${Date.now()}`,
      body,
      closing,
      category: category ?? 'recognition',
      timestamp: new Date().toISOString(),
      frame: 'none',
    }

    // Prepend and write back
    await fetch(BIN_URL, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify([letter, ...letters]),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/publish]', err)
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 })
  }
}
