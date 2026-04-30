/* Acronis MSP Platform — Guided Flow Engine */

// ── PASSWORD GATE ───────────────────────────────────────────────

const GATE_PASSWORD = 'psarmm2026';

function checkPassword() {
  const input = document.getElementById('gate-input');
  if (input.value.toLowerCase() === GATE_PASSWORD) {
    document.getElementById('gate-screen').style.display = 'none';
    showAdventureScreen();
  } else {
    input.classList.remove('shake');
    void input.offsetWidth; // reflow to restart animation
    input.classList.add('shake');
    input.value = '';
    setTimeout(() => input.classList.remove('shake'), 400);
  }
}

document.getElementById('gate-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkPassword();
});

// ── ADVENTURE SCREEN ────────────────────────────────────────────

function showAdventureScreen() {
  document.getElementById('adventure-screen').style.display = 'flex';
  document.getElementById('flow-bar').style.display = 'none';
  document.getElementById('flow-overlay').style.display = 'none';
  document.getElementById('back-pill').style.display = 'none';
  document.querySelector('.content').style.paddingBottom = '';
  activeFlow = null;
  resetAllFlowState();
}

function enterFreeExplore() {
  document.getElementById('adventure-screen').style.display = 'none';
  document.getElementById('flow-overlay').style.display = 'none';
  document.getElementById('flow-bar').style.display = 'none';
  document.querySelector('.content').style.paddingBottom = '';
  document.getElementById('back-pill').style.display = 'block';
  activeFlow = null;
  navigate('clients');
}

// ── FLOW ENGINE ─────────────────────────────────────────────────

let activeFlow = null;
let currentStepIndex = 0;

function startFlow(flowName) {
  document.getElementById('adventure-screen').style.display = 'none';
  activeFlow = flowName;
  currentStepIndex = 0;
  renderStep();
}

function flowNext() {
  const steps = getFlowSteps();
  if (currentStepIndex < steps.length - 1) {
    currentStepIndex++;
    renderStep();
  }
}

function flowBack() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderStep();
  } else {
    showAdventureScreen();
  }
}

function renderStep() {
  const steps = getFlowSteps();
  const step = steps[currentStepIndex];
  const total = steps.length;

  // Always close the ticket drawer when advancing steps
  const drawer = document.getElementById('ticket-drawer');
  const drawerOverlay = document.getElementById('ticket-drawer-overlay');
  if (drawer) drawer.style.display = 'none';
  if (drawerOverlay) drawerOverlay.style.display = 'none';

  if (step.isOverlay) {
    showFlowOverlay(step);
    document.getElementById('flow-bar').style.display = 'none';
  } else {
    document.getElementById('flow-overlay').style.display = 'none';
    document.getElementById('flow-bar').style.display = 'block';
    // Pad body so content isn't hidden behind the bar
    document.querySelector('.content').style.paddingBottom = '80px';

    // Update narration
    document.getElementById('flow-narration').textContent = step.narration;

    // Update dots
    const dotsEl = document.getElementById('flow-dots');
    const nonOverlaySteps = steps.filter(s => !s.isOverlay);
    const nonOverlayIndex = steps.slice(0, currentStepIndex + 1).filter(s => !s.isOverlay).length - 1;
    dotsEl.innerHTML = nonOverlaySteps.map((_, i) => {
      const cls = i < nonOverlayIndex ? 'flow-dot visited' : i === nonOverlayIndex ? 'flow-dot current' : 'flow-dot';
      return `<div class="${cls}"></div>`;
    }).join('');

    // Back button
    document.getElementById('flow-back-btn').disabled = false;

    // Navigate to the right panel
    if (step.panel) navigate(step.panel);

    // Apply tab state
    if (step.tab) {
      setTimeout(() => activateTab(step.tab), 50);
    }
    if (step.ctab) {
      setTimeout(() => activateCtab(step.ctab), 80);
    }
  }

  // Run step-specific side effects
  if (step.onEnter) step.onEnter();
}

function showFlowOverlay(step) {
  const overlay = document.getElementById('flow-overlay');
  const card = document.getElementById('flow-overlay-card');

  const isOutro = step.overlayType === 'outro';
  const tag = isOutro
    ? ({ execution: 'Execution', scaling: 'Scaling', expansion: 'Expansion' })[activeFlow]
    : '';

  let actionsHtml = '';
  if (step.overlayType === 'intro') {
    actionsHtml = `<button class="btn btn-primary" style="min-width:160px;justify-content:center" onclick="flowNext()">Let's go →</button>`;
  } else if (step.overlayType === 'outro') {
    actionsHtml = `
      <button class="btn btn-primary" onclick="showAdventureScreen()">← Try another flow</button>
      <button class="btn btn-secondary" onclick="enterFreeExplore()">Explore the platform →</button>
    `;
  }

  card.innerHTML = `
    ${tag ? `<div class="flow-overlay-tag">${tag}</div>` : ''}
    <div class="flow-overlay-headline">${step.headline}</div>
    ${step.body ? `<div class="flow-overlay-body">${step.body}</div>` : ''}
    <div class="flow-overlay-actions">${actionsHtml}</div>
  `;

  overlay.style.display = 'flex';
}

function getFlowSteps() {
  if (activeFlow === 'execution') return FLOW_EXECUTION;
  if (activeFlow === 'scaling')   return FLOW_SCALING;
  if (activeFlow === 'expansion') return FLOW_EXPANSION;
  return [];
}

// ── TAB HELPERS ─────────────────────────────────────────────────

function activateTab(tabName) {
  const panel = document.getElementById('panel-device-detail');
  if (!panel) return;
  const tabs = panel.querySelectorAll('#device-tabs .tab-btn');
  tabs.forEach(btn => {
    const active = btn.dataset.tab === tabName;
    btn.classList.toggle('active', active);
  });
  panel.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === `tab-${tabName}`);
  });
}

