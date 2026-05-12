import { NextResponse } from 'next/server'

const BIN_URL = `https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN_ID}/latest`

export async function GET() {
  try {
    const res = await fetch(BIN_URL, {
      headers: { 'X-Access-Key': process.env.JSONBIN_API_KEY! },
      next: { revalidate: 60 },
    })
    if (!res.ok) return NextResponse.json([])
    const data = await res.json()
    return NextResponse.json(Array.isArray(data.record) ? data.record : [])
  } catch {
    return NextResponse.json([])
  }
}
