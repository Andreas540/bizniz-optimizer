import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { sessionId, company, users, modules, totalMonthly } = await req.json();

    const toEmail = process.env.ORDER_NOTIFICATION_EMAIL;

    // Modules summary
    const modulesHTML = modules.map(m =>
      `<tr>
        <td style="padding:6px 12px;border-bottom:1px solid #e0eaf0;">${m.name}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e0eaf0;text-align:center;">${m.users}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e0eaf0;text-align:right;">$${m.cost.toFixed(2)}/mo</td>
      </tr>`
    ).join('');

    // Users with module assignments
    const usersHTML = users.map((u, i) =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e0eaf0;vertical-align:top;">User ${i + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e0eaf0;vertical-align:top;">${u.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e0eaf0;vertical-align:top;">${u.email}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e0eaf0;vertical-align:top;font-size:12px;color:#0b4a63;">
          ${(u.modules || []).join('<br/>')}
        </td>
      </tr>`
    ).join('');

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#0a0a0a;">
        <div style="background:#0b4a63;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:20px;">Account Setup — Bizniz Optimizer</h1>
        </div>
        <div style="background:#f0f8ff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #c2dff0;">

          <h2 style="font-size:16px;margin:0 0 4px;">Company</h2>
          <p style="margin:0 0 20px;font-size:18px;font-weight:700;color:#0b4a63;">${company}</p>

          <h2 style="font-size:16px;margin:0 0 8px;">Modules ordered</h2>
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

          <h2 style="font-size:16px;margin:0 0 8px;">Users &amp; module access</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#fff;border-radius:6px;overflow:hidden;">
            <thead>
              <tr style="background:#0b4a63;color:#fff;">
                <th style="padding:8px 12px;text-align:left;">#</th>
                <th style="padding:8px 12px;text-align:left;">Name</th>
                <th style="padding:8px 12px;text-align:left;">Email</th>
                <th style="padding:8px 12px;text-align:left;">Modules</th>
              </tr>
            </thead>
            <tbody>${usersHTML}</tbody>
          </table>

          <p style="font-size:12px;color:#666;margin:0;">
            Stripe Session ID: <code>${sessionId}</code>
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'orders@biznizoptimizer.com',
      to:   toEmail,
      subject: `Account setup received: ${company} — $${Number(totalMonthly).toFixed(2)}/mo`,
      html,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Notification error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}