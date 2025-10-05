import nodemailer from 'nodemailer';

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shardulkacheria@gmail.com',
    pass: 'gfon snzd sqdx gawg' // App password
  },
  secure: true,
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Transporter is ready to send emails');
  }
});

// Email templates
const emailTemplates = {
  signup: {
    subject: 'Welcome to Pension Planner Pro! 🎉',
    html: (userName, email) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Pension Planner Pro!</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello ${userName || 'there'}! 👋</h2>
          
          <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
            Thank you for signing up with Pension Planner Pro! We're excited to help you plan your financial future.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #1f2937; margin-top: 0;">What you can do now:</h3>
            <ul style="color: #4b5563; line-height: 1.8;">
              <li>📊 Calculate your pension benefits</li>
              <li>🔍 Compare different pension schemes</li>
              <li>🤖 Get AI-powered financial advice</li>
              <li>📈 Track your retirement planning progress</li>
            </ul>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            If you have any questions or need assistance, feel free to reach out to our support team.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
               style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This email was sent to ${email}. If you didn't create this account, please ignore this email.
          </p>
        </div>
      </div>
    `
  },
  
  signin: {
    subject: 'Welcome back to Pension Planner Pro! 👋',
    html: (userName, email, loginTime) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome Back!</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello ${userName || 'there'}! 👋</h2>
          
          <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
            We're glad to see you back! You've successfully signed in to your Pension Planner Pro account.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1f2937; margin-top: 0;">Login Details:</h3>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Time:</strong> ${loginTime}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>IP Address:</strong> [Protected for security]</p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            If this wasn't you, please contact our support team immediately and consider changing your password.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
               style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Continue to Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This email was sent to ${email}. If you didn't sign in to your account, please contact support immediately.
          </p>
        </div>
      </div>
    `
  },
  
  signout: {
    subject: 'You have been signed out of Pension Planner Pro',
    html: (userName, email, logoutTime) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6b7280, #4b5563); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Signed Out Successfully</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello ${userName || 'there'}! 👋</h2>
          
          <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
            You have been successfully signed out of your Pension Planner Pro account.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6b7280;">
            <h3 style="color: #1f2937; margin-top: 0;">Sign Out Details:</h3>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Time:</strong> ${logoutTime}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Session:</strong> Terminated</p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Your session has been securely terminated. If you'd like to access your account again, you'll need to sign in.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
               style="background: #6b7280; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Sign In Again
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This email was sent to ${email}. If you didn't sign out of your account, please contact support immediately.
          </p>
        </div>
      </div>
    `
  }
};

// Function to send email
export async function sendEmail(to, templateName, data = {}) {
  try {
    console.log('Starting email send process...');
    console.log('To:', to);
    console.log('Template:', templateName);
    console.log('Data:', data);
    
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const { userName, email, loginTime, logoutTime } = data;
    
    const mailOptions = {
      from: 'shardulkacheria@gmail.com',
      to: to,
      subject: template.subject,
      html: template.html(userName, email, loginTime || logoutTime)
    };

    console.log('Mail options prepared:', { from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject });

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw error;
  }
}

// Specific functions for each authentication event
export async function sendSignupEmail(email, userName) {
  return await sendEmail(email, 'signup', { userName, email });
}

export async function sendSigninEmail(email, userName) {
  const loginTime = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return await sendEmail(email, 'signin', { userName, email, loginTime });
}

export async function sendSignoutEmail(email, userName) {
  const logoutTime = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return await sendEmail(email, 'signout', { userName, email, logoutTime });
}

// Support ticket email
export async function sendTicketEmail(ticket) {
  const {
    name,
    email,
    subject,
    category,
    priority,
    message
  } = ticket;

  const advisorEmail = 'shardulkacheria@gmail.com';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #10b981); padding: 18px 24px; border-radius: 10px; color: white;">
        <h2 style="margin: 0;">New Support Ticket</h2>
        <p style="margin: 6px 0 0 0;">Category: <strong>${category}</strong> • Priority: <strong>${priority}</strong></p>
      </div>
      <div style="background:#f9fafb; padding: 24px; border-radius: 0 0 10px 10px;">
        <p style="margin: 0 0 8px 0; color:#111827;"><strong>From:</strong> ${name} (${email})</p>
        <p style="margin: 0 0 8px 0; color:#111827;"><strong>Subject:</strong> ${subject}</p>
        <div style="background:#ffffff; border-left: 4px solid #0ea5e9; padding:16px; border-radius:8px; margin-top: 12px;">
          <p style="margin:0; white-space:pre-line; color:#111827;">${message}</p>
        </div>
        <p style="margin-top: 16px; color:#374151; font-size: 13px;">Reply to this email to respond directly to the user.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: 'Pension Planner Pro Tickets <shardulkacheria@gmail.com>',
    to: advisorEmail,
    replyTo: email,
    subject: `New Support Ticket: [${category}] ${subject} (${priority})`,
    html
  };

  const result = await transporter.sendMail(mailOptions);
  return { success: true, messageId: result.messageId };
}