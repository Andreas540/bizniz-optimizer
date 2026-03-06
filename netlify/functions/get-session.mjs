import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Missing session_id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const modules = JSON.parse(session.metadata?.modules || '[]');
    const totalMonthly = parseFloat(session.metadata?.totalMonthly || '0');

    // Send Email 1 — immediate purchase notification
    const toEmail = process.env.ORDER_NOTIFICATION_EMAIL;

    const modulesHTML = modules.map(m =>
      `<tr>
        <td style="padding:6px 12px;border-bottom:1px solid #e0eaf0;">${m.name}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e0eaf0;text-align:center;">${m.users}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e0eaf0;text-align:right;">$${m.cost.toFixed(2)}/mo</td>
      </tr>`
    ).join('');

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#0a0a0a;">
        <div style="background:#0b4a63;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:20px;">New Purchase — Bizniz Optimizer</h1>
        </div>
        <div style="background:#f0f8ff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #c2dff0;">
          <p style="margin:0 0 20px;font-size:14px;color:#555;">
            A customer has completed payment. Account setup may or may not be completed — follow up if needed.
          </p>
          <h2 style="font-size:16px;margin:0 0 8px;">Modules purchased</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#fff;border-radius:6px;overflow:hidden;">
            <thead>
              <tr style="background:#0b4a63;color:#fff;">
                <th style="padding:8px 12px;text-align:left;">Module</th>
                <th style="padding:8px 12px;text-align:center;">Users</th>
                <th style="padding:8px 12px;text-align:right;">Cost</th>
              </tr>
            </thead>
            <tbody>${modulesHTML}</tbody>
            <tfoot>
              <tr style="font-weight:700;">
                <td colspan="2" style="padding:8px 12px;">Total</td>
                <td style="padding:8px 12px;text-align:right;">$${Number(totalMonthly).toFixed(2)}/mo</td>
              </tr>
            </tfoot>
          </table>
          <p style="font-size:12px;color:#666;margin:0;">
            Stripe Session ID: <code>${sessionId}</code><br/>
            Stripe Customer ID: <code>${session.customer || 'not available'}</code><br/>
            Customer email: <code>${session.customer_details?.email || 'not available'}</code>
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'orders@biznizoptimizer.com',
      to: toEmail,
      subject: `New purchase — $${Number(totalMonthly).toFixed(2)}/mo — account setup pending`,
      html,
    });

    return new Response(JSON.stringify({ modules, totalMonthly, customerId: session.customer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}