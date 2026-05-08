// Mock data + the main Dashboard page

const TRAPS_DATA = [
  { id:"TRAP-001", name:"البئر الشرقي", farm:"الواحة", region:"القصيم", status:"حرج",   today: 28, week: 142, battery: 84, signal: 92, lastSeen:"قبل 4 دقائق", lat: 26.31, lng: 43.97 },
  { id:"TRAP-002", name:"البوّابة الشماليّة", farm:"الواحة", region:"القصيم", status:"تنبيه", today: 14, week: 73,  battery: 67, signal: 88, lastSeen:"قبل 8 دقائق", lat: 26.32, lng: 43.96 },
  { id:"TRAP-003", name:"الممر الأوسط",  farm:"الواحة", region:"القصيم", status:"نشط",   today: 4,  week: 22,  battery: 91, signal: 95, lastSeen:"قبل 2 دقيقة", lat: 26.31, lng: 43.98 },
  { id:"TRAP-004", name:"خزّان المياه",  farm:"الواحة", region:"القصيم", status:"بطارية ضعيفة", today: 7, week: 31, battery: 14, signal: 76, lastSeen:"قبل 12 دقيقة", lat: 26.30, lng: 43.97 },
  { id:"TRAP-005", name:"الحقل الجنوبي", farm:"النور",   region:"الأحساء", status:"نشط",   today: 2,  week: 12,  battery: 78, signal: 81, lastSeen:"قبل 6 دقائق", lat: 25.43, lng: 49.61 },
  { id:"TRAP-006", name:"المدخل الشرقي", farm:"النور",   region:"الأحساء", status:"صيانة", today: 0,  week: 0,   battery: 0,  signal: 0,  lastSeen:"قبل 3 أيام", lat: 25.44, lng: 49.62 },
  { id:"TRAP-007", name:"حقل الطاهر",   farm:"السلام",  region:"المدينة", status:"نشط",  today: 6,  week: 28,  battery: 88, signal: 90, lastSeen:"قبل 5 دقائق", lat: 24.47, lng: 39.61 },
  { id:"TRAP-008", name:"حقل الزراعي",  farm:"السلام",  region:"المدينة", status:"تنبيه", today: 11, week: 58,  battery: 73, signal: 84, lastSeen:"قبل 7 دقائق", lat: 24.46, lng: 39.62 },
];

const ALERTS_DATA = [
  { id:1, sev:"critical", trap:"TRAP-001", msg:"تجاوز عتبة الإصابة الحرجة (28 حشرة/يوم)", time:"قبل 14 دقيقة", farm:"الواحة" },
  { id:2, sev:"warn", trap:"TRAP-008", msg:"ارتفاع ملحوظ في عدد الحشرات", time:"قبل 1 ساعة", farm:"السلام" },
  { id:3, sev:"warn", trap:"TRAP-004", msg:"بطارية منخفضة (14%)", time:"قبل 2 ساعة", farm:"الواحة" },
  { id:4, sev:"info", trap:"TRAP-006", msg:"الجهاز خارج التغطية", time:"قبل 3 أيام", farm:"النور" },
];

const FARMS_DATA = [
  { id:"FARM-01", name:"مزرعة الواحة", region:"القصيم", traps: 4, hectares: 18, owner:"عبدالله الراشد", risk:"high" },
  { id:"FARM-02", name:"مزرعة النور",  region:"الأحساء", traps: 2, hectares: 9,  owner:"عبدالله الراشد", risk:"low" },
  { id:"FARM-03", name:"مزرعة السلام", region:"المدينة", traps: 2, hectares: 12, owner:"شريك", risk:"med" },
];

const USERS_DATA = [
  { id:1, name:"عبدالله الراشد", role:"مالك",        email:"abdullah@nakhl.sa", last:"قبل دقيقتين", active: true },
  { id:2, name:"خالد العتيبي",   role:"مهندس زراعي", email:"khaled@nakhl.sa",   last:"قبل ساعة", active: true },
  { id:3, name:"سارة الفهد",     role:"محلّل بيانات",  email:"sara@nakhl.sa",     last:"قبل يوم",  active: true },
  { id:4, name:"يوسف الحربي",    role:"فنّي ميداني",   email:"yousef@nakhl.sa",   last:"قبل 4 أيام", active: false },
];

window.DATA = { TRAPS_DATA, ALERTS_DATA, FARMS_DATA, USERS_DATA };

