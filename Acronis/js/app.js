/* Acronis MSP Platform — App Router & Interactions */

// ── MOCK DATA ──────────────────────────────────────────────────

const CLIENTS = [
  { id: 1, name: 'Riverside Dental Group', devices: 14, issues: 2, health: 91, status: 'warning', contract: 'Managed Care Plus', since: 'Jan 2024' },
  { id: 2, name: 'Harbor Legal Group',     devices: 9,  issues: 0, health: 99, status: 'online',  contract: 'Standard RMM',      since: 'Mar 2023' },
  { id: 3, name: 'Metro Auto Group',       devices: 31, issues: 5, health: 74, status: 'critical', contract: 'Managed Care Plus', since: 'Sep 2022' },
  { id: 4, name: 'Pinnacle CPA',           devices: 7,  issues: 0, health: 100, status: 'online', contract: 'Essential',         since: 'Jun 2024' },
];

const DEVICES = {
  1: [
    { id: 101, name: 'WIN-RECEPTION-01',  os: 'Windows 11',   type: 'workstation', status: 'online',   cpu: 22, mem: 61, disk: 44, last: '2 min ago',  ip: '192.168.1.10', user: 'Sarah K.' },
    { id: 102, name: 'WIN-DR-OFFICE-01',  os: 'Windows 11',   type: 'workstation', status: 'warning',  cpu: 88, mem: 79, disk: 68, last: '4 min ago',  ip: '192.168.1.11', user: 'Dr. Patel' },
    { id: 103, name: 'WIN-DR-OFFICE-02',  os: 'Windows 10',   type: 'workstation', status: 'online',   cpu: 14, mem: 52, disk: 33, last: '1 min ago',  ip: '192.168.1.12', user: 'Dr. Kim' },
    { id: 104, name: 'SRV-DC-01',         os: 'Windows Server 2022', type: 'server', status: 'online', cpu: 31, mem: 67, disk: 72, last: '30 sec ago', ip: '192.168.1.2',  user: 'SYSTEM' },
    { id: 105, name: 'MAC-ADMIN-01',      os: 'macOS 15',     type: 'workstation', status: 'online',   cpu: 9,  mem: 44, disk: 28, last: '5 min ago',  ip: '192.168.1.15', user: 'mgr@rdg.com' },
    { id: 106, name: 'WIN-BILLING-01',    os: 'Windows 11',   type: 'workstation', status: 'critical', cpu: 95, mem: 92, disk: 91, last: '12 min ago', ip: '192.168.1.20', user: 'billing@rdg.com' },
  ],
  2: [
    { id: 201, name: 'WIN-PARTNER-01',    os: 'Windows 11',   type: 'workstation', status: 'online',   cpu: 18, mem: 55, disk: 40, last: '1 min ago',  ip: '10.0.0.10', user: 'J. Harbor' },
    { id: 202, name: 'WIN-PARTNER-02',    os: 'Windows 11',   type: 'workstation', status: 'online',   cpu: 11, mem: 48, disk: 35, last: '3 min ago',  ip: '10.0.0.11', user: 'M. Reyes' },
    { id: 203, name: 'SRV-FILES-01',      os: 'Windows Server 2019', type: 'server', status: 'online', cpu: 22, mem: 61, disk: 55, last: '45 sec ago', ip: '10.0.0.2', user: 'SYSTEM' },
    { id: 204, name: 'MAC-SENIOR-01',     os: 'macOS 14',     type: 'workstation', status: 'online',   cpu: 6,  mem: 39, disk: 22, last: '8 min ago',  ip: '10.0.0.15', user: 'senior@hlg.com' },
  ],
  3: [
    { id: 301, name: 'WIN-SALES-01',      os: 'Windows 11',   type: 'workstation', status: 'online',   cpu: 34, mem: 60, disk: 50, last: '2 min ago',  ip: '172.16.0.10', user: 'sales1@metro.com' },
    { id: 302, name: 'WIN-SALES-02',      os: 'Windows 11',   type: 'workstation', status: 'warning',  cpu: 77, mem: 84, disk: 62, last: '6 min ago',  ip: '172.16.0.11', user: 'sales2@metro.com' },
    { id: 303, name: 'WIN-SERVICE-01',    os: 'Windows 10',   type: 'workstation', status: 'critical', cpu: 99, mem: 96, disk: 88, last: '20 min ago', ip: '172.16.0.12', user: 'svc@metro.com' },
    { id: 304, name: 'SRV-APPS-01',       os: 'Windows Server 2022', type: 'server', status: 'online', cpu: 41, mem: 72, disk: 66, last: '1 min ago',  ip: '172.16.0.2', user: 'SYSTEM' },
    { id: 305, name: 'SRV-APPS-02',       os: 'Windows Server 2019', type: 'server', status: 'warning',cpu: 55, mem: 79, disk: 71, last: '3 min ago',  ip: '172.16.0.3', user: 'SYSTEM' },
    { id: 306, name: 'MAC-GM-01',         os: 'macOS 15',     type: 'workstation', status: 'online',   cpu: 8,  mem: 42, disk: 30, last: '4 min ago',  ip: '172.16.0.20', user: 'gm@metro.com' },
  ],
  4: [
    { id: 401, name: 'WIN-CPA-01',        os: 'Windows 11',   type: 'workstation', status: 'online',   cpu: 15, mem: 50, disk: 38, last: '2 min ago',  ip: '10.10.0.10', user: 'cpa1@pinnacle.com' },
    { id: 402, name: 'WIN-CPA-02',        os: 'Windows 11',   type: 'workstation', status: 'online',   cpu: 20, mem: 56, disk: 41, last: '5 min ago',  ip: '10.10.0.11', user: 'cpa2@pinnacle.com' },
    { id: 403, name: 'MAC-PRINCIPAL-01',  os: 'macOS 15',     type: 'workstation', status: 'online',   cpu: 7,  mem: 38, disk: 25, last: '10 min ago', ip: '10.10.0.15', user: 'principal@pinnacle.com' },
  ],
};

