// Traps list (CRUD), trap detail drawer, Alerts page, Farms list, Map, Reports

function TrapsPage({ onNav, onSelectTrap }) {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [view, setView] = React.useState("table");

  const filtered = window.DATA.TRAPS_DATA.filter(t => {
    const q = search.trim();
    if (q && !(t.name.includes(q) || t.id.includes(q) || t.farm.includes(q))) return false;
    if (filter === "alerts" && !["تنبيه","حرج","بطارية ضعيفة"].includes(t.status)) return false;
    if (filter === "ok" && t.status !== "نشط") return false;
    if (filter === "off" && t.status !== "صيانة") return false;
    return true;
  });

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">المصايد</h1>
          <p className="page-sub">{window.DATA.TRAPS_DATA.length} مصيدة موزّعة على 3 مزارع</p>
        </div>
        <div className="row gap-2">
          <button className="btn btn-secondary btn-sm"><window.I.Download size={14}/>تصدير</button>
          <button className="btn btn-primary btn-sm"><window.I.Plus size={14}/>إضافة مصيدة</button>
        </div>
      </div>

      <div className="row gap-3" style={{marginBottom: 14}}>
        <div className="topbar" style={{position:"static", padding:0, background:"transparent", border:"none", flex: 1}}>
          <div className="search" style={{maxWidth: 360}}>
            <window.I.Search className="icn" size={15}/>
            <input placeholder="ابحث بالاسم، المعرّف، أو المزرعة..." value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
        <div className="seg">
          {[["all","الكل",window.DATA.TRAPS_DATA.length],["alerts","تنبيه",4],["ok","نشط",3],["off","صيانة",1]].map(([v,l,n]) => (
            <button key={v} className={filter === v ? "active" : ""} onClick={() => setFilter(v)}>{l} <span className="t-mono" style={{opacity:.6, marginInlineStart:4}}>{n}</span></button>
          ))}
        </div>
        <div className="seg">
          <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}>جدول</button>
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>شبكة</button>
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? <window.UI.Empty
          icon="Search"
          title="لا نتائج لبحثك"
          desc="جرّب تعديل الكلمات أو إزالة الفلاتر."
          action={<button className="btn btn-secondary btn-sm" onClick={() => {setSearch(""); setFilter("all");}}>مسح الفلاتر</button>}
        /> : view === "table" ? (
          <div style={{overflowX:"auto"}}>
          <table className="tbl">
            <thead>
              <tr>
                <th><label className="checkbox"><input type="checkbox"/></label></th>
                <th>المصيدة</th>
                <th>الحالة</th>
                <th>اليوم</th>
                <th>الأسبوع</th>
                <th>البطّاريّة</th>
                <th>الإشارة</th>
                <th>آخر تحديث</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} onClick={() => onSelectTrap(t)} style={{cursor:"pointer"}}>
                  <td onClick={e => e.stopPropagation()}><label className="checkbox"><input type="checkbox"/></label></td>
                  <td>
                    <div style={{fontWeight: 500}}>{t.name}</div>
                    <div className="id">{t.id} · {t.farm}</div>
                  </td>
                  <td><window.UI.StatusBadge status={t.status}/></td>
                  <td><span style={{fontFamily:"var(--font-display)", fontSize: 16, fontWeight: 600}}>{t.today}</span></td>
                  <td className="t-mono">{t.week}</td>
                  <td><BatteryBar value={t.battery}/></td>
                  <td><SignalBars value={t.signal}/></td>
                  <td className="t-muted" style={{fontSize: 12}}>{t.lastSeen}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="icon-btn"><window.I.More size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap: 12, padding: 16}}>
            {filtered.map(t => (
              <div key={t.id} className="card" style={{padding: 14, cursor:"pointer"}} onClick={() => onSelectTrap(t)}>
                <div className="row between" style={{marginBottom: 8}}>
                  <div>
                    <div style={{fontWeight: 600}}>{t.name}</div>
                    <div className="id">{t.id}</div>
                  </div>
                  <window.UI.StatusBadge status={t.status}/>
                </div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 8, marginTop: 8}}>
                  <div>
                    <div className="t-mono" style={{fontSize:10, color:"var(--ink-3)"}}>اليوم</div>
                    <div style={{fontFamily:"var(--font-display)", fontSize:22, fontWeight:600}}>{t.today}</div>
                  </div>
                  <div>
                    <div className="t-mono" style={{fontSize:10, color:"var(--ink-3)"}}>الأسبوع</div>
                    <div style={{fontFamily:"var(--font-display)", fontSize:22, fontWeight:600}}>{t.week}</div>
                  </div>
                </div>
                <div className="row gap-3" style={{marginTop: 10, fontSize: 11, color:"var(--ink-3)"}}>
                  <span><window.I.Battery size={12}/> {t.battery}%</span>
                  <span><window.I.Wifi size={12}/> {t.signal}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length > 0 && <div className="row between" style={{padding: "12px 18px", borderTop: "1px solid var(--line)", fontSize: 12, color:"var(--ink-3)"}}>
          <div>عرض {filtered.length} من {window.DATA.TRAPS_DATA.length}</div>
          <div className="row gap-2">
            <button className="btn btn-ghost btn-sm">السابق</button>
            <button className="btn btn-secondary btn-sm">1</button>
            <button className="btn btn-ghost btn-sm">التالي</button>
          </div>
        </div>}
      </div>
    </>
  );
}

