import { NextResponse } from 'next/server';
import { sendSignupEmail } from '@/lib/emailService';

export async function POST(request) {
  try {
    const { email, userName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP credentials are missing in environment variables');
    }

    // Send signup email
    const result = await sendSignupEmail(email, userName);

    return NextResponse.json({
      success: true,
      message: 'Signup email sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error sending signup email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send signup email', error: error.message },
      { status: 500 }
    );
  }
}



// import { NextResponse } from 'next/server';
// import { sendSignupEmail } from '@/lib/emailService';

// export async function POST(request) {
//   try {
//     const { email, userName } = await request.json();
    
//     if (!email) {
//       return NextResponse.json(
//         { success: false, message: 'Email is required' },
//         { status: 400 }
//       );
//     }

//     // Send signup email
//     const result = await sendSignupEmail(email, userName);
    
//     return NextResponse.json({
//       success: true,
//       message: 'Signup email sent successfully',
//       messageId: result.messageId
//     });
//   } catch (error) {
//     console.error('Error sending signup email:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to send signup email', error: error.message },
//       { status: 500 }
//     );
//   }
// }