const NOTES = {
  101: [
    { ts: '2026-04-28 09:14', type: 'success', title: 'Patch deployment complete', body: 'KB5034441 applied successfully. System restarted cleanly.' },
    { ts: '2026-04-27 14:32', type: 'warn',    title: 'High CPU alert cleared',    body: 'Spike to 94% resolved after closing background scan process.' },
    { ts: '2026-04-25 11:05', type: 'info',    title: 'Routine check-in',          body: 'All systems nominal. Backup completed 04:00 AM.' },
  ],
  102: [
    { ts: '2026-04-28 11:02', type: 'warn',    title: 'High CPU — ongoing',        body: 'Imaging software running large scan. Monitoring. Client notified.' },
    { ts: '2026-04-26 09:45', type: 'info',    title: 'Software installed',        body: 'Dexis Imaging Suite v7.3 deployed per client request.' },
  ],
  106: [
    { ts: '2026-04-28 10:50', type: 'warn',    title: 'Disk space critical — 91%', body: 'Billing server hitting storage limit. Escalating to cleanup Rx.' },
    { ts: '2026-04-28 08:10', type: 'warn',    title: 'Memory pressure alert',     body: '92% RAM utilization. Multiple tabs + Quickbooks + imaging software.' },
    { ts: '2026-04-22 16:00', type: 'info',    title: 'Quarterly review complete', body: 'Performance baseline documented. Upgrade proposal sent to client.' },
  ],
};

// ── ROUTER ──────────────────────────────────────────────────────

let currentRoute = null;

function navigate(hash) {
  window.location.hash = hash;
}

function router() {
  const hash = window.location.hash.slice(1) || 'clients';
  const [section, id] = hash.split('/');

  // Hide all panels
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

  // Update sidebar active state (client/device drill-downs highlight Clients)
  const sidebarRoute = (section === 'client' || section === 'device') ? 'clients' : section;
  document.querySelectorAll('.nav-item[data-route]').forEach(el => {
    el.classList.toggle('active', el.dataset.route === sidebarRoute);
  });

  currentRoute = { section, id };

  switch (section) {
    case 'clients':  renderClients(); break;
    case 'client':   renderClientDetail(parseInt(id)); break;
    case 'device':   renderDeviceDetail(parseInt(id)); break;
    case 'automation': showPanel('panel-automation'); break;
    case 'policies':   showPanel('panel-policies'); break;
    case 'contracts':  showPanel('panel-contracts'); break;
    case 'billing':    showPanel('panel-billing'); break;
    case 'marketing':  showPanel('panel-marketing'); break;
    case 'reports':    showPanel('panel-reports'); break;
    default: renderClients();
  }
}