function BatteryBar({ value }) {
  const c = value < 20 ? "var(--danger)" : value < 50 ? "var(--warn)" : "var(--accent)";
  return (
    <div className="row gap-2">
      <div style={{width:32, height:10, background:"var(--bg-3)", borderRadius:2, position:"relative"}}>
        <div style={{position:"absolute", inset:0, width: value+"%", background: c, borderRadius:2}}/>
      </div>
      <span className="t-mono" style={{fontSize: 11, color:"var(--ink-3)"}}>{value}%</span>
    </div>
  );
}
function SignalBars({ value }) {
  const bars = Math.ceil(value/25);
  return (
    <div className="row gap-1">
      {[1,2,3,4].map(b => (
        <div key={b} style={{width: 3, height: 4 + b*2, background: b <= bars ? "var(--accent)" : "var(--bg-3)", borderRadius: 1}}/>
      ))}
    </div>
  );
}

// ===== Trap Detail Drawer =====
function TrapDrawer({ trap, onClose }) {
  if (!trap) return null;
  const series = [4, 7, 5, 12, 18, 14, trap.today];
  return (
    <>
      <div className="drawer-bg" onClick={onClose}/>
      <div className="drawer">
        <div style={{padding: 18, borderBottom: "1px solid var(--line)"}}>
          <div className="row between">
            <div>
              <div className="t-eyebrow">{trap.id} · {trap.farm}</div>
              <h2 className="t-display" style={{fontSize: 22, margin: "6px 0 4px"}}>{trap.name}</h2>
              <window.UI.StatusBadge status={trap.status}/>
            </div>
            <button className="icon-btn" onClick={onClose}><window.I.X size={18}/></button>
          </div>
        </div>
        <div style={{padding: 18, overflow:"auto", flex: 1, display:"flex", flexDirection:"column", gap: 16}}>
          {/* Quick stats */}
          <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: 10}}>
            <div className="card card-pad" style={{padding: 12}}>
              <div className="t-mono" style={{fontSize:9, color:"var(--ink-3)", letterSpacing:".1em", textTransform:"uppercase"}}>اليوم</div>
              <div style={{fontFamily:"var(--font-display)", fontSize:24, fontWeight:600}}>{trap.today}</div>
            </div>
            <div className="card card-pad" style={{padding: 12}}>
              <div className="t-mono" style={{fontSize:9, color:"var(--ink-3)", letterSpacing:".1em", textTransform:"uppercase"}}>الأسبوع</div>
              <div style={{fontFamily:"var(--font-display)", fontSize:24, fontWeight:600}}>{trap.week}</div>
            </div>
            <div className="card card-pad" style={{padding: 12}}>
              <div className="t-mono" style={{fontSize:9, color:"var(--ink-3)", letterSpacing:".1em", textTransform:"uppercase"}}>الشهر</div>
              <div style={{fontFamily:"var(--font-display)", fontSize:24, fontWeight:600}}>{trap.week * 4}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3 className="card-title">رصد آخر 7 أيام</h3></div>
            <div style={{padding: 8}}>
              <window.UI.AreaChart series={series} labels={["س","ح","ن","ث","ر","خ","ج"]} height={180}/>
            </div>
          </div>

          <div className="card card-pad">
            <h3 className="card-title" style={{marginBottom: 12}}>حالة الجهاز</h3>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 14, fontSize: 13}}>
              <div className="row between"><span className="t-muted">البطّاريّة</span><BatteryBar value={trap.battery}/></div>
              <div className="row between"><span className="t-muted">الإشارة</span><SignalBars value={trap.signal}/></div>
              <div className="row between"><span className="t-muted">آخر تحديث</span><span>{trap.lastSeen}</span></div>
              <div className="row between"><span className="t-muted">الموقع</span><span className="t-mono" style={{fontSize: 11}}>{trap.lat}, {trap.lng}</span></div>
              <div className="row between"><span className="t-muted">الإصدار</span><span className="t-mono" style={{fontSize: 11}}>FW 2.4.1</span></div>
              <div className="row between"><span className="t-muted">آخر تركيب</span><span>قبل 14 يوم</span></div>
            </div>
          </div>

          <div className="card card-pad">
            <h3 className="card-title" style={{marginBottom: 10}}>توصية الذكاء الزراعي</h3>
            <div style={{padding: 12, background:"var(--accent-soft)", borderRadius: 10, fontSize: 13, color:"var(--ink-2)", display:"flex", gap: 10}}>
              <window.I.Spark stroke="var(--ok)" size={18}/>
              <div>
                نمط الإصابة يشير إلى نشاط ذكور سوسة النخيل الحمراء. يُنصح بالمعالجة بمبيد الكلوربيريفوس بتركيز 0.05% خلال 48 ساعة، مع حقن الجذع للنخيل ضمن نطاق 25 متر من المصيدة.
              </div>
            </div>
          </div>
        </div>
        <div style={{padding: 14, borderTop: "1px solid var(--line)", display:"flex", gap: 8}}>
          <button className="btn btn-secondary"><window.I.Edit size={14}/>تعديل</button>
          <button className="btn btn-secondary"><window.I.Refresh size={14}/>إعادة المعايرة</button>
          <button className="btn btn-primary grow" style={{justifyContent:"center"}}>جدولة معالجة</button>
        </div>
      </div>
    </>
  );
}

