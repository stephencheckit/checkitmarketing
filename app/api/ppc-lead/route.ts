import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createPpcLead, initializePpcLeadsTable } from '@/lib/db';
import { syncContactToHubSpot } from '@/lib/hubspot';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializePpcLeadsTable();
    initialized = true;
  }
}

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Emails will not be sent.');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

async function sendConfirmationEmail(resend: Resend, to: string, firstName: string) {
  try {
    await resend.emails.send({
      from: 'Checkit <noreply@checkitv6.com>',
      to,
      subject: 'We Got Your Demo Request — Checkit',
      text: `Hi ${firstName},\n\nThank you for your interest in Checkit. We've received your demo request and a member of our team will be in touch within one business day.\n\nIn the meantime, if you have any questions, feel free to reply to this email.\n\nBest regards,\nThe Checkit Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e40af 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Checkit</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hi ${firstName},</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
              Thank you for your interest in Checkit. We've received your demo request and a member of our team will be in touch within <strong>one business day</strong>.
            </p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
              During the demo we'll walk you through how Checkit can help automate compliance, connect IoT sensors across your sites, and give you real-time operational visibility.
            </p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0;">
              In the meantime, if you have any questions, just reply to this email.
            </p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 24px 0 0;">
              Best regards,<br/>
              <strong style="color: #1e293b;">The Checkit Team</strong>
            </p>
          </div>
          <div style="padding: 16px; background: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} Checkit Ltd. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
}

async function sendInternalNotification(
  resend: Resend,
  lead: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    phone?: string;
    jobTitle?: string;
    source: string;
    listing: string;
    categoryName: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  }
) {
  try {
    const fullName = `${lead.firstName} ${lead.lastName}`;
    const sourceLabel = lead.source === 'linkedin' ? 'LinkedIn' : lead.source === 'capterra' ? 'Capterra' : lead.source === 'google' ? 'Google Ads' : lead.source;
    const headerColor = lead.source === 'linkedin' ? '#0a66c2' : lead.source === 'google' ? '#059669' : '#2563eb';
    await resend.emails.send({
      from: 'Checkit Market Hub <noreply@checkitv6.com>',
      to: 'stephen.newman@checkit.net',
      subject: `[${sourceLabel} Lead] ${lead.company} - ${fullName}`,
      text: `
New PPC Lead from ${sourceLabel}

Source: ${lead.source}
Listing: ${lead.categoryName}

Name: ${fullName}
Email: ${lead.email}
Company: ${lead.company}
Phone: ${lead.phone || 'Not provided'}
Job Title: ${lead.jobTitle || 'Not provided'}

Attribution:
  utm_source: ${lead.utm_source || '-'}
  utm_medium: ${lead.utm_medium || '-'}
  utm_campaign: ${lead.utm_campaign || '-'}

---
This lead has been saved to the PPC leads database.
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, ${headerColor} 100%); padding: 24px;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New ${sourceLabel} Lead</h1>
            <p style="color: #93c5fd; margin: 4px 0 0; font-size: 14px;">${lead.categoryName}</p>
          </div>
          <div style="padding: 24px; background: #ffffff; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 100px;">Name</td>
                <td style="padding: 8px 0; color: #111827;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${lead.email}" style="color: #2563eb;">${lead.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Company</td>
                <td style="padding: 8px 0; color: #111827;">${lead.company}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Phone</td>
                <td style="padding: 8px 0; color: #111827;">${lead.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Job Title</td>
                <td style="padding: 8px 0; color: #111827;">${lead.jobTitle || 'Not provided'}</td>
              </tr>
            </table>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-weight: 600; margin: 0 0 8px 0; font-size: 13px;">Attribution</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 4px 0; color: #9ca3af;">Source</td>
                  <td style="padding: 4px 0; color: #374151;">${lead.source}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #9ca3af;">Listing</td>
                  <td style="padding: 4px 0; color: #374151;">${lead.listing}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #9ca3af;">utm_source</td>
                  <td style="padding: 4px 0; color: #374151;">${lead.utm_source || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #9ca3af;">utm_medium</td>
                  <td style="padding: 4px 0; color: #374151;">${lead.utm_medium || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #9ca3af;">utm_campaign</td>
                  <td style="padding: 4px 0; color: #374151;">${lead.utm_campaign || '-'}</td>
                </tr>
              </table>
            </div>
          </div>
          <div style="padding: 16px; background: #f3f4f6; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This lead has been saved to the PPC leads database.
            </p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send PPC lead notification:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureInitialized();

    const body = await request.json();
    const {
      firstName, lastName, email, company, phone, jobTitle,
      source, listing, categoryName, pageUrl, referrer,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return NextResponse.json(
        { error: 'First name, last name, email, and company are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Save to database
    const lead = await createPpcLead({
      firstName,
      lastName,
      email,
      company,
      phone,
      jobTitle,
      source: source || 'capterra',
      listing: listing || '',
      categoryName: categoryName || '',
      pageUrl: pageUrl || '',
      referrer: referrer || '',
      utmSource: utm_source || '',
      utmMedium: utm_medium || '',
      utmCampaign: utm_campaign || '',
      utmContent: utm_content || '',
      utmTerm: utm_term || '',
    });

    // Send emails + sync to HubSpot in parallel
    const resend = getResendClient();
    const [, , hubspotResult] = await Promise.all([
      resend
        ? sendConfirmationEmail(resend, email, firstName)
        : Promise.resolve(false),
      resend
        ? sendInternalNotification(resend, {
            firstName, lastName, email, company, phone, jobTitle,
            source, listing, categoryName,
            utm_source, utm_medium, utm_campaign,
          })
        : Promise.resolve(false),
      syncContactToHubSpot({
        firstName, lastName, email, company, phone, jobTitle,
        source: source || 'capterra',
        listing: listing || '',
        categoryName: categoryName || '',
        pageUrl: pageUrl || '',
        utmSource: utm_source,
        utmMedium: utm_medium,
        utmCampaign: utm_campaign,
        utmContent: utm_content,
        utmTerm: utm_term,
      }),
    ]);

    return NextResponse.json({
      success: true,
      id: lead.id,
      hubspot: hubspotResult.success ? 'synced' : 'skipped',
      message: 'Lead submitted successfully',
    });
  } catch (error) {
    console.error('Error creating PPC lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 }
    );
  }
}