function showPanel(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => { router(); });

// ── CLIENTS LIST ────────────────────────────────────────────────

function renderClients() {
  showPanel('panel-clients');
  const tbody = document.getElementById('clients-tbody');
  tbody.innerHTML = CLIENTS.map(c => `
    <tr onclick="navigate('client/${c.id}')">
      <td class="td-name">${c.name}</td>
      <td>${c.devices}</td>
      <td>${c.issues > 0 ? `<span class="badge badge-${c.issues > 3 ? 'red' : 'yellow'}">${c.issues} open</span>` : `<span class="badge badge-green">None</span>`}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="gauge-bar" style="width:80px">
            <div class="gauge-fill ${c.health < 80 ? 'crit' : c.health < 95 ? 'warn' : ''}" style="width:${c.health}%"></div>
          </div>
          <span class="text-sm text-muted">${c.health}%</span>
        </div>
      </td>
      <td><span class="badge badge-${c.status === 'online' ? 'green' : c.status === 'warning' ? 'yellow' : 'red'}">${capitalize(c.status)}</span></td>
      <td class="text-muted">${c.contract}</td>
      <td class="text-muted">Since ${c.since}</td>
    </tr>
  `).join('');
}

// ── CLIENT DETAIL ────────────────────────────────────────────────

function renderClientDetail(clientId) {
  const client = CLIENTS.find(c => c.id === clientId);
  if (!client) { navigate('clients'); return; }

  const devices = DEVICES[clientId] || [];
  const panel = document.getElementById('panel-client-detail');
  panel.innerHTML = `
    <div class="page-header">
      <div>
        <div class="breadcrumb">
          <button onclick="navigate('clients')">Clients</button>
          <span class="sep">/</span>
          <span>${client.name}</span>
        </div>
        <div class="page-title" style="margin-top:4px">${client.name}</div>
        <div class="page-subtitle">${devices.length} devices &nbsp;·&nbsp; ${client.contract} &nbsp;·&nbsp; Client since ${client.since}</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm">Edit Client</button>
        <button class="btn btn-primary btn-sm">+ Add Device</button>
      </div>
    </div>

    <div class="page-body">
      <!-- Stats row -->
      <div class="stat-row">
        <div class="card">
          <div class="card-label">Devices</div>
          <div class="card-value">${devices.length}</div>
          <div class="card-sub">${devices.filter(d=>d.status==='online').length} online</div>
        </div>
        <div class="card">
          <div class="card-label">Open Issues</div>
          <div class="card-value" style="color:${client.issues > 0 ? 'var(--red)' : 'var(--green)'}">${client.issues}</div>
          <div class="card-sub">Requires attention</div>
        </div>
        <div class="card">
          <div class="card-label">Health Score</div>
          <div class="card-value" style="color:${client.health<80?'var(--red)':client.health<95?'var(--yellow)':'var(--green)'}">${client.health}%</div>
          <div class="card-sub">Last scan: 5 min ago</div>
        </div>
        <div class="card">
          <div class="card-label">Last Backup</div>
          <div class="card-value" style="font-size:16px">✓ Today</div>
          <div class="card-sub">04:00 AM — All devices</div>
        </div>
      </div>

      <!-- Upsell strip if issues -->
      ${client.issues > 2 ? `
      <div class="upsell-strip">
        <span class="upsell-icon">🛡️</span>
        <span><strong>Acronis XDR</strong> can correlate these alerts into a single threat timeline. <a href="#" onclick="return false">Explore upgrade →</a></span>
      </div>` : ''}

      <!-- Device grid -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <h3 style="font-size:14px;font-weight:600">Devices</h3>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-secondary btn-sm">Groups</button>
          <button class="btn btn-secondary btn-sm">Filter</button>
        </div>
      </div>
      <div class="device-grid">
        ${devices.map(d => `
          <div class="device-card" onclick="navigate('device/${d.id}')">
            <div class="device-card-header">
              <span class="device-icon">${d.type === 'server' ? '🖥️' : d.os.startsWith('mac') ? '💻' : '🖥️'}</span>
              <div>
                <div class="device-name">${d.name}</div>
                <div class="device-meta">${d.os}</div>
              </div>
              <span class="status-dot status-${d.status}" style="margin-left:auto"></span>
            </div>
            <div class="gauge-item">
              <div class="gauge-label"><span>CPU</span><strong>${d.cpu}%</strong></div>
              <div class="gauge-bar"><div class="gauge-fill ${d.cpu>85?'crit':d.cpu>70?'warn':''}" style="width:${d.cpu}%"></div></div>
            </div>
            <div class="device-footer">
              <span>${d.user}</span>
              <span>${d.last}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  panel.classList.add('active');
}