// =================================================================
// Dashboard
// =================================================================
function Dashboard({ onNav, dashVariant = "executive" }) {
  const [range, setRange] = React.useState("7d");

  return (
    <>
      <div className="page-head">
        <div>
          <div className="t-eyebrow">صباح الخير، عبدالله</div>
          <h1 className="page-title">لوحة التحكّم</h1>
          <p className="page-sub">اليوم {new Date().toLocaleDateString("ar-SA", {day:"numeric", month:"long", year:"numeric"})} · 8 مصايد · 3 مزارع</p>
        </div>
        <div className="row gap-2">
          <div className="seg">
            {[["24h","24س"],["7d","7 أيام"],["30d","30 يوم"],["q","ربع"]].map(([v, l]) => (
              <button key={v} className={range === v ? "active" : ""} onClick={() => setRange(v)}>{l}</button>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm"><window.I.Download size={14}/>تصدير</button>
          <button className="btn btn-primary btn-sm" onClick={() => onNav("traps")}><window.I.Plus size={14}/>إضافة مصيدة</button>
        </div>
      </div>

      {/* Critical alert strip */}
      <div className="card" style={{
        background:"linear-gradient(90deg, var(--danger-soft) 0%, var(--bg-2) 60%)",
        borderColor:"#e89d80",
        padding: "14px 18px",
        display:"flex", alignItems:"center", gap: 14, marginBottom: 18
      }}>
        <div style={{width:36, height:36, borderRadius:10, background: "var(--danger)", color:"#fff", display:"grid", placeItems:"center", flex:"none"}}>
          <window.I.Alert size={18} sw={2.2}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight: 600, fontSize: 13}}>تنبيه حرج · المصيدة TRAP-001 (البئر الشرقي)</div>
          <div style={{fontSize: 12, color: "var(--ink-3)"}}>تجاوزت العتبة (28 حشرة في الـ24 ساعة الماضية). يُنصح بالمعالجة خلال 48 ساعة.</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => onNav("alerts")}>عرض التنبيه</button>
        <button className="btn btn-primary btn-sm">جدولة معالجة</button>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid" style={{marginBottom: 18}}>
        <window.UI.KPI eyebrow="مصايد نشطة" value="24" unit="/ 26" delta="+2" deltaDir="up" spark={[20,22,21,23,22,24,24]}/>
        <window.UI.KPI eyebrow="حشرات هذا الأسبوع" value="187" delta="+18%" deltaDir="up" spark={[12,18,14,28,22,38,31]} accent="var(--warn)"/>
        <window.UI.KPI eyebrow="تنبيهات مفتوحة" value="3" delta="−1" deltaDir="down" spark={[2,4,3,5,4,4,3]} accent="var(--danger)"/>
        <window.UI.KPI eyebrow="معدل الإصابة" value="8" unit="٪" delta="−2pt" deltaDir="down" spark={[12,11,10,11,9,8,8]} accent="var(--accent)"/>
      </div>

      {/* Main grid */}
      <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap: 16, marginBottom: 16}}>
        {/* Trend */}
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">تدفّق الرصد · كل المصايد</h3>
              <p className="card-sub">عدد الحشرات اليوميّ خلال آخر 7 أيام</p>
            </div>
            <div className="seg">
              <button className="active">الكل</button>
              <button>الواحة</button>
              <button>النور</button>
              <button>السلام</button>
            </div>
          </div>
          <div style={{padding: "16px 12px"}}>
            <window.UI.AreaChart series={[42, 58, 51, 78, 65, 92, 87]} labels={["السبت","الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"]}/>
          </div>
        </div>

        {/* Distribution by farm */}
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">التوزيع حسب المزرعة</h3>
              <p className="card-sub">حشرات هذا الأسبوع</p>
            </div>
          </div>
          <div className="card-pad" style={{display:"flex", justifyContent:"center", paddingTop: 8}}>
            <window.UI.Donut value={68} label="68٪" sub="الواحة" color="var(--brand)" size={140}/>
          </div>
          <div style={{padding: "0 18px 18px"}}>
            {[
              {f:"الواحة", v:142, c:"var(--brand)", pct:76},
              {f:"السلام", v:32, c:"var(--accent)", pct:17},
              {f:"النور",  v:13, c:"var(--warn)", pct:7},
            ].map((r,i) => (
              <div key={i} style={{padding:"8px 0", borderTop: i? "1px solid var(--line)":"none"}}>
                <div className="row between" style={{marginBottom:4}}>
                  <div className="row gap-2" style={{fontSize:13}}>
                    <span style={{width:8, height:8, borderRadius:2, background: r.c, display:"inline-block"}}/>
                    {r.f}
                  </div>
                  <div className="t-mono" style={{fontSize:12}}>{r.v}</div>
                </div>
                <div style={{height:4, background:"var(--bg-3)", borderRadius:2, overflow:"hidden"}}>
                  <div style={{width: r.pct + "%", height:"100%", background: r.c}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mid grid */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 16, marginBottom: 16}}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">المصايد الأكثر نشاطاً</h3>
              <p className="card-sub">مرتّبة حسب عدد الحشرات هذا الأسبوع</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav("traps")}>الكل <window.I.Arrow size={12}/></button>
          </div>
          <div>
            {TRAPS_DATA.slice().sort((a,b) => b.week - a.week).slice(0, 5).map((t, i) => (
              <div key={t.id} style={{padding:"12px 18px", borderTop: i? "1px solid var(--line)":"none", display:"flex", alignItems:"center", gap: 12, cursor:"pointer"}} onClick={() => onNav("traps")}>
                <div style={{width:32, height:32, borderRadius:8, background:"var(--bg-2)", display:"grid", placeItems:"center", color:"var(--brand)"}}>
                  <window.I.Trap size={16}/>
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:500}}>{t.name}</div>
                  <div className="t-mono" style={{fontSize:11, color:"var(--ink-3)"}}>{t.id} · {t.farm}</div>
                </div>
                <window.UI.StatusBadge status={t.status}/>
                <div style={{minWidth: 40, textAlign:"end", fontFamily:"var(--font-display)", fontSize: 18, fontWeight: 600}}>{t.week}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">آخر التنبيهات</h3>
              <p className="card-sub">{ALERTS_DATA.length} تنبيهات في آخر 24 ساعة</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav("alerts")}>الكل <window.I.Arrow size={12}/></button>
          </div>
          <div>
            {ALERTS_DATA.map((a, i) => {
              const c = a.sev === "critical" ? "var(--danger)" : a.sev === "warn" ? "var(--warn)" : "var(--info)";
              return (
                <div key={a.id} style={{padding:"12px 18px", borderTop: i? "1px solid var(--line)":"none", display:"flex", gap: 12}}>
                  <div style={{width:8, marginTop: 6, height: 8, borderRadius: "50%", background: c, flex:"none", boxShadow:`0 0 0 4px ${c}22`}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13, fontWeight:500}}>{a.msg}</div>
                    <div className="t-mono" style={{fontSize:11, color:"var(--ink-3)", marginTop: 2}}>{a.trap} · {a.farm} · {a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom heatmap */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3 className="card-title">خريطة كثافة الإصابة</h3>
            <p className="card-sub">عدد الحشرات حسب الساعة × اليوم</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNav("map")}>عرض على الخريطة <window.I.Arrow size={12}/></button>
        </div>
        <div className="card-pad">
          <Heatmap/>
        </div>
      </div>
    </>
  );
}

function Heatmap() {
  const days = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
  const hours = Array.from({length: 24}, (_, i) => i);
  // Pseudo-random heat with hot pockets
  const cell = (d, h) => {
    let v = Math.sin(d*1.3 + h*.4) + Math.cos(h*.7) + Math.sin((d+h)*.2);
    v = (v + 3) / 6; // normalize
    if (h > 5 && h < 9) v += 0.35;
    if (h > 17 && h < 21) v += 0.4;
    if (d === 2 && h > 6 && h < 11) v += 0.5;
    return Math.min(1, Math.max(0, v));
  };
  const colorFor = v => {
    if (v < .15) return "var(--bg-2)";
    if (v < .35) return "#f1deba";
    if (v < .55) return "#e6c084";
    if (v < .75) return "#c98b3f";
    return "#9c5418";
  };
  return (
    <div>
      <div style={{display:"grid", gridTemplateColumns:"60px repeat(24, 1fr)", gap: 2}}>
        <div></div>
        {hours.map(h => (
          <div key={h} className="t-mono" style={{fontSize: 9, textAlign:"center", color: "var(--ink-4)"}}>{h % 6 === 0 ? h : ""}</div>
        ))}
        {days.map((d, di) => (
          <React.Fragment key={d}>
            <div className="t-mono" style={{fontSize: 10, color:"var(--ink-3)", display:"flex", alignItems:"center"}}>{d}</div>
            {hours.map(h => {
              const v = cell(di, h);
              return <div key={h} style={{height: 22, borderRadius: 3, background: colorFor(v)}} title={`${d} · ${h}:00 → ${Math.round(v*40)} حشرة`}/>;
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="row gap-2" style={{marginTop: 12, justifyContent:"flex-end", fontSize: 11, color:"var(--ink-3)"}}>
        <span>منخفض</span>
        {["var(--bg-2)","#f1deba","#e6c084","#c98b3f","#9c5418"].map(c => <span key={c} style={{width:14, height:10, background: c, borderRadius:2}}/>)}
        <span>مرتفع</span>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