function activateCtab(ctabName) {
  const allCtabs = document.querySelectorAll('#controls-tabs .tab-btn');
  allCtabs.forEach(btn => btn.classList.toggle('active', btn.dataset.ctab === ctabName));
  document.querySelectorAll('#tab-controls > [id^="ctab-"]').forEach(p => {
    p.style.display = p.id === `ctab-${ctabName}` ? 'block' : 'none';
  });
}

// ── FLOW STATE HELPERS ───────────────────────────────────────────

// Capture the quotes panel's default HTML on first load so reset can restore it
let _quotesDefaultHTML = null;
document.addEventListener('DOMContentLoaded', () => {
  const qb = document.getElementById('quotes-body');
  if (qb) _quotesDefaultHTML = qb.innerHTML;
});

function resetAllFlowState() {
  // Flow 1 resets
  ['flow1-billing-row','flow1-report-card','flow1-note-draft','flow1-time-note'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  // Restore TKT-0035 to In Progress if it was resolved during the flow
  const tkt35 = TICKETS.find(t => t.id === 'TKT-0035');
  if (tkt35 && tkt35.status === 'resolved') {
    tkt35.status = 'in-progress';
    tkt35.activity = tkt35.activity.filter(a => a.title !== 'Moved to Resolved');
    delete tkt35.resolvedAt;
  }

  // Flow 2 resets
  document.getElementById('xdr-modal').style.display = 'none';
  if (_quotesDefaultHTML !== null) {
    document.getElementById('quotes-body').innerHTML = _quotesDefaultHTML;
  }
  restorePoliciesXdrRow();
  restoreContractsXdrRows();

  // Flow 3 resets
  document.getElementById('lead-inbox').style.display = 'none';
  document.getElementById('triggered-sequences').style.display = 'none';
  restoreContractsSunriseRow();
  // Hide TKT-0043 — only visible during Flow 3
  const tkt43 = TICKETS.find(t => t.id === 'TKT-0043');
  if (tkt43) tkt43.status = '_hidden';

  // Close any open ticket drawer
  closeTicketDrawer();

  // Content padding
  document.querySelector('.content').style.paddingBottom = '';
}

// ── FLOW 1: EXECUTION ───────────────────────────────────────────

const FLOW_EXECUTION = [
  // Step 0 — Intro
  {
    isOverlay: true,
    overlayType: 'intro',
    headline: "It's 7:14 AM.\nAlex's phone buzzes, it's Slack. A device at Metro Auto Group is critical and backup failed last night.",
    body: "Here's how he handles this before the client's office opens.",
  },
  // Step 1 — Tickets board: TKT-0035 already In Progress
  {
    panel: 'tickets',
    narration: "Alex starts his morning at the Tickets board. TKT-0035 is already In Progress from his acknowledgement in Slack. He clicks it to see the full picture.",
    onEnter: flow1ShowTicketsTriage,
  },
  // Step 2 — Ticket drawer open
  {
    panel: 'tickets',
    narration: "The ticket has the full story — when it triggered, what was found, what's been done so far. The device link takes him directly to WIN-SERVICE-01.",
    onEnter: flow1OpenTKT0035Drawer,
  },
  // Step 3 — Device detail: dashboard
  {
    panel: 'device/303',
    tab: 'dashboard',
    narration: 'The dashboard confirms everything in the ticket — CPU maxed, memory maxed, disk critical, backup missed. No log diving. Alex already knows what he\'s dealing with.',
    onEnter: flow1InjectBackupMissed,
  },
  // Step 4 — Controls: terminal
  {
    panel: 'device/303',
    tab: 'controls',
    ctab: 'terminal',
    narration: 'Remote terminal confirms it. QuickBooks database process has been consuming CPU for hours. Alex identifies the root cause without driving to the client site.',
    onEnter: flow1InjectTerminalOutput,
  },
  // Step 5 — Controls: automation
  {
    panel: 'device/303',
    tab: 'controls',
    ctab: 'automation',
    narration: 'The automation to handle exactly this scenario already exists — it was just at 88% instead of 90% and hadn\'t fired yet. Alex triggers it manually. No scripting. No remote session tool. The platform runs it.',
    onEnter: flow1ShowRunNow,
  },
  // Step 6 — Notes log: AI-drafted note
  {
    panel: 'device/303',
    tab: 'notes',
    narration: 'The platform drafts the device-level incident note from what just happened. Alex reviews it, makes one edit, saves. The device log is clean. Now he closes the loop on the ticket.',
    onEnter: flow1InjectDraftNote,
  },
  // Step 7 — Back to tickets: drag prompt
  {
    panel: 'tickets',
    narration: "Alex drags TKT-0035 to the Resolved column. Before it moves, the platform prompts for a close note — already written. He confirms.",
    onEnter: flow1ShowDragPrompt,
  },
  // Step 8 — Drag-note modal auto-shows (modal IS the UI; confirm auto-advances)
  {
    panel: 'tickets',
    narration: 'One final line of documentation — already drafted. Alex edits a word and confirms. The ticket closes, the activity log is complete, every step is on record.',
    onEnter: flow1ShowResolveModal,
  },
  // Step 9 — Billing: incident captured
  {
    panel: 'billing',
    narration: 'The platform logs the time against Metro Auto\'s next upcoming invoice — no dollar amount applied automatically since they are under contract. It\'s also queued for the next monthly health report so the client sees that problems get caught before they cause downtime.',
    onEnter: flow1InjectBillingRow,
  },
  // Step 10 — Outro
  {
    isOverlay: true,
    overlayType: 'outro',
    headline: "Alert in. Ticket open. Problem solved. Ticket closed.\nBefore 8 AM. Before the client noticed.",
    body: 'Remote diagnosis, automated remediation, device documentation, ticket lifecycle, billing capture — without a second tool, a manual report, or a drive to the client site.<br><br>The work is visible. The record is complete. The client will see it in their next monthly report.<br><br><em>This is what "Deliver IT. Remotely. Reliably." and "Run the Business, Not the Paperwork" looks like in practice.</em>',
  },
];

function flow1ShowTicketsTriage() {
  _ticketView = 'kanban';
  setTimeout(() => {
    renderTickets();
    initKanbanDragDrop();
    const tryHighlight = () => {
      const cards = document.querySelectorAll('.tkt-card');
      let found = false;
      cards.forEach(card => {
        if (card.dataset.id === 'TKT-0035') {
          card.style.outline = '2px solid var(--red)';
          card.style.boxShadow = '0 0 0 5px rgba(220,38,38,.15)';
          found = true;
        }
      });
      if (!found) setTimeout(tryHighlight, 100);
    };
    tryHighlight();
  }, 100);
}

function flow1OpenTKT0035Drawer() {
  closeTicketDrawer();
  setTimeout(() => openTicketDrawer('TKT-0035'), 200);
}

function flow1ShowDragPrompt() {
  closeTicketDrawer();
  setTimeout(() => {
    const cards = document.querySelectorAll('.tkt-card');
    cards.forEach(card => {
      card.style.outline = '';
      card.style.boxShadow = '';
      if (card.dataset.id === 'TKT-0035') {
        card.style.outline = '2px solid var(--accent)';
        card.style.boxShadow = '0 0 0 5px var(--accent-bg)';
        if (!card.querySelector('#flow1-drag-hint')) {
          const hint = document.createElement('div');
          hint.id = 'flow1-drag-hint';
          hint.style.cssText = 'font-size:10px;color:var(--accent);text-align:center;margin-top:8px;font-weight:600;padding:3px 6px;background:var(--accent-bg);border-radius:4px';
          hint.textContent = '→ drag to Resolved to close';
          card.appendChild(hint);
        }
      }
    });
  }, 150);
}

function flow1ShowResolveModal() {
  const ticket = TICKETS.find(t => t.id === 'TKT-0035');
  if (!ticket) return;
  _dragTicketId = 'TKT-0035';
  _dragDestStatus = 'resolved';
  setTimeout(() => {
    _showDragNoteModal(ticket, 'resolved');
    document.getElementById('flow-bar').style.display = 'none';
  }, 200);
}

function flow1HighlightMetroAuto() {
  // Let the router render, then highlight Metro Auto row
  setTimeout(() => {
    const rows = document.querySelectorAll('#clients-tbody tr');
    rows.forEach(row => {
      const nameCell = row.querySelector('.td-name');
      if (nameCell && nameCell.textContent.includes('Metro Auto')) {
        row.style.background = '#fef2f2';
        row.style.outline = '2px solid var(--red)';
        row.style.outlineOffset = '-2px';
      } else {
        row.style.background = '';
        row.style.outline = '';
      }
    });
  }, 100);
}

function flow1InjectBackupMissed() {
  setTimeout(() => {
    const backupCard = document.querySelector('#tab-dashboard .card:last-child');
    if (backupCard) {
      const lastBackup = backupCard.querySelector('[style*="Today 04:12"]');
      if (lastBackup) {
        lastBackup.outerHTML = `<span class="badge badge-red">⚠ MISSED</span>`;
      }
      const nextLine = backupCard.querySelector('.text-muted:last-child');
      if (nextLine) {
        nextLine.textContent = 'Backup agent unreachable Apr 26. Device was offline at scheduled time.';
      }
    }
  }, 150);
}

function flow1InjectTerminalOutput() {
  setTimeout(() => {
    const terminal = document.querySelector('#ctab-terminal .terminal');
    if (terminal) {
      terminal.innerHTML = `
        <div class="output">Acronis MSP — Remote Terminal (WIN-SERVICE-01)</div>
        <div class="output">Connected via secure tunnel · Read-only preview</div>
        <div class="output">&nbsp;</div>
        <div><span class="prompt">C:\\Users\\svc&gt;</span> Get-PSDrive C | Select-Object Used,Free</div>
        <div class="output">Used        : 451.6 GB</div>
        <div class="output">Free        :  60.4 GB</div>
        <div class="output">&nbsp;</div>
        <div><span class="prompt">C:\\Users\\svc&gt;</span> Get-Process | Sort-Object CPU -Descending | Select-Object -First 3 Name,CPU</div>
        <div class="output">&nbsp;</div>
        <div class="output">Name               CPU(s)</div>
        <div class="output">----               ------</div>
        <div class="output" style="color:#f87171">QuickBooksDB27      9841.2</div>
        <div class="output">antivirus_scan      4201.7</div>
        <div class="output">svchost              312.1</div>
        <div class="output">&nbsp;</div>
        <div><span class="prompt">C:\\Users\\svc&gt;</span> <span class="cursor"></span></div>
      `;
    }
  }, 150);
}

function flow1ShowRunNow() {
  setTimeout(() => {
    const autoTable = document.querySelector('#ctab-automation .data-table tbody');
    if (autoTable) {
      const rows = autoTable.querySelectorAll('tr');
      rows.forEach(row => {
        const name = row.querySelector('.td-name');
        if (name && name.textContent.includes('Disk Cleanup')) {
          const btn = row.querySelector('.btn');
          if (btn) {
            btn.textContent = 'Run Now';
            btn.className = 'btn btn-primary btn-sm';
            btn.onclick = flow1AutomationRunNow;
          }
        }
      });
    }
  }, 150);
}

function flow1AutomationRunNow() {
  const autoTable = document.querySelector('#ctab-automation .data-table tbody');
  if (!autoTable) return;
  const rows = autoTable.querySelectorAll('tr');
  rows.forEach(row => {
    const name = row.querySelector('.td-name');
    if (name && name.textContent.includes('Disk Cleanup')) {
      const cells = row.querySelectorAll('td');
      if (cells[3]) cells[3].innerHTML = '<span class="badge badge-blue">⟳ Running…</span>';
      const btn = row.querySelector('.btn');
      if (btn) { btn.textContent = 'Running…'; btn.disabled = true; }
    }
  });
}

function flow1InjectDraftNote() {
  setTimeout(() => {
    if (document.getElementById('flow1-note-draft')) return;
    const timeline = document.querySelector('#tab-notes .timeline');
    if (!timeline) return;
    const draftEl = document.createElement('div');
    draftEl.id = 'flow1-note-draft';
    draftEl.className = 'timeline-item';
    draftEl.style.background = '#fffbeb';
    draftEl.style.borderRadius = 'var(--radius)';
    draftEl.style.padding = '12px';
    draftEl.style.border = '1px solid #fde68a';
    draftEl.innerHTML = `
      <div class="timeline-dot warn"></div>
      <div class="timeline-ts">2026-04-30 07:41</div>
      <div class="timeline-body">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <strong>Critical incident — WIN-SERVICE-01</strong>
          <span style="font-size:10px;background:#fde68a;color:#92400e;padding:2px 6px;border-radius:10px;font-weight:600">AI drafted — tap to edit</span>
        </div>
        <p>QuickBooks database process (QuickBooksDB27) identified as root cause of CPU saturation. Process running unchecked since approx. Apr 26 05:00 AM. Disk cleanup automation executed manually 07:22 AM. Backup agent reconnected after cleanup freed space. Client not impacted — resolved before business hours. Monitoring for recurrence.</p>
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid #fde68a;font-size:11px;color:#92400e;display:flex;align-items:center;gap:5px">
          ⚡ <strong>Time logged:</strong> &nbsp;27 min · No rate applied · Logged against INV-2026-041 (Metro Auto Group)
        </div>
      </div>
    `;
    timeline.prepend(draftEl);
  }, 150);
}

function flow1InjectBillingRow() {
  if (document.getElementById('flow1-billing-row')) return;
  setTimeout(() => {
    // Inject the health report callout as an informational feed item at the top of the panel
    // — sits between the page-header and the page-body, full-width like a notification banner
    const billingPanel = document.getElementById('panel-billing');
    if (billingPanel && !document.getElementById('flow1-report-card')) {
      const feed = document.createElement('div');
      feed.id = 'flow1-report-card';
      feed.style.cssText = 'padding:12px 24px;background:var(--accent-bg);border-bottom:1px solid #bfdbfe;display:flex;align-items:flex-start;gap:10px';
      feed.innerHTML = `
        <span style="font-size:16px;flex-shrink:0;margin-top:1px">📊</span>
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--accent)">Incident added to Metro Auto Group's April Health Report</div>
          <div style="font-size:12px;color:var(--text-2);margin-top:2px">1 critical incident · resolved same-day · client uptime unaffected · 27 min logged, not billed — covered under contract</div>
        </div>
      `;
      // Insert immediately after page-header (before page-body)
      const pageBody = billingPanel.querySelector('.page-body');
      if (pageBody) billingPanel.insertBefore(feed, pageBody);
    }

    // Inject the unpriced time-entry line into the invoice table
    const tbody = document.querySelector('#panel-billing .data-table tbody');
    if (!tbody) return;
    const row = document.createElement('tr');
    row.id = 'flow1-billing-row';
    row.style.background = '#fffbeb';
    row.innerHTML = `
      <td class="td-name">INV-2026-041 (draft)</td>
      <td>Metro Auto Group</td>
      <td>Apr 2026</td>
      <td style="color:var(--text-3);font-style:italic">—</td>
      <td></td>
      <td><span class="badge badge-yellow">⚡ Logged — billing TBD</span></td>
      <td><button class="btn btn-ghost btn-sm">Review</button></td>
    `;
    tbody.prepend(row);
  }, 150);
}

// ── FLOW 2: SCALING ─────────────────────────────────────────────

const FLOW_SCALING = [
  {
    isOverlay: true,
    overlayType: 'intro',
    headline: "Marcus manages 61 devices for 4 clients.\nHis clients keep asking if they're \"protected.\"\nHe keeps saying yes, but it's not totally true.",
    body: 'Today he offers enterprise-grade XDR to his clients. He doesn\'t have to be an expert in XDR. Acronis handles it. He keeps the margin.',
  },
  {
    panel: 'policies',
    narration: 'Marcus opens Policies. XDR Enrollment is sitting there inactive — it was pre-configured when the Acronis integration was set up. Zero devices enrolled. He clicks Activate.',
    onEnter: flow2HighlightXdrRow,
  },
  {
    panel: 'policies',
    narration: 'The platform shows exactly what Acronis charges, suggests a billing price, and calculates his new margin in real time. Marcus adjusts the client price to $18 — new MRR jumps to $610. He clicks "Send Quotes to Clients."',
    onEnter: openXdrModal,
  },
  {
    panel: 'quotes',
    narration: 'Before anything hits a contract or an invoice, each client gets a quote — plain language, no jargon, one-click to approve. Marcus sent all four in the same motion. Now he waits. Usually takes less than a day.',
    onEnter: flow2InjectQuotesPending,
  },
  {
    panel: 'quotes',
    narration: 'Riverside Dental and Harbor Legal approved within hours. Metro Auto and Pinnacle CPA are still pending. Marcus can see exactly where things stand without chasing anyone. XDR deployment queues automatically for the approvals already in.',
    onEnter: flow2InjectQuotesPartialApproval,
  },
  {
    panel: 'contracts',
    narration: 'The moment a client approves their quote, a contract addendum generates automatically. Marcus doesn\'t create it — the platform builds it from the existing MSA and the approved quote terms, he reviews, approves, and sends it for e-signature. Effective date sets itself to next billing cycle.',
    onEnter: flow2InjectContractAddenda,
  },
  {
    panel: 'client/1',
    narration: 'For the two clients who signed the contract addendums, XDR is live. For the two pending clients nothing activates until they say yes. Coverage is accurate to what\'s actually been agreed.',
    onEnter: flow2ShowXdrActiveBanner,
  },
  {
    isOverlay: true,
    overlayType: 'outro',
    headline: "23 devices protected. $414/mo confirmed.\n38 more devices and $684/mo in the queue.",
    body: 'Marcus enabled XDR, set his pricing, sent four client quotes, and went back to work. Two clients approved the same day.<br><br>When all four approve: 61 devices, $1,098/mo in new MRR, $13,176/yr — added to his business without a single new hire, a new skill, or a sales call.<br><br>Acronis handled deployment. Marcus handled the price.<br><br><em>This is what "Offer More, Without Knowing More" looks like in practice.</em>',
  },
];

function flow2HighlightTKT0039() {
  _ticketView = 'kanban';
  setTimeout(() => {
    renderTickets();
    initKanbanDragDrop();
    const tryHighlight = () => {
      const cards = document.querySelectorAll('.tkt-card');
      let found = false;
      cards.forEach(card => {
        if (card.dataset.id === 'TKT-0039') {
          card.style.outline = '2px solid var(--accent)';
          card.style.boxShadow = '0 0 0 5px var(--accent-bg)';
          found = true;
        }
      });
      if (!found) setTimeout(tryHighlight, 100);
    };
    tryHighlight();
  }, 100);
}

function flow2HighlightXdrRow() {
  setTimeout(() => {
    const rows = document.querySelectorAll('#panel-policies .data-table tbody tr');
    rows.forEach(row => {
      const name = row.querySelector('.td-name');
      if (name && name.textContent.includes('XDR')) {
        row.style.background = '#fffbeb';
        const btn = row.querySelector('.btn');
        if (btn) {
          btn.textContent = 'Activate';
          btn.className = 'btn btn-primary btn-sm';
          btn.onclick = (e) => { e.stopPropagation(); openXdrModal(); };
        }
      }
    });
  }, 100);
}

function openXdrModal() {
  document.getElementById('xdr-modal').style.display = 'flex';
  initXdrCalculator();
}

function closeXdrModal() {
  document.getElementById('xdr-modal').style.display = 'none';
}

function xdrModalClickOut(e) {
  if (e.target === document.getElementById('xdr-modal')) closeXdrModal();
}

function initXdrCalculator() {
  const input = document.getElementById('xdr-price-input');
  if (!input) return;
  input.addEventListener('input', updateXdrCalc);
  updateXdrCalc();
}

function updateXdrCalc() {
  const price = parseFloat(document.getElementById('xdr-price-input').value) || 0;
  const cost = 8;
  const devices = getXdrSelectedDevices();
  const marginPer = price - cost;
  const totalMrr = marginPer * devices;
  const annual = totalMrr * 12;

  document.getElementById('xdr-margin-per').textContent = `$${marginPer.toFixed(0)} / mo`;
  document.getElementById('xdr-total-mrr').textContent = `+$${totalMrr.toLocaleString()} / mo`;
  document.getElementById('xdr-annual').textContent = `+$${annual.toLocaleString()} / yr`;
  document.getElementById('xdr-device-total').textContent = `Total: ${devices} devices selected`;
}

function getXdrSelectedDevices() {
  const checkboxes = document.querySelectorAll('#xdr-client-list input[type="checkbox"]');
  const counts = [14, 9, 31, 7];
  let total = 0;
  checkboxes.forEach((cb, i) => { if (cb.checked) total += counts[i]; });
  return total;
}

// Wire up checkbox changes
document.addEventListener('change', e => {
  if (e.target.closest('#xdr-client-list')) updateXdrCalc();
});

function confirmXdrEnable() {
  closeXdrModal();
  // Mark XDR row as active in policies
  const rows = document.querySelectorAll('#panel-policies .data-table tbody tr');
  rows.forEach(row => {
    const name = row.querySelector('.td-name');
    if (name && name.textContent.includes('XDR')) {
      const statusCell = row.querySelectorAll('td')[4];
      if (statusCell) statusCell.innerHTML = '<span class="badge badge-blue">Quotes Sent</span>';
      const affectedCell = row.querySelectorAll('td')[3];
      if (affectedCell) affectedCell.textContent = '0 / 61 (pending)';
    }
  });
  // Auto-advance to quotes step
  if (activeFlow === 'scaling') {
    currentStepIndex = 3;
    renderStep();
  }
}

function restorePoliciesXdrRow() {
  const rows = document.querySelectorAll('#panel-policies .data-table tbody tr');
  rows.forEach(row => {
    const name = row.querySelector('.td-name');
    if (name && name.textContent.includes('XDR')) {
      row.style.background = '';
      const statusCell = row.querySelectorAll('td')[4];
      if (statusCell) statusCell.innerHTML = '<span class="badge badge-gray">Inactive</span>';
      const affectedCell = row.querySelectorAll('td')[3];
      if (affectedCell) affectedCell.textContent = '0 / 61';
      const btn = row.querySelector('.btn');
      if (btn) { btn.textContent = 'Activate'; btn.className = 'btn btn-ghost btn-sm'; btn.onclick = null; }
    }
  });
}

function flow2InjectQuotesPending() {
  const body = document.getElementById('quotes-body');
  body.innerHTML = `
    <div class="stat-row mb-4">
      <div class="card">
        <div class="card-label">Quotes Sent</div>
        <div class="card-value">4</div>
        <div class="card-sub">61 devices · awaiting approval</div>
      </div>
      <div class="card">
        <div class="card-label">Confirmed MRR</div>
        <div class="card-value" style="color:var(--text-4)">—</div>
        <div class="card-sub">Pending client responses</div>
      </div>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Client</th><th>Quote</th><th>Devices</th><th>New Monthly Cost</th><th>Sent</th><th>Status</th><th></th></tr></thead>
        <tbody>
          <tr><td class="td-name">Riverside Dental Group</td><td>XDR Security Upgrade</td><td>14</td><td>+$252/mo</td><td>Apr 28, 9:04 AM</td><td><span class="badge badge-yellow">⏳ Awaiting</span></td><td><button class="btn btn-ghost btn-sm">Resend</button></td></tr>
          <tr><td class="td-name">Harbor Legal Group</td><td>XDR Security Upgrade</td><td>9</td><td>+$162/mo</td><td>Apr 28, 9:04 AM</td><td><span class="badge badge-yellow">⏳ Awaiting</span></td><td><button class="btn btn-ghost btn-sm">Resend</button></td></tr>
          <tr><td class="td-name">Metro Auto Group</td><td>XDR Security Upgrade</td><td>31</td><td>+$558/mo</td><td>Apr 28, 9:04 AM</td><td><span class="badge badge-yellow">⏳ Awaiting</span></td><td><button class="btn btn-ghost btn-sm">Resend</button></td></tr>
          <tr><td class="td-name">Pinnacle CPA</td><td>XDR Security Upgrade</td><td>7</td><td>+$126/mo</td><td>Apr 28, 9:04 AM</td><td><span class="badge badge-yellow">⏳ Awaiting</span></td><td><button class="btn btn-ghost btn-sm">Resend</button></td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function flow2InjectQuotesPartialApproval() {
  const body = document.getElementById('quotes-body');
  body.innerHTML = `
    <div class="stat-row mb-4">
      <div class="card">
        <div class="card-label">Quotes Approved</div>
        <div class="card-value" style="color:var(--green)">2 of 4</div>
        <div class="card-sub">23 devices · $414/mo confirmed</div>
      </div>
      <div class="card">
        <div class="card-label">Pending</div>
        <div class="card-value" style="color:var(--yellow)">2</div>
        <div class="card-sub">38 devices · $684/mo in queue</div>
      </div>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Client</th><th>Devices</th><th>New Monthly Cost</th><th>Quote Sent</th><th>Status</th><th></th></tr></thead>
        <tbody>
          <tr style="background:var(--green-bg)"><td class="td-name">Riverside Dental Group</td><td>14</td><td>+$252/mo</td><td>Apr 28, 9:04 AM</td><td><span class="badge badge-green">✅ Approved — 11:32 AM</span></td><td></td></tr>
          <tr style="background:var(--green-bg)"><td class="td-name">Harbor Legal Group</td><td>9</td><td>+$162/mo</td><td>Apr 28, 9:04 AM</td><td><span class="badge badge-green">✅ Approved — 2:18 PM</span></td><td></td></tr>
          <tr><td class="td-name">Metro Auto Group</td><td>31</td><td>+$558/mo</td><td>Apr 28, 9:04 AM</td><td><span class="badge badge-yellow">⏳ Awaiting</span></td><td><button class="btn btn-ghost btn-sm">Resend</button></td></tr>
          <tr><td class="td-name">Pinnacle CPA</td><td>7</td><td>+$126/mo</td><td>Apr 28, 9:04 AM</td><td><span class="badge badge-yellow">⏳ Awaiting</span></td><td><button class="btn btn-ghost btn-sm">Resend</button></td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function flow2InjectContractAddenda() {
  if (document.getElementById('xdr-addendum-row-1')) return;
  setTimeout(() => {
    const tbody = document.querySelector('#panel-contracts .data-table tbody');
    if (!tbody) return;

    const row1 = document.createElement('tr');
    row1.id = 'xdr-addendum-row-1';
    row1.style.background = 'var(--green-bg)';
    row1.innerHTML = `<td class="td-name">XDR Security Addendum</td><td>Riverside Dental Group</td><td>Amendment</td><td>+$3,024/yr</td><td>May 1, 2026</td><td><span class="badge badge-green">✅ Sent for signature</span></td><td><button class="btn btn-ghost btn-sm">View</button></td>`;

    const row2 = document.createElement('tr');
    row2.id = 'xdr-addendum-row-2';
    row2.style.background = 'var(--green-bg)';
    row2.innerHTML = `<td class="td-name">XDR Security Addendum</td><td>Harbor Legal Group</td><td>Amendment</td><td>+$1,944/yr</td><td>May 1, 2026</td><td><span class="badge badge-green">✅ Sent for signature</span></td><td><button class="btn btn-ghost btn-sm">View</button></td>`;

    tbody.prepend(row2);
    tbody.prepend(row1);
  }, 100);
}

function restoreContractsXdrRows() {
  ['xdr-addendum-row-1','xdr-addendum-row-2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

function flow2ShowXdrActiveBanner() {
  // Client 1 (Riverside Dental) will be rendered by renderClientDetail
  // We hook in after navigation to inject the XDR active banner
  setTimeout(() => {
    const upsellStrip = document.querySelector('#panel-client-detail .upsell-strip');
    if (upsellStrip && upsellStrip.textContent.includes('XDR')) {
      upsellStrip.style.borderColor = 'var(--green)';
      upsellStrip.style.background = 'var(--green-bg)';
      upsellStrip.style.color = 'var(--green)';
      upsellStrip.innerHTML = `<span class="upsell-icon">✅</span><span><strong>XDR Active</strong> — 14 devices enrolled · Threat monitoring live · Powered by Acronis Cyber Protect</span>`;
    }
  }, 200);
}

// ── FLOW 3: EXPANSION ───────────────────────────────────────────

const FLOW_EXPANSION = [
  {
    isOverlay: true,
    overlayType: 'intro',
    headline: "Sam's phone buzzed last night.\nA referral came in — Sunrise Bakery, 12 employees.\nReferred by Riverside Dental, one of his best clients.",
    body: 'This morning, Sam stops by the bakery to grab muffins and have a chat. He already has a draft contract on his laptop. He\'s never done a sales call in his life. He doesn\'t need to.',
  },
  {
    panel: 'marketing',
    narration: 'HubSpot caught the referral automatically and surfaced it in the platform. Sam saw it with his morning coffee. A warm intro from an existing client. He decides to stop by the bakery on his way in.',
    onEnter: flow3ShowLeadInbox,
  },
  {
    panel: 'lead-detail',
    narration: 'The platform reviews Sam\'s existing clients, notices the size match with Pinnacle CPA, and suggests a starting point — $1,100/mo for a 12-device Essential Service. It drafts a contract, but doesn\'t send it. That\'s Sam\'s call.',
  },
  {
    panel: 'contracts',
    narration: 'The contract is drafted and ready — not sent anywhere. Sam reviews it in two minutes, fills in the start date, and closes his laptop. He\'s heading to the bakery.',
    onEnter: flow3InjectDraftContract,
  },
  {
    panel: 'contracts',
    narration: 'Sam walks into Sunrise Bakery at 9:15 AM with his laptop and an appetite. Lisa already trusts him — Dan at Riverside vouched for him personally. Sam shows her the platform. She asks two questions. He answers them honestly. She says "okay, what do I sign?" Sam leaves with a box of assorted muffins in tow.',
  },
  {
    panel: 'contracts',
    narration: 'Lisa signs the contract at 9:34 AM. The platform creates the client record immediately. The New Client Onboarding policy triggers — device enrollment instructions go to Lisa\'s email, backup configuration queues up. Sam is still finishing his coffee.',
    onEnter: flow3ContractSigned,
  },
  // Step 6 — Tickets board: onboarding ticket auto-created
  {
    panel: 'tickets',
    narration: "Winning a new client doesn't create chaos — it creates a ticket. TKT-0043 just landed in the New column: everything that needs to happen for Sunrise Bakery's onboarding, in one place, ready to triage and assign. Sam doesn't have to remember. The platform does.",
    onEnter: flow3InjectOnboardingTicket,
  },
  {
    panel: 'marketing',
    narration: 'The moment Sunrise Bakery signed, Mailchimp sent a branded welcome email — what to expect, how to reach the team, what happens next. First monthly health report scheduled for May 1st. Sam drives back to his desk. Sunrise Bakery is already onboarding.',
    onEnter: flow3ShowTriggeredSequences,
  },
  {
    isOverlay: true,
    overlayType: 'outro',
    headline: "One muffin run. One conversation.\nNew client signed, onboarding live, ticket in the queue — before Sam got back to his desk.",
    body: "Sam didn't pitch. He showed up prepared, showed Lisa what managing her IT would look like, and had the paperwork ready when she said yes.<br><br>The platform did the prep work, started the onboarding, and created the work ticket — all before Sam finished his drive back. His 5th client cost him about 20 minutes of intentional effort.<br><br><em>This is what \"Win Clients Without Selling\" looks like in practice.</em>",
  },
];

function flow3InjectOnboardingTicket() {
  _ticketView = 'kanban';
  const tkt43 = TICKETS.find(t => t.id === 'TKT-0043');
  if (tkt43) tkt43.status = 'new';
  renderTickets();
  initKanbanDragDrop();
  setTimeout(() => {
    const cards = document.querySelectorAll('.tkt-card');
    cards.forEach(card => {
      if (card.dataset.id === 'TKT-0043') {
        card.style.outline = '2px solid var(--green)';
        card.style.boxShadow = '0 0 0 5px var(--green-bg)';
      }
    });
  }, 200);
}

function flow3ShowLeadInbox() {
  document.getElementById('lead-inbox').style.display = 'block';
  document.getElementById('triggered-sequences').style.display = 'none';
}

function flow3ShowTriggeredSequences() {
  document.getElementById('lead-inbox').style.display = 'none';
  document.getElementById('triggered-sequences').style.display = 'block';
}

function flow3InjectDraftContract() {
  if (document.getElementById('sunrise-draft-row')) return;
  setTimeout(() => {
    const tbody = document.querySelector('#panel-contracts .data-table tbody');
    if (!tbody) return;
    const row = document.createElement('tr');
    row.id = 'sunrise-draft-row';
    row.style.background = '#fffbeb';
    row.innerHTML = `<td class="td-name">Essential Service Agreement</td><td style="color:var(--text-3);font-style:italic">Sunrise Bakery (prospect)</td><td>MSA</td><td>$13,200</td><td style="color:var(--accent);font-weight:500">May 1, 2026</td><td><span class="badge badge-yellow">📝 Draft — not sent</span></td><td><button class="btn btn-ghost btn-sm">Review</button></td>`;
    tbody.prepend(row);
  }, 100);
}

function flow3DraftContract() {
  navigate('contracts');
  flow3InjectDraftContract();
  if (activeFlow === 'expansion') {
    currentStepIndex = 3;
    renderStep();
  }
}

function flow3ContractSigned() {
  const row = document.getElementById('sunrise-draft-row');
  if (row) {
    row.style.background = 'var(--green-bg)';
    const cells = row.querySelectorAll('td');
    if (cells[5]) cells[5].innerHTML = '<span class="badge badge-green">✅ Active / Signed — 9:34 AM</span>';
    if (cells[6]) cells[6].innerHTML = '<button class="btn btn-ghost btn-sm">View</button>';
  }

  // Inject signed banner
  if (!document.getElementById('sunrise-signed-banner')) {
    const body = document.querySelector('#panel-contracts .page-body');
    if (body) {
      const banner = document.createElement('div');
      banner.id = 'sunrise-signed-banner';
      banner.className = 'upsell-strip mt-4';
      banner.style.borderColor = 'var(--green)';
      banner.style.background = 'var(--green-bg)';
      banner.style.color = 'var(--green)';
      banner.innerHTML = `<span class="upsell-icon">✅</span><span><strong>Sunrise Bakery signed — 9:34 AM.</strong> Client record created. New Client Onboarding policy queued.</span>`;
      body.appendChild(banner);
    }
  }
}

function restoreContractsSunriseRow() {
  const row = document.getElementById('sunrise-draft-row');
  if (row) row.remove();
  const banner = document.getElementById('sunrise-signed-banner');
  if (banner) banner.remove();
}

// ── PARTNER GROWTH PLAYBOOK MODAL ───────────────────────────────

const PLAYBOOK_CONTENT = {
  cyber: {
    title: '🛡️ Cyber Protection Campaign',
    body: `
      <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:16px">Turn your existing device monitoring into a security conversation. Your clients are already visible in this platform — XDR adds real-time threat detection and response without requiring a new agent or a new vendor relationship on their end.</p>
      <div style="display:flex;flex-direction:column;gap:10px;font-size:13px">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="color:var(--accent);font-weight:700;flex-shrink:0">①</span>
          <span><strong>Enable XDR via Policies</strong> — activate enrollment for the clients you want to start with. Acronis deploys silently.</span>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="color:var(--accent);font-weight:700;flex-shrink:0">②</span>
          <span><strong>Send a quote</strong> — set your price per device, platform generates the quote automatically.</span>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="color:var(--accent);font-weight:700;flex-shrink:0">③</span>
          <span><strong>Connect your email tool</strong> — reach your client list with a campaign from Audience Engagement. Template included.</span>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="color:var(--accent);font-weight:700;flex-shrink:0">④</span>
          <span><strong>Addendum auto-generates</strong> — once approved, contract amendment drafts itself for e-signature.</span>
        </div>
      </div>
      <div style="margin-top:16px;padding:10px 14px;background:var(--accent-bg);border-radius:var(--radius);font-size:12px;color:var(--accent)">Suggested price: $15–$20 / device / mo &nbsp;·&nbsp; Acronis cost: ~$8 / device / mo &nbsp;·&nbsp; Your margin: 40–60%</div>
    `,
  },
  ai: {
    title: '🤖 AI Security Campaign',
    body: `
      <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:16px">Your clients are hearing about AI threats from the news. You can be the person who answers "what are you doing about it?" before they have to ask. Acronis GenAI Protection monitors AI-assisted attacks and data exfiltration — you activate it, you own the narrative.</p>
      <div style="display:flex;flex-direction:column;gap:10px;font-size:13px">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="color:var(--accent);font-weight:700;flex-shrink:0">①</span>
          <span><strong>Activate GenAI Protection</strong> via Policies — select which clients to enroll first.</span>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="color:var(--accent);font-weight:700;flex-shrink:0">②</span>
          <span><strong>Use the campaign template</strong> — a plain-language email your clients will actually read. Subject: "What we're doing to protect you from AI threats."</span>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="color:var(--accent);font-weight:700;flex-shrink:0">③</span>
          <span><strong>Include it in the next monthly report</strong> — show clients it's running, what it's caught, what it's blocked.</span>
        </div>
      </div>
      <div style="margin-top:16px;padding:10px 14px;background:var(--purple-bg);border-radius:var(--radius);font-size:12px;color:var(--purple)">New product — early adopter pricing available through Acronis partner portal. First-mover advantage with your client base.</div>
    `,
  },
  backup: {
    title: '☁️ Backup as a Service Campaign',
    body: `
      <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:16px">Every device visible in this platform is a backup revenue opportunity you may not be capturing yet. Acronis Backup & DR is usage-based — you only pay for what's protected, and you bill clients a predictable monthly fee on top. No hardware, no upfront cost.</p>
      <div style="display:flex;flex-direction:column;gap:10px;font-size:13px">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="color:var(--accent);font-weight:700;flex-shrink:0">①</span>
          <span><strong>Check current backup coverage</strong> — device list shows which endpoints have Acronis backup active. Gaps are your opportunity.</span>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="color:var(--accent);font-weight:700;flex-shrink:0">②</span>
          <span><strong>Bundle it into a tier</strong> — add BaaS to your Managed Care Plus contracts as a standard inclusion. Clients expect it; most don't have it.</span>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="color:var(--accent);font-weight:700;flex-shrink:0">③</span>
          <span><strong>Use the renewal campaign</strong> — template timed to 60 days before contract renewal. Positions backup as a baseline service, not an add-on.</span>
        </div>
      </div>
      <div style="margin-top:16px;padding:10px 14px;background:var(--green-bg);border-radius:var(--radius);font-size:12px;color:var(--green)">Avg margin: $4–$8 / device / mo &nbsp;·&nbsp; 61 unprotected devices in your portfolio = meaningful MRR waiting to be captured.</div>
    `,
  },
};

function openPlaybookModal(key) {
  const content = PLAYBOOK_CONTENT[key];
  if (!content) return;
  document.getElementById('playbook-modal-title').textContent = content.title;
  document.getElementById('playbook-modal-body').innerHTML = content.body;
  document.getElementById('playbook-modal').style.display = 'flex';
}

function closePlaybookModal() {
  document.getElementById('playbook-modal').style.display = 'none';
}

function playbookModalClickOut(e) {
  if (e.target === document.getElementById('playbook-modal')) closePlaybookModal();
}

// ── ROUTER EXTENSION — Quotes + Lead Detail ─────────────────────

// Extend the existing router to handle new panels
const _origRouter = window.router;
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (hash === 'quotes') {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item[data-route]').forEach(el => {
      el.classList.toggle('active', el.dataset.route === 'quotes');
    });
    document.getElementById('panel-quotes').classList.add('active');
  } else if (hash === 'lead-detail') {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item[data-route]').forEach(el => {
      el.classList.toggle('active', el.dataset.route === 'marketing');
    });
    document.getElementById('panel-lead-detail').classList.add('active');
  }
});

// Also handle initial load for these routes
const _origDOMLoaded = document.addEventListener;
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.slice(1);
  if (hash === 'quotes') {
    setTimeout(() => {
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-quotes').classList.add('active');
    }, 100);
  }
});
