import { NextResponse } from 'next/server';
import { sendSignupEmail, sendSigninEmail, sendSignoutEmail } from '@/lib/emailService';

export async function POST(request) {
  try {
    const { email, testType = 'signup' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP credentials are missing in environment variables');
    }

    const testUserName = 'Test User';
    let result;

    switch (testType.toLowerCase()) {
      case 'signup':
        result = await sendSignupEmail(email, testUserName);
        break;
      case 'signin':
        result = await sendSigninEmail(email, testUserName);
        break;
      case 'signout':
        result = await sendSignoutEmail(email, testUserName);
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid test type. Use signup, signin, or signout' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${testType} test email sent successfully`,
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send test email', error: error.message },
      { status: 500 }
    );
  }
}




// import { NextResponse } from 'next/server';
// import { sendSignupEmail, sendSigninEmail, sendSignoutEmail } from '@/lib/emailService';

// export async function POST(request) {
//   try {
//     const { email, testType = 'signup' } = await request.json();
    
//     if (!email) {
//       return NextResponse.json(
//         { success: false, message: 'Email is required' },
//         { status: 400 }
//       );
//     }

//     let result;
//     const testUserName = 'Test User';

//     switch (testType) {
//       case 'signup':
//         result = await sendSignupEmail(email, testUserName);
//         break;
//       case 'signin':
//         result = await sendSigninEmail(email, testUserName);
//         break;
//       case 'signout':
//         result = await sendSignoutEmail(email, testUserName);
//         break;
//       default:
//         return NextResponse.json(
//           { success: false, message: 'Invalid test type. Use signup, signin, or signout' },
//           { status: 400 }
//         );
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: `${testType} test email sent successfully`,
//       messageId: result.messageId
//     });
//   } catch (error) {
//     console.error('Error sending test email:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to send test email', error: error.message },
//       { status: 500 }
//     );
//   }
// }
