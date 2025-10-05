import { NextResponse } from 'next/server';
import { sendSigninEmail } from '@/lib/emailService';

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

    // Send signin email
    const result = await sendSigninEmail(email, userName);

    return NextResponse.json({
      success: true,
      message: 'Signin email sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error sending signin email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send signin email', error: error.message },
      { status: 500 }
    );
  }
}



// import { NextResponse } from 'next/server';
// import { sendSigninEmail } from '@/lib/emailService';

// export async function POST(request) {
//   try {
//     const { email, userName } = await request.json();
    
//     if (!email) {
//       return NextResponse.json(
//         { success: false, message: 'Email is required' },
//         { status: 400 }
//       );
//     }

//     // Send signin email
//     const result = await sendSigninEmail(email, userName);
    
//     return NextResponse.json({
//       success: true,
//       message: 'Signin email sent successfully',
//       messageId: result.messageId
//     });
//   } catch (error) {
//     console.error('Error sending signin email:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to send signin email', error: error.message },
//       { status: 500 }
//     );
//   }
// }
