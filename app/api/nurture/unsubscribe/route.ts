import { NextRequest, NextResponse } from 'next/server';
import {
  initializeNurtureTables,
  parseUnsubscribeToken,
  getEnrollment,
  updateEnrollmentStatus,
  addToSuppression,
} from '@/lib/nurture-db';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializeNurtureTables();
    initialized = true;
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureInitialized();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return new NextResponse(buildHtml('Invalid Link', 'This unsubscribe link is invalid.'), {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const parsed = parseUnsubscribeToken(token);
    if (!parsed) {
      return new NextResponse(buildHtml('Invalid Link', 'This unsubscribe link is invalid or expired.'), {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const enrollment = await getEnrollment(parsed.enrollmentId);
    if (!enrollment || enrollment.contact_email !== parsed.email) {
      return new NextResponse(buildHtml('Not Found', 'This subscription was not found.'), {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (enrollment.status === 'unsubscribed') {
      return new NextResponse(
        buildHtml('Already Unsubscribed', 'You have already been unsubscribed from these emails.'),
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      );
    }

    await updateEnrollmentStatus(enrollment.id, 'unsubscribed');
    await addToSuppression(enrollment.contact_email, 'unsubscribed');

    return new NextResponse(
      buildHtml(
        'Unsubscribed',
        'You have been successfully unsubscribed. You will no longer receive nurture emails from Checkit.'
      ),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new NextResponse(
      buildHtml('Error', 'Something went wrong. Please try again or contact us directly.'),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Also handle POST for List-Unsubscribe-Post one-click
export async function POST(request: NextRequest) {
  return GET(request);
}

function buildHtml(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Checkit</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px; }
    .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { color: #1e3a5f; font-size: 22px; margin-bottom: 12px; }
    p { color: #6b7280; font-size: 15px; line-height: 1.6; }
    .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Checkit</div>
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