// ===== Alerts Page =====
function AlertsPage({ onNav }) {
  const [tab, setTab] = React.useState("open");
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">التنبيهات</h1>
          <p className="page-sub">3 تنبيهات مفتوحة · 12 محلولة هذا الأسبوع</p>
        </div>
        <div className="row gap-2">
          <button className="btn btn-secondary btn-sm">إعدادات العتبات</button>
          <button className="btn btn-primary btn-sm"><window.I.Check size={14}/>تأكيد الكل</button>
        </div>
      </div>

      <div className="tabs">
        {[["open","المفتوحة",3],["resolved","المحلولة",12],["all","الكل",47]].map(([v,l,n]) => (
          <div key={v} className={"tab " + (tab === v ? "active" : "")} onClick={() => setTab(v)}>
            {l} <span className="t-mono" style={{opacity:.6, marginInlineStart:4}}>{n}</span>
          </div>
        ))}
      </div>

      <div className="col gap-3">
        {window.DATA.ALERTS_DATA.map(a => {
          const sev = a.sev === "critical" ? {c: "var(--danger)", bg: "var(--danger-soft)", l: "حرج"} :
                      a.sev === "warn"     ? {c: "var(--warn)",   bg: "var(--warn-soft)",   l: "تنبيه"} :
                                              {c: "var(--info)",   bg: "var(--info-soft)",   l: "معلومة"};
          return (
            <div key={a.id} className="card" style={{padding: 16, display:"flex", gap: 16, alignItems:"center"}}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: sev.bg, color: sev.c,
                display:"grid", placeItems:"center", flex:"none"
              }}>
                <window.I.Alert size={20} sw={2}/>
              </div>
              <div style={{flex: 1}}>
                <div className="row gap-3" style={{marginBottom: 4}}>
                  <span style={{fontFamily:"var(--font-mono)", fontSize:10, padding:"2px 7px", borderRadius:4, background: sev.c, color:"#fff", textTransform:"uppercase", letterSpacing:".1em"}}>{sev.l}</span>
                  <span className="t-mono" style={{fontSize: 11, color:"var(--ink-3)"}}>{a.trap} · {a.farm} · {a.time}</span>
                </div>
                <div style={{fontWeight: 500}}>{a.msg}</div>
              </div>
              <div className="row gap-2">
                <button className="btn btn-ghost btn-sm" onClick={() => onNav("traps")}>عرض المصيدة</button>
                <button className="btn btn-secondary btn-sm">تجاهل</button>
                <button className="btn btn-primary btn-sm">حلّ</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ===== Map Page =====
function MapPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">الخريطة</h1>
          <p className="page-sub">كل المصايد · توزيع جغرافي مع كثافة الإصابة</p>
        </div>
        <div className="row gap-2">
          <div className="seg">
            <button className="active">عرض حراري</button>
            <button>دبابيس</button>
            <button>مجمّعات</button>
          </div>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap: 14, height: "calc(100vh - 200px)"}}>
        <div className="card" style={{position:"relative", overflow:"hidden", padding: 0, background: "linear-gradient(135deg, #ede2c8 0%, #d6c595 100%)"}}>
          <FieldMap/>
        </div>
        <div className="card" style={{display:"flex", flexDirection:"column"}}>
          <div className="card-head"><h3 className="card-title">المصايد الظاهرة</h3></div>
          <div style={{flex:1, overflow:"auto"}}>
            {window.DATA.TRAPS_DATA.map((t,i) => (
              <div key={t.id} style={{padding:"10px 14px", borderTop: i? "1px solid var(--line)":"none", display:"flex", gap: 10, alignItems:"center"}}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: t.status === "حرج" ? "var(--danger)" : t.status === "تنبيه" ? "var(--warn)" : "var(--accent)",
                  color:"#fff", display:"grid", placeItems:"center", fontSize: 11, fontWeight: 600,
                  flex:"none"
                }}>{t.today}</div>
                <div style={{flex:1, minWidth: 0}}>
                  <div style={{fontSize: 12, fontWeight: 500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{t.name}</div>
                  <div className="id">{t.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function FieldMap() {
  // Stylized non-real map: dotted grid + region patches + trap pins
  const traps = window.DATA.TRAPS_DATA;
  return (
    <svg viewBox="0 0 800 500" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{display:"block"}}>
      {/* Patchy fields */}
      <defs>
        <pattern id="dots" patternUnits="userSpaceOnUse" width="14" height="14">
          <circle cx="2" cy="2" r="1" fill="rgba(31,26,20,.07)"/>
        </pattern>
        <radialGradient id="hot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(181,67,35,.55)"/>
          <stop offset="60%" stopColor="rgba(181,67,35,.18)"/>
          <stop offset="100%" stopColor="rgba(181,67,35,0)"/>
        </radialGradient>
        <radialGradient id="warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(196,125,42,.4)"/>
          <stop offset="100%" stopColor="rgba(196,125,42,0)"/>
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#dots)"/>
      {/* Field plots */}
      <path d="M50 80 L320 60 L350 220 L80 240 Z" fill="rgba(90,122,63,.12)" stroke="rgba(90,122,63,.3)" strokeDasharray="4 3"/>
      <path d="M380 70 L640 110 L660 320 L400 290 Z" fill="rgba(90,122,63,.16)" stroke="rgba(90,122,63,.3)" strokeDasharray="4 3"/>
      <path d="M120 280 L370 290 L380 440 L130 450 Z" fill="rgba(90,122,63,.10)" stroke="rgba(90,122,63,.3)" strokeDasharray="4 3"/>
      {/* Roads */}
      <path d="M0 260 Q400 240 800 270" fill="none" stroke="rgba(31,26,20,.18)" strokeWidth="3" strokeDasharray="2 6"/>
      <path d="M390 0 L380 500" fill="none" stroke="rgba(31,26,20,.12)" strokeWidth="2" strokeDasharray="2 6"/>

      {/* Heat blobs around hot traps */}
      <circle cx="170" cy="160" r="100" fill="url(#hot)"/>
      <circle cx="540" cy="200" r="80" fill="url(#warm)"/>
      <circle cx="240" cy="370" r="60" fill="url(#warm)"/>

      {/* Trap pins */}
      {traps.map((t, i) => {
        const x = 100 + (i*87) % 600;
        const y = 100 + ((i*53) % 320);
        const c = t.status === "حرج" ? "#b54323" : t.status === "تنبيه" ? "#c47d2a" : t.status === "صيانة" ? "#a89776" : "#5a7a3f";
        return (
          <g key={t.id} style={{cursor:"pointer"}}>
            <circle cx={x} cy={y} r="14" fill="#fff" stroke={c} strokeWidth="2"/>
            <text x={x} y={y+4} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill={c} fontWeight="600">{t.today}</text>
          </g>
        );
      })}
    </svg>
  );
}

window.TrapsPage = TrapsPage;
window.TrapDrawer = TrapDrawer;
window.AlertsPage = AlertsPage;
window.MapPage = MapPage;
