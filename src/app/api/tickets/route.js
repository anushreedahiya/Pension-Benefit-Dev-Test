import { NextResponse } from 'next/server';
import { sendTicketEmail } from '@/lib/emailService';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, category, priority, message } = body || {};

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to DB
    const client = await clientPromise;
    const db = client.db();
    const now = new Date();
    const doc = {
      name,
      email,
      subject,
      category: category || 'General',
      priority: priority || 'Normal',
      message,
      status: 'Open',
      createdAt: now,
      updatedAt: now
    };
    const insertRes = await db.collection('tickets').insertOne(doc);

    // Send email to advisor
    await sendTicketEmail({ name, email, subject, category: doc.category, priority: doc.priority, message });

    return NextResponse.json({ success: true, id: insertRes.insertedId });
  } catch (err) {
    console.error('Ticket POST error:', err);
    return NextResponse.json({ error: 'Failed to submit ticket' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const tickets = await db
      .collection('tickets')
      .find({ email })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ tickets });
  } catch (err) {
    console.error('Ticket GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}
