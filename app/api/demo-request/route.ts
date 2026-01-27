import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createDemoRequest, getDemoRequests, initializeDemoRequestsTable } from '@/lib/db';

// Initialize table on first request
let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializeDemoRequestsTable();
    initialized = true;
  }
}

// Create Resend client
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Emails will not be sent.');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

// Send thank you email to the requester
async function sendThankYouEmail(resend: Resend, to: string, name: string) {
  try {
    await resend.emails.send({
      from: 'Checkit <noreply@checkitv6.com>',
      to: to,
      subject: 'Thank You for Your Demo Request - Checkit',
      text: `Hi ${name},\n\nThank you for your request. Our team will be in touch shortly to schedule your demo.\n\nBest regards,\nThe Checkit Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Checkit</h1>
          </div>
          <div style="padding: 32px; background: #f9fafb;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Thank you for your request. Our team will be in touch shortly to schedule your demo.
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 24px;">
              Best regards,<br/>
              <strong>The Checkit Team</strong>
            </p>
          </div>
          <div style="padding: 16px; background: #1f2937; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Checkit. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send thank you email:', error);
    return false;
  }
}

// Send internal notification email
async function sendInternalNotification(
  resend: Resend,
  demoRequest: {
    name: string;
    email: string;
    company: string;
    phone?: string;
    industry?: string;
    message?: string;
  }
) {
  try {
    await resend.emails.send({
      from: 'Checkit Market Hub <noreply@checkitv6.com>',
      to: 'stephen.newman@checkit.net',
      subject: `New Demo Request: ${demoRequest.company} - ${demoRequest.name}`,
      text: `
New Demo Request Received

Name: ${demoRequest.name}
Email: ${demoRequest.email}
Company: ${demoRequest.company}
Phone: ${demoRequest.phone || 'Not provided'}
Industry: ${demoRequest.industry || 'Not specified'}

Message:
${demoRequest.message || 'No message provided'}

---
This request has been saved to the Market Hub CRM.
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 24px;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Demo Request</h1>
          </div>
          <div style="padding: 24px; background: #ffffff; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 100px;">Name</td>
                <td style="padding: 8px 0; color: #111827;">${demoRequest.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email</td>
                <td style="padding: 8px 0; color: #111827;">
                  <a href="mailto:${demoRequest.email}" style="color: #2563eb;">${demoRequest.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Company</td>
                <td style="padding: 8px 0; color: #111827;">${demoRequest.company}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Phone</td>
                <td style="padding: 8px 0; color: #111827;">${demoRequest.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Industry</td>
                <td style="padding: 8px 0; color: #111827;">${demoRequest.industry || 'Not specified'}</td>
              </tr>
            </table>
            ${demoRequest.message ? `
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-weight: 600; margin: 0 0 8px 0;">Message</p>
                <p style="color: #111827; margin: 0; white-space: pre-wrap;">${demoRequest.message}</p>
              </div>
            ` : ''}
          </div>
          <div style="padding: 16px; background: #f3f4f6; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This request has been saved to the Market Hub CRM.
            </p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send internal notification:', error);
    return false;
  }
}

// POST - Create a new demo request
export async function POST(request: NextRequest) {
  try {
    await ensureInitialized();

    const body = await request.json();
    const { name, email, company, phone, industry, message, sourcePage } = body;

    // Validate required fields
    if (!name || !email || !company) {
      return NextResponse.json(
        { error: 'Name, email, and company are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Save to database
    const demoRequest = await createDemoRequest({
      name,
      email,
      company,
      phone,
      industry,
      message,
      sourcePage,
    });

    // Send emails if Resend is configured
    const resend = getResendClient();
    if (resend) {
      // Send both emails in parallel
      await Promise.all([
        sendThankYouEmail(resend, email, name),
        sendInternalNotification(resend, { name, email, company, phone, industry, message }),
      ]);
    }

    return NextResponse.json({
      success: true,
      id: demoRequest.id,
      message: 'Demo request submitted successfully',
    });
  } catch (error) {
    console.error('Error creating demo request:', error);
    return NextResponse.json(
      { error: 'Failed to submit demo request' },
      { status: 500 }
    );
  }
}

// GET - Get all demo requests (for admin/CRM view)
export async function GET(request: NextRequest) {
  try {
    await ensureInitialized();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const requests = await getDemoRequests({
      status: status || undefined,
      limit,
      offset,
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo requests' },
      { status: 500 }
    );
  }
}
