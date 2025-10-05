import { NextResponse } from 'next/server';
import { sendSignoutEmail } from '@/lib/emailService';

export async function POST(request) {
  try {
    const { email, userName } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Send signout email
    const result = await sendSignoutEmail(email, userName);
    
    return NextResponse.json({
      success: true,
      message: 'Signout email sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error sending signout email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send signout email', error: error.message },
      { status: 500 }
    );
  }
}
