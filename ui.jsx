// Reusable bits: KPI card, charts (svg), badges, empty state, table helpers.

function KPI({ eyebrow, value, unit, delta, deltaDir = "up", spark, accent }) {
  const sparkPath = spark ? buildSpark(spark) : null;
  return (
    <div className="kpi">
      <div className="kpi-eyebrow">{eyebrow}</div>
      <div className="kpi-value">
        {value}{unit && <span className="unit">{unit}</span>}
      </div>
      <div className="kpi-meta">
        {delta != null && (
          <span className={"delta " + deltaDir}>
            {deltaDir === "up" && <window.I.ArrowUp size={11} sw={2.4}/>}
            {deltaDir === "down" && <window.I.ArrowDn size={11} sw={2.4}/>}
            {delta}
          </span>
        )}
        <span className="t-muted">مقارنة بالأسبوع الماضي</span>
      </div>
      {sparkPath && (
        <svg className="kpi-spark" viewBox="0 0 96 36" preserveAspectRatio="none">
          <path d={sparkPath.area} fill={accent || "var(--brand)"} opacity=".12"/>
          <path d={sparkPath.line} fill="none" stroke={accent || "var(--brand)"} strokeWidth="1.6"/>
        </svg>
      )}
    </div>
  );
}

function buildSpark(values) {
  const w = 96, h = 36, pad = 2;
  const min = Math.min(...values), max = Math.max(...values);
  const sx = i => (i / (values.length - 1)) * (w - pad*2) + pad;
  const sy = v => h - pad - ((v - min) / Math.max(1e-9, (max - min))) * (h - pad*2);
  const pts = values.map((v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`);
  const line = "M" + pts.join(" L");
  const area = line + ` L${sx(values.length-1).toFixed(1)},${h} L${sx(0).toFixed(1)},${h} Z`;
  return { line, area };
}

// Area chart for trends
function AreaChart({ series, height = 220, color = "var(--brand)", labels }) {
  const w = 800;
  const pad = { l: 36, r: 16, t: 16, b: 28 };
  const max = Math.max(...series) * 1.15;
  const min = 0;
  const sx = i => pad.l + (i / (series.length-1)) * (w - pad.l - pad.r);
  const sy = v => pad.t + (1 - (v - min) / (max - min)) * (height - pad.t - pad.b);
  const pts = series.map((v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`);
  const line = "M" + pts.join(" L");
  const area = line + ` L${sx(series.length-1).toFixed(1)},${height-pad.b} L${sx(0).toFixed(1)},${height-pad.b} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => max * t);

  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} preserveAspectRatio="none" style={{display:"block"}}>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={pad.l} x2={w - pad.r} y1={sy(t)} y2={sy(t)} className="grid-line"/>
          <text x={pad.l - 8} y={sy(t) + 3} textAnchor="end" className="chart-axis">{Math.round(t)}</text>
        </g>
      ))}
      <path d={area} fill={color} opacity=".12"/>
      <path d={line} fill="none" stroke={color} strokeWidth="2"/>
      {series.map((v, i) => (
        <circle key={i} cx={sx(i)} cy={sy(v)} r={2.5} fill={color}/>
      ))}
      {labels && labels.map((l, i) => (
        <text key={i} x={sx(i)} y={height - 8} textAnchor="middle" className="chart-axis">{l}</text>
      ))}
    </svg>
  );
}

// Stacked bar
function BarChart({ data, height = 220, colors = ["var(--brand)", "var(--accent)"] }) {
  const w = 800;
  const pad = { l: 36, r: 16, t: 16, b: 28 };
  const max = Math.max(...data.map(d => (d.values||[d.value]).reduce((a,b)=>a+b,0))) * 1.15;
  const sx = i => pad.l + (i + 0.5) * ((w - pad.l - pad.r) / data.length);
  const bw = ((w - pad.l - pad.r) / data.length) * 0.55;
  const sy = v => pad.t + (1 - v / max) * (height - pad.t - pad.b);

  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} preserveAspectRatio="none" style={{display:"block"}}>
      {[0,.25,.5,.75,1].map((t,i) => {
        const y = pad.t + (1-t) * (height - pad.t - pad.b);
        return (
          <g key={i}>
            <line x1={pad.l} x2={w-pad.r} y1={y} y2={y} className="grid-line"/>
            <text x={pad.l-8} y={y+3} textAnchor="end" className="chart-axis">{Math.round(max*t)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const vals = d.values || [d.value];
        let stackBase = height - pad.b;
        return vals.map((v, k) => {
          const h = (height - pad.t - pad.b) * (v / max);
          const y = stackBase - h;
          stackBase = y;
          return <rect key={`${i}-${k}`} x={sx(i)-bw/2} y={y} width={bw} height={h}
                       fill={colors[k % colors.length]} rx="2"/>;
        });
      })}
      {data.map((d, i) => (
        <text key={`l-${i}`} x={sx(i)} y={height - 8} textAnchor="middle" className="chart-axis">{d.label}</text>
      ))}
    </svg>
  );
}

// Status badge resolves type from value
function StatusBadge({ status }) {
  const map = {
    "نشط": "ok", "Active": "ok", "online": "ok",
    "تنبيه": "warn", "Warning": "warn",
    "حرج": "danger", "خطر": "danger", "Critical": "danger", "offline": "danger",
    "صيانة": "info", "Maintenance": "info", "غير نشط": "muted", "بطارية ضعيفة": "warn",
  };
  const cls = map[status] || "muted";
  return <span className={"badge " + cls}><span className="pulse"/>{status}</span>;
}

function Empty({ icon = "Trap", title, desc, action }) {
  const IconC = window.I[icon];
  return (
    <div className="empty">
      <div className="empty-icn"><IconC size={26}/></div>
      <h3>{title}</h3>
      <p>{desc}</p>
      {action}
    </div>
  );
}

function Skeleton({ w = "100%", h = 14, style }) {
  return <div className="skel" style={{width: w, height: h, ...style}}/>;
}

// Donut chart
function Donut({ value, max = 100, size = 120, color = "var(--brand)", label, sub }) {
  const r = size/2 - 10;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value/max);
  return (
    <div style={{position:"relative", width: size, height: size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-3)" strokeWidth="10"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
                strokeDasharray={`${c*pct} ${c}`} strokeLinecap="round"
                transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{position:"absolute", inset:0, display:"grid", placeItems:"center", textAlign:"center"}}>
        <div>
          <div style={{fontFamily:"var(--font-display)", fontSize: 24, fontWeight: 600}}>{label}</div>
          {sub && <div style={{fontSize:11, color:"var(--ink-3)", fontFamily:"var(--font-mono)"}}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

window.UI = { KPI, AreaChart, BarChart, StatusBadge, Empty, Skeleton, Donut };
