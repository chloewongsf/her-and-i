import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const FILE = join(process.cwd(), 'data', 'letters.json')

export async function GET() {
  try {
    const letters = JSON.parse(readFileSync(FILE, 'utf-8'))
    return NextResponse.json(letters)
  } catch {
    return NextResponse.json([])
  }
}