// ── DEVICE DETAIL ────────────────────────────────────────────────

function renderDeviceDetail(deviceId) {
  // Find device and parent client
  let device, client;
  for (const [cid, devs] of Object.entries(DEVICES)) {
    const d = devs.find(d => d.id === deviceId);
    if (d) { device = d; client = CLIENTS.find(c => c.id === parseInt(cid)); break; }
  }
  if (!device) { navigate('clients'); return; }

  const notes = NOTES[deviceId] || [{ ts: '2026-04-28 08:00', type: 'info', title: 'No recent interventions', body: 'Device has been running normally.' }];
  const statusBadge = device.status === 'online' ? 'badge-green' : device.status === 'warning' ? 'badge-yellow' : 'badge-red';
  const stickyStatus = device.status === 'online' ? 'All systems nominal.' : device.status === 'warning' ? 'Elevated metrics — monitoring in progress.' : 'Critical issues require immediate attention.';

  const panel = document.getElementById('panel-device-detail');
  panel.innerHTML = `
    <div class="page-header">
      <div>
        <div class="breadcrumb">
          <button onclick="navigate('clients')">Clients</button>
          <span class="sep">/</span>
          <button onclick="navigate('client/${client.id}')">${client.name}</button>
          <span class="sep">/</span>
          <span>${device.name}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:4px">
          <div class="page-title">${device.name}</div>
          <span class="badge ${statusBadge}">${capitalize(device.status)}</span>
        </div>
        <div class="page-subtitle">${device.os} &nbsp;·&nbsp; ${device.ip} &nbsp;·&nbsp; ${device.user} &nbsp;·&nbsp; Last seen ${device.last}</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm">⚡ Quick Actions</button>
        <button class="btn btn-primary btn-sm">Connect</button>
      </div>
    </div>

    <div class="tabs" id="device-tabs">
      <button class="tab-btn active" data-tab="dashboard">Dashboard</button>
      <button class="tab-btn" data-tab="dep-map">Dependency Map</button>
      <button class="tab-btn" data-tab="agent-chat">Agent Chat</button>
      <button class="tab-btn" data-tab="controls">Controls</button>
      <button class="tab-btn" data-tab="notes">Notes Log</button>
    </div>

    <!-- DASHBOARD TAB -->
    <div class="tab-panel active" id="tab-dashboard">
      ${device.status !== 'online' ? `
      <div class="upsell-strip" style="border-color:#fca5a5;background:#fef2f2;color:var(--red)">
        <span class="upsell-icon">⚠️</span>
        <span>Device has active alerts — <strong>${device.status === 'critical' ? 'immediate attention required' : 'monitoring elevated'}</strong>.</span>
        <a href="#" onclick="navigate('device/${device.id}#notes');return false" style="color:var(--red)">View Notes →</a>
      </div>` : ''}

      <div class="upsell-strip">
        <span class="upsell-icon">🤖</span>
        <span><strong>Acronis GenAI Protection</strong> not active on this device. AI-powered threat detection available.</span>
        <a href="#" onclick="return false">Activate →</a>
      </div>

      <div class="stat-row">
        <div class="card">
          <div class="card-label">CPU Usage</div>
          <div class="card-value" style="color:${device.cpu>85?'var(--red)':device.cpu>70?'var(--yellow)':'inherit'}">${device.cpu}%</div>
          <div class="card-sub">4-core avg, past 5 min</div>
        </div>
        <div class="card">
          <div class="card-label">Memory</div>
          <div class="card-value" style="color:${device.mem>85?'var(--red)':device.mem>70?'var(--yellow)':'inherit'}">${device.mem}%</div>
          <div class="card-sub">${Math.round(device.mem*0.16 * 10)/10} GB / 16 GB used</div>
        </div>
        <div class="card">
          <div class="card-label">Disk (C:)</div>
          <div class="card-value" style="color:${device.disk>85?'var(--red)':device.disk>70?'var(--yellow)':'inherit'}">${device.disk}%</div>
          <div class="card-sub">${Math.round(device.disk*5.12)/10} GB / 512 GB used</div>
        </div>
        <div class="card">
          <div class="card-label">Uptime</div>
          <div class="card-value" style="font-size:16px">12d 4h</div>
          <div class="card-sub">Since last restart</div>
        </div>
      </div>

      <div class="two-col" style="gap:16px">
        <div class="card">
          <div class="card-label" style="margin-bottom:12px">Resource History (24h)</div>
          <div class="gauge-row">
            <div class="gauge-item">
              <div class="gauge-label"><span>CPU avg</span><strong>${device.cpu}%</strong></div>
              <div class="gauge-bar"><div class="gauge-fill ${device.cpu>85?'crit':device.cpu>70?'warn':''}" style="width:${device.cpu}%"></div></div>
            </div>
            <div class="gauge-item">
              <div class="gauge-label"><span>Memory</span><strong>${device.mem}%</strong></div>
              <div class="gauge-bar"><div class="gauge-fill ${device.mem>85?'crit':device.mem>70?'warn':''}" style="width:${device.mem}%"></div></div>
            </div>
            <div class="gauge-item">
              <div class="gauge-label"><span>Disk I/O</span><strong>23 MB/s</strong></div>
              <div class="gauge-bar"><div class="gauge-fill" style="width:28%"></div></div>
            </div>
            <div class="gauge-item">
              <div class="gauge-label"><span>Network</span><strong>4.2 MB/s</strong></div>
              <div class="gauge-bar"><div class="gauge-fill" style="width:18%"></div></div>
            </div>
          </div>
          <p class="text-xs text-muted mt-3" style="font-style:italic">[ Full time-series charts — coming soon ]</p>
        </div>
        <div class="card">
          <div class="card-label" style="margin-bottom:12px">Acronis Backup Status</div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:13px">
            <div style="display:flex;justify-content:space-between"><span class="text-muted">Last backup</span><span class="badge badge-green">Today 04:12 AM</span></div>
            <div style="display:flex;justify-content:space-between"><span class="text-muted">Backup type</span><span>Incremental</span></div>
            <div style="display:flex;justify-content:space-between"><span class="text-muted">Recovery points</span><span>14 available</span></div>
            <div style="display:flex;justify-content:space-between"><span class="text-muted">Protected data</span><span>186 GB</span></div>
            <div style="display:flex;justify-content:space-between"><span class="text-muted">Next scheduled</span><span>Tonight 04:00 AM</span></div>
          </div>
          <hr class="divider">
          <div style="display:flex;gap:6px">
            <button class="btn btn-secondary btn-sm">View Restore Points</button>
            <button class="btn btn-ghost btn-sm" style="color:var(--accent)">Backup Now</button>
          </div>
          <p class="text-xs text-muted mt-2">Powered by Acronis Backup &amp; DR &nbsp;·&nbsp; <a href="#" onclick="return false" style="color:var(--accent)">Upgrade to Disaster Recovery →</a></p>
        </div>
      </div>
    </div>

    <!-- DEPENDENCY MAP TAB -->
    <div class="tab-panel" id="tab-dep-map">
      <div class="placeholder">
        <div class="placeholder-icon">🕸️</div>
        <h3>Dependency Map</h3>
        <p>Visual map of all connected services, applications, users, and network relationships for ${device.name}.</p>
        <div style="margin:24px auto;max-width:500px;padding:20px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);text-align:left">
          <!-- Static mockup -->
          <div style="display:flex;justify-content:center;align-items:center;gap:16px;flex-wrap:wrap">
            <div style="text-align:center;font-size:11px">
              <div style="padding:8px 12px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent-bg);color:var(--accent);font-weight:500;margin-bottom:4px">${device.name}</div>
              <span class="text-muted">this device</span>
            </div>
            <div style="color:var(--border-strong);font-size:20px">↔</div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <div style="padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:11px;color:var(--text-2)">SRV-DC-01 (Active Dir.)</div>
              <div style="padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:11px;color:var(--text-2)">Backup Agent (Acronis)</div>
              <div style="padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:11px;color:var(--text-2)">Shared: \\\\files\\billing</div>
            </div>
          </div>
        </div>
        <span class="coming-soon">Interactive Map — Next Sprint</span>
      </div>
    </div>

    <!-- AGENT CHAT TAB -->
    <div class="tab-panel" id="tab-agent-chat">
      <div class="placeholder">
        <div class="placeholder-icon">💬</div>
        <h3>Chat with Device Agent</h3>
        <p>Talk directly to an AI agent running on ${device.name}. Ask it to diagnose issues, run scripts, explain what's installed, or take action.</p>
        <div style="margin:20px auto;max-width:440px">
          <div style="display:flex;gap:8px">
            <input type="text" class="form-input" placeholder="e.g. Why is CPU spiking? What's installed? Run a disk cleanup…" disabled>
            <button class="btn btn-primary" disabled>Send</button>
          </div>
          <p class="text-xs text-muted mt-2">Agent must be installed on device to activate</p>
        </div>
        <span class="coming-soon">Tell us what you want! → <a href="mailto:jbcoffman@gmail.com" style="color:var(--yellow)">Share feedback</a></span>
      </div>
    </div>

    <!-- CONTROLS TAB -->
    <div class="tab-panel" id="tab-controls">
      <div class="tabs" id="controls-tabs" style="border-top:1px solid var(--border);margin:-20px -24px 16px;padding:0 24px">
        <button class="tab-btn active" data-ctab="filesystem">File System</button>
        <button class="tab-btn" data-ctab="terminal">Terminal</button>
        <button class="tab-btn" data-ctab="desktop">Desktop</button>
        <button class="tab-btn" data-ctab="updates">Updates</button>
        <button class="tab-btn" data-ctab="backups">Backups</button>
        <button class="tab-btn" data-ctab="credentials">Credentials</button>
        <button class="tab-btn" data-ctab="connections">Connections</button>
        <button class="tab-btn" data-ctab="automation">Automation</button>
        <button class="tab-btn" data-ctab="policies">Policies</button>
      </div>

      <div id="ctab-filesystem">
        <div class="upsell-strip" style="border-color:var(--border);background:var(--bg-subtle);color:var(--text-3)">
          <span>📂</span>
          <span>Browsing <strong>C:\\Users\\${device.user.split('@')[0]}\\</strong></span>
          <button class="btn btn-secondary btn-sm" style="margin-left:auto">Upload</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Modified</th><th></th></tr></thead>
            <tbody>
              <tr><td class="td-name">📁 Documents</td><td>Folder</td><td>—</td><td>Apr 28, 2026</td><td><button class="btn btn-ghost btn-sm">Open</button></td></tr>
              <tr><td class="td-name">📁 Desktop</td><td>Folder</td><td>—</td><td>Apr 28, 2026</td><td><button class="btn btn-ghost btn-sm">Open</button></td></tr>
              <tr><td class="td-name">📁 Downloads</td><td>Folder</td><td>—</td><td>Apr 25, 2026</td><td><button class="btn btn-ghost btn-sm">Open</button></td></tr>
              <tr><td class="td-name">📄 QuickBooksBackup.qbb</td><td>File</td><td>2.1 GB</td><td>Apr 27, 2026</td><td><button class="btn btn-ghost btn-sm">Download</button></td></tr>
              <tr><td class="td-name">📄 ClientList_2026.xlsx</td><td>File</td><td>48 KB</td><td>Apr 22, 2026</td><td><button class="btn btn-ghost btn-sm">Download</button></td></tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-muted mt-3" style="font-style:italic">[ Full remote file browser with drag-drop transfer — coming soon ]</p>
      </div>

      <div id="ctab-terminal" style="display:none">
        <div class="terminal">
          <div class="output">Acronis MSP — Remote Terminal (${device.name})</div>
          <div class="output">Connected via secure tunnel · Read-only preview</div>
          <div class="output" style="margin-top:8px">Microsoft Windows [Version 10.0.22631.3810]</div>
          <div class="output">(c) Microsoft Corporation. All rights reserved.</div>
          <div class="output">&nbsp;</div>
          <div><span class="prompt">C:\\Users\\${device.user.split('@')[0]}&gt;</span> <span class="cursor"></span></div>
        </div>
        <p class="text-xs text-muted mt-3" style="font-style:italic">[ Live interactive terminal with command execution — coming soon ]</p>
      </div>

      <div id="ctab-desktop" style="display:none">
        <div class="placeholder" style="min-height:280px">
          <div class="placeholder-icon">🖥️</div>
          <h3>Remote Desktop Viewer</h3>
          <p>Stream a live view of ${device.name}'s desktop. Click-through control available in full release.</p>
          <span class="coming-soon">Coming Soon</span>
        </div>
      </div>

      <div id="ctab-updates" style="display:none">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div><strong>Pending Updates</strong> <span class="badge badge-yellow ml-2" style="margin-left:6px">3 pending</span></div>
          <button class="btn btn-primary btn-sm">Install All</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Update</th><th>KB #</th><th>Severity</th><th>Size</th><th>Status</th><th></th></tr></thead>
            <tbody>
              <tr><td class="td-name">Security Update for .NET 8</td><td>KB5037849</td><td><span class="badge badge-red">Critical</span></td><td>124 MB</td><td><span class="badge badge-yellow">Pending</span></td><td><button class="btn btn-ghost btn-sm">Install</button></td></tr>
              <tr><td class="td-name">Windows Defender Update</td><td>KB5037765</td><td><span class="badge badge-yellow">Important</span></td><td>22 MB</td><td><span class="badge badge-yellow">Pending</span></td><td><button class="btn btn-ghost btn-sm">Install</button></td></tr>
              <tr><td class="td-name">Office 365 Monthly Update</td><td>—</td><td><span class="badge badge-blue">Optional</span></td><td>310 MB</td><td><span class="badge badge-yellow">Pending</span></td><td><button class="btn btn-ghost btn-sm">Install</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="ctab-backups" style="display:none">
        <div class="upsell-strip">
          <span class="upsell-icon">💾</span>
          <span>Powered by <strong>Acronis Backup &amp; Disaster Recovery</strong>.</span>
          <a href="#" onclick="return false">Add Direct Cloud Backup →</a>
        </div>
        <div class="two-col">
          <div class="card">
            <div class="card-label">Recovery Points</div>
            <div class="card-value">14</div>
            <div class="card-sub">Oldest: Apr 14, 2026</div>
          </div>
          <div class="card">
            <div class="card-label">Protected Size</div>
            <div class="card-value">186 GB</div>
            <div class="card-sub">Stored in Acronis Cloud</div>
          </div>
        </div>
        <div class="table-wrap mt-3">
          <table class="data-table">
            <thead><tr><th>Date / Time</th><th>Type</th><th>Size</th><th>Status</th><th></th></tr></thead>
            <tbody>
              <tr><td class="td-name">Apr 28, 2026 04:12 AM</td><td>Incremental</td><td>1.2 GB</td><td><span class="badge badge-green">Success</span></td><td><button class="btn btn-ghost btn-sm">Restore</button></td></tr>
              <tr><td class="td-name">Apr 27, 2026 04:08 AM</td><td>Incremental</td><td>890 MB</td><td><span class="badge badge-green">Success</span></td><td><button class="btn btn-ghost btn-sm">Restore</button></td></tr>
              <tr><td class="td-name">Apr 21, 2026 03:00 AM</td><td>Full</td><td>186 GB</td><td><span class="badge badge-green">Success</span></td><td><button class="btn btn-ghost btn-sm">Restore</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="ctab-credentials" style="display:none">
        <div class="placeholder">
          <div class="placeholder-icon">🔐</div>
          <h3>Credential Manager</h3>
          <p>Securely store and rotate credentials scoped to this device. Passwords, API keys, certificates.</p>
          <span class="coming-soon">Vault integration — coming soon</span>
        </div>
      </div>

      <div id="ctab-connections" style="display:none">
        <div style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center">
          <strong>Saved Connections</strong>
          <button class="btn btn-primary btn-sm">+ New Connection</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Name</th><th>Type</th><th>Target</th><th>Last Used</th><th></th></tr></thead>
            <tbody>
              <tr><td class="td-name">RDP — Main Session</td><td>RDP</td><td>${device.ip}:3389</td><td>2 days ago</td><td><button class="btn btn-ghost btn-sm">Connect</button></td></tr>
              <tr><td class="td-name">SSH Admin</td><td>SSH</td><td>${device.ip}:22</td><td>1 week ago</td><td><button class="btn btn-ghost btn-sm">Connect</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="ctab-automation" style="display:none">
        <p class="text-sm text-muted mb-3">Automations scoped to this device. <a href="#" onclick="navigate('automation');return false" style="color:var(--accent)">View all automations →</a></p>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Automation</th><th>Trigger</th><th>Last Run</th><th>Status</th><th></th></tr></thead>
            <tbody>
              <tr><td class="td-name">Disk Cleanup on 90% threshold</td><td>On alert</td><td>Never</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>
              <tr><td class="td-name">Nightly Backup Verify</td><td>Schedule 04:30 AM</td><td>Today 04:31</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>
            </tbody>
          </table>
        </div>
        <button class="btn btn-secondary btn-sm mt-3">+ Add Automation</button>
      </div>

      <div id="ctab-policies" style="display:none">
        <p class="text-sm text-muted mb-3">Policies applied to this device. <a href="#" onclick="navigate('policies');return false" style="color:var(--accent)">Manage policies →</a></p>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Policy</th><th>Level</th><th>Applied</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td class="td-name">Windows Update Baseline</td><td>Client</td><td>Jan 2024</td><td><span class="badge badge-green">Compliant</span></td></tr>
              <tr><td class="td-name">Endpoint Backup Required</td><td>Global</td><td>Jan 2024</td><td><span class="badge badge-green">Compliant</span></td></tr>
              <tr><td class="td-name">Admin Credential Rotation</td><td>Device</td><td>Mar 2026</td><td><span class="badge badge-yellow">Due in 7d</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- NOTES LOG TAB -->
    <div class="tab-panel" id="tab-notes">
      <div class="sticky-note">
        <strong>Current Status: ${device.status === 'online' ? '✅ Healthy' : device.status === 'warning' ? '⚠️ Warning' : '🚨 Critical'}</strong>
        <p>${stickyStatus}</p>
        <p class="text-xs text-muted mt-2">Last updated by: System monitor &nbsp;·&nbsp; Apr 28, 2026 11:45 AM</p>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <strong>Intervention Log</strong>
        <button class="btn btn-primary btn-sm">+ Add Note</button>
      </div>
      <div class="timeline">
        ${notes.map(n => `
          <div class="timeline-item">
            <div class="timeline-dot ${n.type === 'warn' ? 'warn' : n.type === 'success' ? 'success' : ''}"></div>
            <div class="timeline-ts">${n.ts}</div>
            <div class="timeline-body">
              <strong>${n.title}</strong>
              <p>${n.body}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  panel.classList.add('active');
  initDeviceTabs();
}

function initDeviceTabs() {
  // Main device tabs
  const tabs = document.querySelectorAll('#device-tabs .tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const name = btn.dataset.tab;
      document.querySelectorAll('#panel-device-detail .tab-panel').forEach(p => {
        p.classList.toggle('active', p.id === `tab-${name}`);
      });
    });
  });

  // Controls sub-tabs
  const ctabs = document.querySelectorAll('#controls-tabs .tab-btn');
  ctabs.forEach(btn => {
    btn.addEventListener('click', () => {
      ctabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const name = btn.dataset.ctab;
      document.querySelectorAll('#tab-controls > [id^="ctab-"]').forEach(p => {
        p.style.display = p.id === `ctab-${name}` ? 'block' : 'none';
      });
    });
  });
}

// ── UTILITY ──────────────────────────────────────────────────────

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
