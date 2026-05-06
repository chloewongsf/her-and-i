import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const FILE = join(process.cwd(), 'data', 'letters.json')

function readLetters() {
  try {
    return JSON.parse(readFileSync(FILE, 'utf-8')) as object[]
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const { body, closing, category } = await req.json()

    if (!body || !closing) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const letter = {
      id: `pub-${Date.now()}`,
      body,
      closing,
      category: category ?? 'to someone, somewhere',
      timestamp: 'just now',
      frame: 'none',
    }

    const letters = readLetters()
    letters.unshift(letter)
    writeFileSync(FILE, JSON.stringify(letters, null, 2))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/publish]', err)
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 })
  }
}
