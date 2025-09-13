import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    const client = await pool.connect();

    const result = await client.query(
      'SELECT * FROM notes WHERE lesson_id = $1 ORDER BY created_at DESC',
      [lessonId]
    );

    client.release();

    return NextResponse.json({ notes: result.rows });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { lessonId, selectedText, noteContent, positionData } = await request.json();

    if (!lessonId || !selectedText || !noteContent) {
      return NextResponse.json({
        error: 'Lesson ID, selected text, and note content are required'
      }, { status: 400 });
    }

    const client = await pool.connect();

    const result = await client.query(
      'INSERT INTO notes (lesson_id, selected_text, note_content, position_data) VALUES ($1, $2, $3, $4) RETURNING *',
      [lessonId, selectedText, noteContent, positionData]
    );

    client.release();

    return NextResponse.json({ note: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { noteId, noteContent } = await request.json();

    if (!noteId || !noteContent) {
      return NextResponse.json({
        error: 'Note ID and content are required'
      }, { status: 400 });
    }

    const client = await pool.connect();

    const result = await client.query(
      'UPDATE notes SET note_content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [noteContent, noteId]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ note: result.rows[0] });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('noteId');

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }

    const client = await pool.connect();

    const result = await client.query(
      'DELETE FROM notes WHERE id = $1 RETURNING id',
      [noteId]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}