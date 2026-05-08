const { useState, useEffect } = React;

function trapSeverity(trap) {
  if (!trap) return "ok";
  var t = trap.today != null ? Number(trap.today) : 0;
  if (trap.status === "حرج" || t >= 20) return "danger";
  if (trap.status === "تنبيه" || trap.status === "بطارية ضعيفة" || t >= 8) return "warn";
  return "ok";
}

function mapDbAlertToRow(a) {
  return {
    id: a.id,
    sev: a.sev || "info",
    title: a._title || (a.msg ? String(a.msg).slice(0, 80) : "تنبيه"),
    desc: [a.trap, a.farm].filter(Boolean).join(" · ") || "—",
    time: a.time || "",
    read: false,
  };
}

const TECHNICIANS = [
  { id:1, name:"خالد العتيبي", role:"فنّي ميداني معتمد", rating: 4.9, jobs: 124, distance: "2.4 كم", price: 8 },
  { id:2, name:"يوسف الحربي", role:"مهندس زراعي", rating: 4.8, jobs: 87, distance: "5.1 كم", price: 12 },
  { id:3, name:"سعد القحطاني", role:"فنّي ميداني", rating: 4.6, jobs: 56, distance: "8.7 كم", price: 7 },
];

// ===== Top bar =====
function MTopbar({ title, onBack, action }) {
  return (
    <div className="m-topbar">
      <div style={{display:"flex", alignItems:"center", gap: 6}}>
        {onBack && <button className="icon-btn" onClick={onBack}><window.I.Arrow size={18}/></button>}
        <h2>{title}</h2>
      </div>
      {action || <div style={{width: 36}}/>}
    </div>
  );
}

// ===== Home (Trap dashboard) — أول مصيدة من Supabase =====
function Home({ onNav, session }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    var fn = function () {
      setTick(function (x) {
        return x + 1;
      });
    };
    window.addEventListener("khoos-data", fn);
    return function () {
      window.removeEventListener("khoos-data", fn);
    };
  }, []);

  var traps = window.DATA && window.DATA.TRAPS_DATA ? window.DATA.TRAPS_DATA : [];
  var trap = traps[0];
  var AD = window.DATA && window.DATA.ALERTS_DATA ? window.DATA.ALERTS_DATA : [];
  var previewAlerts = AD.slice(0, 2).map(mapDbAlertToRow);

  const status = trapSeverity(trap);
  const cardClass = status === "danger" ? "trap-card danger" : status === "warn" ? "trap-card warn" : "trap-card";
  const recClass = status === "danger" ? "recommend danger" : status === "warn" ? "recommend warn" : "recommend";
  const displayName = (session && session.name) ? session.name : "ضيف";

  if (!trap) {
    return (
      <div className="m-page m-page-anim">
        <div style={{padding: "8px 0 16px"}}>
          <div className="m-greeting">السلام عليكم،</div>
          <div className="m-name">{displayName} 👋</div>
        </div>
        <div className="list-card" style={{padding: 22, textAlign: "center"}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>لا توجد مصايد بعد</div>
          <p style={{fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6, margin: 0}}>
            أضف مزرعة ومصايد من لوحة الويب (<span className="t-mono" style={{fontSize: 11}}>index.html</span>) لتظهر هنا تلقائياً.
          </p>
          <a href="index.html" className="btn btn-primary btn-block btn-lg" style={{marginTop: 16}}>فتح لوحة الويب</a>
        </div>
      </div>
    );
  }

  const sigLabel = trap.signal >= 70 ? "جيّدة" : trap.signal >= 40 ? "متوسطة" : "ضعيفة";

  return (
    <div className="m-page m-page-anim">
      <div style={{padding: "8px 0 16px"}}>
        <div className="m-greeting">السلام عليكم،</div>
        <div className="m-name">{displayName} 👋</div>
      </div>

      <div className={cardClass}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div className="live"><span className="dot"></span>مباشر · {trap.lastSeen || "—"}</div>
          <span style={{fontFamily:"var(--font-mono)", fontSize:11, color:"#a89776"}}>{trap.id}</span>
        </div>
        <div style={{fontSize: 12, color: "#a89776", marginTop: 4}}>{trap.name}</div>
        <div className="big-num">{trap.today}<span className="unit">حشرة اليوم</span></div>
        <div style={{fontSize: 13, color: "#c9bca0"}}>
          {status === "danger" && "⚠️ مستوى مرتفع — يحتاج تدخّل سريع"}
          {status === "warn" && "ارتفاع طفيف عن المعدّل المعتاد"}
          {status === "ok" && "✓ المستوى طبيعي"}
        </div>

        <div className="trap-meta">
          <div className="item"><div className="l">الأسبوع</div><div className="v">{trap.week != null ? trap.week : "—"} حشرة</div></div>
          <div className="item"><div className="l">البطّاريّة</div><div className="v">{trap.battery != null ? trap.battery : "—"}٪</div></div>
          <div className="item"><div className="l">الإشارة</div><div className="v">{sigLabel}</div></div>
        </div>
      </div>

      {/* Recommendation */}
      {(() => {
        const rec = window.KhoosAI.getRecommendation(trap);
        const iconColor = rec.status === "danger" ? "var(--danger)" : rec.status === "warn" ? "var(--warn)" : "var(--ok)";
        return (
          <div className={recClass} style={{marginTop: 14}}>
            <div className="icn" style={{ color: iconColor }}>
              {rec.status === "danger" ? <window.I.Alert size={18}/> : rec.status === "warn" ? <window.I.Spark size={18}/> : <window.I.Check size={18}/>}
            </div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600, fontSize: 13, marginBottom: 4}}>{rec.title}</div>
              <div style={{fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5}}>{rec.body}</div>
              <button className="btn btn-primary btn-sm" style={{marginTop: 10}} onClick={() => onNav("technician", trap)}>
                <window.I.User size={13}/>
                {rec.action}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Quick stats */}
      <div className="stat-row">
        <div className="stat-tile"><div className="l">الأسبوع</div><div className="v">{trap.week != null ? trap.week : "—"}</div></div>
        <div className="stat-tile"><div className="l">الشهر</div><div className="v">{trap.week != null ? trap.week * 4 : "—"}</div></div>
        <div className="stat-tile"><div className="l">الحالة</div><div className="v" style={{fontSize: 14}}>{trap.status || "—"}</div></div>
      </div>

      {/* Trend mini chart */}
      <div className="sect-head"><h3>تدفّق آخر 7 أيام</h3></div>
      <div className="list-card" style={{padding: 14}}>
        <window.UI.AreaChart series={[5,8,4,9,7,12,11]} labels={["س","ح","ن","ث","ر","خ","ج"]} height={140}/>
      </div>

      {/* Alerts preview */}
      <div className="sect-head"><h3>آخر التنبيهات</h3><a onClick={() => onNav("alerts")}>الكل</a></div>
      {previewAlerts.length === 0 && (
        <div className="list-card" style={{padding: 14, fontSize: 13, color: "var(--ink-3)"}}>لا تنبيهات حالياً</div>
      )}
      {previewAlerts.map(a => (
        <AlertRow key={a.id} a={a} onClick={() => onNav("alerts")}/>
      ))}
      <div className="sect-head"><h3>التقارير</h3><a onClick={() => onNav("reports")}>عرض التحليلات</a></div>
    </div>
  );
}

function AlertRow({ a, onClick }) {
  return (
    <div className={"alert-row " + a.sev} onClick={onClick}>
      <div className="severity"></div>
      <div style={{flex:1}}>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom: 2}}>
          <span style={{fontWeight: 500, fontSize: 13}}>{a.title}</span>
          {!a.read && <span style={{width:8, height:8, borderRadius:"50%", background:"var(--brand)"}}/>}
        </div>
        <div style={{fontSize: 12, color: "var(--ink-3)"}}>{a.desc}</div>
        <div style={{fontFamily:"var(--font-mono)", fontSize: 10, color: "var(--ink-4)", marginTop: 4}}>{a.time}</div>
      </div>
      <window.I.Chevron size={14} stroke="var(--ink-4)"/>
    </div>
  );
}

// ===== Trap Detail =====
function TrapDetail({ onBack }) {
  const [tab, setTab] = useState("trend");
  const [, setTick] = useState(0);
  useEffect(() => {
    var fn = function () {
      setTick(function (x) {
        return x + 1;
      });
    };
    window.addEventListener("khoos-data", fn);
    return function () {
      window.removeEventListener("khoos-data", fn);
    };
  }, []);

  var traps = window.DATA && window.DATA.TRAPS_DATA ? window.DATA.TRAPS_DATA : [];
  var trap = traps[0];
  var sev = trapSeverity(trap);
  var cardInner = sev === "danger" ? "trap-card danger" : sev === "warn" ? "trap-card warn" : "trap-card";

  if (!trap) {
    return (
      <div className="m-page-anim">
        <MTopbar title="المصيدة" onBack={onBack}/>
        <div className="m-page">
          <div className="list-card" style={{padding: 22, textAlign: "center"}}>
            <p style={{fontSize: 13, color: "var(--ink-3)", margin: 0}}>لا توجد مصيدة لعرضها. أضف مصايد من لوحة الويب.</p>
            <a href="index.html" className="btn btn-primary btn-block" style={{marginTop: 14}}>لوحة الويب</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-page-anim">
      <MTopbar title={trap.name || "المصيدة"} onBack={onBack} action={
        <button className="icon-btn"><window.I.More size={18}/></button>
      }/>
      <div className="m-page">
        <div className={cardInner}>
          <div className="live"><span className="dot"></span>مباشر · {trap.lastSeen || "—"}</div>
          <div style={{fontSize: 11, fontFamily: "var(--font-mono)", color: "#a89776"}}>{trap.id} · {trap.farm || ""}</div>
          <div className="big-num">{trap.today}<span className="unit">/ اليوم</span></div>
          <div className="trap-meta">
            <div className="item"><div className="l">البطّاريّة</div><div className="v">{trap.battery != null ? trap.battery : "—"}٪</div></div>
            <div className="item"><div className="l">الإشارة</div><div className="v">{trap.signal != null ? trap.signal : "—"}٪</div></div>
            <div className="item"><div className="l">المنطقة</div><div className="v">{trap.region || "—"}</div></div>
          </div>
        </div>

        <div className="seg-mobile" style={{marginTop: 16}}>
          <button className={tab === "trend" ? "active" : ""} onClick={() => setTab("trend")}>الاتجاه</button>
          <button className={tab === "device" ? "active" : ""} onClick={() => setTab("device")}>الجهاز</button>
          <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>السجلّ</button>
        </div>

        {tab === "trend" && <div className="list-card" style={{padding: 14, marginTop: 14}}>
          <div style={{fontFamily:"var(--font-mono)", fontSize:11, color:"var(--ink-3)", marginBottom: 8}}>30 يوم</div>
          <window.UI.AreaChart series={[3,5,4,6,7,5,8,9,7,11,9,12,8,10,13,9,11,8,12,15,11,14,18,13,11,9,12,14,11,11]} height={180}/>
        </div>}

        {tab === "device" && <div className="list-card" style={{marginTop: 14}}>
          {[
            {l:"الموديل", v:"KHOOS-X1"},
            {l:"الإصدار", v:"FW 2.4.1"},
            {l:"تاريخ التركيب", v:"15 أبريل 2026"},
            {l:"آخر صيانة", v:"قبل 14 يوم"},
            {l:"نوع الفرمون", v:"Ferrolure+"},
          ].map((r, i) => (
            <div key={i} className="list-row" style={{padding: "12px 14px"}}>
              <div style={{flex:1, fontSize: 13, color:"var(--ink-3)"}}>{r.l}</div>
              <div style={{fontWeight: 500, fontSize: 13}}>{r.v}</div>
            </div>
          ))}
        </div>}

        {tab === "history" && <div className="list-card" style={{marginTop: 14}}>
          {[
            {d:"اليوم 14:22", e:"رصد +3 حشرات"},
            {d:"اليوم 11:08", e:"رصد +5 حشرات"},
            {d:"أمس 17:45", e:"رصد +4 حشرات"},
            {d:"قبل 3 أيام", e:"تم تغيير الفرمون"},
            {d:"قبل أسبوع", e:"معايرة الجهاز"},
          ].map((r, i) => (
            <div key={i} className="list-row">
              <div style={{width: 8, height: 8, borderRadius: "50%", background: "var(--brand)", flex: "none"}}/>
              <div style={{flex:1}}>
                <div style={{fontSize: 13, fontWeight: 500}}>{r.e}</div>
                <div style={{fontFamily:"var(--font-mono)", fontSize: 10, color:"var(--ink-3)", marginTop: 2}}>{r.d}</div>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}

// ===== Alerts =====
function Alerts({ onNav }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    var fn = function () {
      setTick(function (x) {
        return x + 1;
      });
    };
    window.addEventListener("khoos-data", fn);
    return function () {
      window.removeEventListener("khoos-data", fn);
    };
  }, []);

  var AD = window.DATA && window.DATA.ALERTS_DATA ? window.DATA.ALERTS_DATA : [];
  var rows = AD.map(mapDbAlertToRow);

  return (
    <div className="m-page-anim">
      <MTopbar title="التنبيهات"/>
      <div className="m-page">
        {rows.length === 0 && (
          <div className="list-card" style={{padding: 22, textAlign: "center", color: "var(--ink-3)", fontSize: 13}}>
            لا توجد تنبيهات في قاعدة البيانات
          </div>
        )}
        {rows.map(a => <AlertRow key={a.id} a={a} onClick={() => {}}/>)}
      </div>
    </div>
  );
}

// ===== Technician request =====
function Technician({ trap, onBack }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(1);
  const [issue, setIssue] = useState("صيانة دوريّة");
  const [loading, setLoading] = useState(false);

  const confirmBooking = async () => {
    const sb = window.khoosSb;
    if (!sb) { setStep(4); return; }
    setLoading(true);
    const tech = TECHNICIANS.find(t => t.id === selected) || { name: "غير محدد" };
    try {
      await sb.from("engineer_tasks").insert({
        trap_id: trap?._uuid || null,
        farm_name: trap?.farm || "",
        trap_code: trap?.id || "",
        title: `طلب ${issue} - فنّي: ${tech.name}`,
        due_label: "مجدول: اليوم 14:00",
        status: "open"
      });
      setStep(4);
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء تأكيد الحجز.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-page-anim">
      <MTopbar title="طلب فنّي" onBack={onBack}/>
      <div className="m-page">
        {step === 1 && <>
          <div className="m-h2">ما نوع الزيارة؟</div>
          <div style={{fontSize: 13, color:"var(--ink-3)", marginTop: 4, marginBottom: 16}}>اختر سبب الزيارة لنرشّح لك أفضل فنّي</div>
          {[
            {v:"إصابة عاجلة", icon:"Alert", d:"ارتفاع كبير في الحشرات", c:"var(--danger)"},
            {v:"معالجة موصى بها", icon:"Spark", d:"تنفيذ توصية النظام", c:"var(--brand)"},
            {v:"صيانة دوريّة", icon:"Settings", d:"تغيير فرمون أو فحص", c:"var(--accent)"},
            {v:"تركيب مصيدة جديدة", icon:"Plus", d:"إضافة جهاز للمزرعة", c:"var(--info)"},
          ].map(o => {
            const IconC = window.I[o.icon];
            const sel = issue === o.v;
            return (
              <div key={o.v} onClick={() => setIssue(o.v)} className="list-card" style={{
                padding: 14, marginBottom: 8, display:"flex", gap: 12, alignItems:"center", cursor:"pointer",
                borderColor: sel ? "var(--brand)" : "var(--line)",
                background: sel ? "var(--bg-2)" : "var(--surface)"
              }}>
                <div style={{width:36, height:36, borderRadius:10, background: o.c, color:"#fff", display:"grid", placeItems:"center", flex:"none"}}>
                  <IconC size={18}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500, fontSize:14}}>{o.v}</div>
                  <div style={{fontSize:12, color:"var(--ink-3)"}}>{o.d}</div>
                </div>
                <div style={{width:20, height:20, borderRadius:"50%", border: "2px solid " + (sel ? "var(--brand)" : "var(--line-2)"), background: sel ? "var(--brand)" : "transparent", display:"grid", placeItems:"center"}}>
                  {sel && <window.I.Check size={11} stroke="#fff" sw={3}/>}
                </div>
              </div>
            );
          })}

          <button className="btn btn-primary btn-block btn-lg" style={{marginTop: 14}} onClick={() => setStep(2)}>
            التالي
            <window.I.Arrow size={14}/>
          </button>
        </>}

        {step === 2 && <>
          <div className="m-h2">اختر الفنّي</div>
          <div style={{fontSize: 13, color:"var(--ink-3)", marginTop: 4, marginBottom: 16}}>الأقرب لمزرعتك ومتاحون اليوم</div>
          {TECHNICIANS.map(t => {
            const sel = selected === t.id;
            return (
              <div key={t.id} onClick={() => setSelected(t.id)} className="tech-card" style={{
                marginBottom: 10, cursor:"pointer",
                borderColor: sel ? "var(--brand)" : "var(--line)",
                borderWidth: sel ? 2 : 1,
                background: sel ? "var(--bg-2)" : "var(--surface)"
              }}>
                <div className="ph">{t.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight: 500}}>{t.name}</div>
                  <div style={{fontSize: 12, color:"var(--ink-3)"}}>{t.role}</div>
                  <div style={{display:"flex", gap: 10, marginTop: 5, fontSize: 11}}>
                    <span className="stars">★ {t.rating}</span>
                    <span style={{color:"var(--ink-3)"}}>({t.jobs} زيارة)</span>
                    <span style={{color:"var(--ink-3)"}}>· {t.distance}</span>
                  </div>
                </div>
                <div style={{textAlign:"end"}}>
                  <div style={{fontFamily:"var(--font-display)", fontSize: 18, fontWeight: 600}}>{t.price}</div>
                  <div style={{fontSize: 10, color:"var(--ink-3)", fontFamily:"var(--font-mono)"}}>ر.ع</div>
                </div>
              </div>
            );
          })}
          <div className="row gap-2" style={{marginTop: 14}}>
            <button className="btn btn-ghost grow" onClick={() => setStep(1)}>السابق</button>
            <button className="btn btn-primary grow" style={{justifyContent:"center"}} onClick={() => setStep(3)}>
              التالي
              <window.I.Arrow size={14}/>
            </button>
          </div>
        </>}

        {step === 3 && <>
          <div className="m-h2">اختر الموعد</div>
          <div style={{fontSize: 13, color:"var(--ink-3)", marginTop: 4, marginBottom: 16}}>نختار الموعد الأقرب المتاح</div>

          <div className="list-card" style={{padding: 14, marginBottom: 14}}>
            <div className="row gap-3" style={{marginBottom: 12}}>
              <window.I.Calendar size={18} stroke="var(--brand)"/>
              <div>
                <div style={{fontWeight:500}}>اليوم · 8 مايو</div>
                <div style={{fontSize: 12, color:"var(--ink-3)"}}>متاح بعد ساعتين</div>
              </div>
            </div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: 6}}>
              {["10:00","12:00","14:00","16:00","18:00","20:00"].map((t,i) => (
                <button key={t} className={"btn btn-sm " + (i === 2 ? "btn-primary" : "btn-secondary")} style={{justifyContent:"center", fontFamily:"var(--font-mono)"}}>{t}</button>
              ))}
            </div>
          </div>

          <div className="list-card" style={{padding: 14, marginBottom: 14}}>
            <div style={{fontWeight: 500, marginBottom: 10}}>ملخّص الطلب</div>
            <div className="row between" style={{padding: "6px 0", fontSize: 13}}>
              <span style={{color:"var(--ink-3)"}}>نوع الزيارة</span><span>{issue}</span>
            </div>
            <div className="row between" style={{padding: "6px 0", fontSize: 13}}>
            <span style={{color:"var(--ink-3)"}}>فنّي</span><span>{TECHNICIANS.find(t => t.id === selected)?.name || "غير محدد"}</span>
            </div>
            <div className="row between" style={{padding: "6px 0", fontSize: 13}}>
              <span style={{color:"var(--ink-3)"}}>الموعد</span><span>اليوم · 14:00</span>
            </div>
            <div style={{height:1, background:"var(--line)", margin:"6px 0"}}/>
            <div className="row between" style={{padding: "8px 0", fontSize: 16, fontWeight: 600}}>
              <span>المجموع</span>
              <span style={{fontFamily:"var(--font-display)"}}>{TECHNICIANS.find(t => t.id === selected).price} ر.ع</span>
            </div>
          </div>

          <button className="btn btn-primary btn-block btn-lg" onClick={confirmBooking} disabled={loading}>
            {loading ? "جاري التأكيد..." : "تأكيد الحجز"}
          </button>
        </>}

        {step === 4 && <div style={{textAlign:"center", padding: "30px 0"}}>
          <div style={{
            width: 84, height: 84, borderRadius: "50%",
            background: "var(--ok-soft)", color: "var(--ok)",
            display: "grid", placeItems:"center", margin: "0 auto 18px"
          }}>
            <window.I.Check size={36} sw={2.4}/>
          </div>
          <div className="m-h1">تم الحجز!</div>
          <p style={{color:"var(--ink-3)", fontSize: 14, margin:"6px 0 24px"}}>
            خالد العتيبي سيصلك اليوم الساعة 14:00. سترسل لك تفاصيل التواصل عبر WhatsApp.
          </p>
          <button className="btn btn-primary btn-block btn-lg" onClick={onBack}>عودة للرئيسية</button>
          <button className="btn btn-ghost btn-block" style={{marginTop: 8}}>عرض تفاصيل الحجز</button>
        </div>}
      </div>
    </div>
  );
}

// ===== Subscription =====
function Subscription({ onBack }) {
  const [plan, setPlan] = useState("farmer");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setLoading(true);
    // Simulate Stripe Elements / Payment Intent flow
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2500);
  };

  if (success) {
    return (
      <div className="m-page m-page-anim" style={{textAlign:"center", padding: "60px 20px"}}>
        <div style={{width:80, height:80, borderRadius:"50%", background:"var(--ok-soft)", color:"var(--ok)", display:"grid", placeItems:"center", margin:"0 auto 24px"}}>
          <window.I.Check size={40} sw={2.5}/>
        </div>
        <h1 className="m-h1">تم تفعيل الاشتراك!</h1>
        <p style={{color:"var(--ink-3)", fontSize:14, lineHeight:1.6, marginTop:8}}>شكرًا لثقتك في خوص. باقتك الجديدة فعّالة الآن لجميع مصايدك.</p>
        <button className="btn btn-primary btn-block btn-lg" style={{marginTop:30}} onClick={onBack}>العودة للرئيسية</button>
      </div>
    );
  }

  return (
    <div className="m-page-anim">
      <MTopbar title="الاشتراك" onBack={onBack}/>
      <div className="m-page">
        <div className="m-h1">اختر خطّتك</div>
        <p style={{color:"var(--ink-3)", fontSize: 13, margin:"4px 0 18px"}}>يمكن ربط الدفع لاحقاً ببوابة حقيقية؛ الواجهة جاهزة للاختيار.</p>

        {[
          {id:"basic",  n:"البداية",  p: 9,  d:"مصيدة واحدة", f:["تنبيهات في التطبيق", "تقارير أسبوعيّة"]},
          {id:"farmer", n:"المزارع",  p: 19, d:"حتى 3 مصايد", popular: true, f:["تنبيهات WhatsApp", "توصيات معالجة", "حجز فنّي بخصم 10%"]},
          {id:"premium",n:"المتميّز", p: 35, d:"حتى 10 مصايد", f:["كل مميّزات المزارع", "زيارة فنّي مجانيّة شهريّاً", "دعم أولويّة"]},
        ].map(p => (
          <div key={p.id} className={"plan-card " + (plan === p.id ? "selected" : "")} onClick={() => setPlan(p.id)} style={{marginBottom: 10, position:"relative"}}>
            {p.popular && <div style={{position:"absolute", top:-9, insetInlineStart: 14, background:"var(--brand)", color:"#fff8e8", fontSize:10, padding:"2px 8px", borderRadius:4, fontFamily:"var(--font-mono)", letterSpacing:".1em", textTransform:"uppercase"}}>الأكثر اختياراً</div>}
            <div className="row between" style={{marginBottom: 6}}>
              <div>
                <div style={{fontFamily:"var(--font-display)", fontSize:18, fontWeight: 600}}>{p.n}</div>
                <div style={{fontSize: 12, color:"var(--ink-3)"}}>{p.d}</div>
              </div>
              <div style={{textAlign:"end"}}>
                <span style={{fontFamily:"var(--font-display)", fontSize: 24, fontWeight: 600}}>{p.p}</span>
                <span style={{fontSize:12, color:"var(--ink-3)", marginInlineStart: 4}}>ر.ع/شهر</span>
              </div>
            </div>
            {plan === p.id && <ul style={{padding: 0, listStyle:"none", margin:"10px 0 0", display:"flex", flexDirection:"column", gap: 6, fontSize: 13}}>
              {p.f.map((f, i) => <li key={i} style={{display:"flex", gap: 8, alignItems:"center"}}><window.I.Check size={13} stroke="var(--ok)" sw={2.4}/>{f}</li>)}
            </ul>}
          </div>
        ))}

        <div className="list-card" style={{padding: 14, marginTop: 14, display:"flex", gap: 12, alignItems:"center"}}>
          <div style={{
            width: 44, height: 30, borderRadius: 5,
            background: "linear-gradient(135deg, #1a1f71, #4759c4)",
            color:"#fff", display:"grid", placeItems:"center",
            fontFamily:"var(--font-mono)", fontWeight: 700, fontSize: 9, flex:"none"
          }}>VISA</div>
          <div style={{flex:1}}>
            <div style={{fontWeight: 500, fontSize: 13}}>•••• 4242</div>
            <div style={{fontSize: 11, color:"var(--ink-3)"}}>تنتهي 09/2027</div>
          </div>
          <a style={{color:"var(--brand)", fontSize: 12}}>تغيير</a>
        </div>

        <button className="btn btn-primary btn-block btn-lg" style={{marginTop: 16}} onClick={handlePay} disabled={loading}>
          {loading ? "جاري معالجة الدفع..." : (
            <>
              <window.I.Lock size={14}/>
              ادفع الآن · {plan === "basic" ? 9 : plan === "farmer" ? 19 : 35} ر.ع
            </>
          )}
        </button>
        <p style={{textAlign:"center", fontSize:11, color:"var(--ink-3)", marginTop: 10}}>
          الدفع آمن · مشفّر بـ SSL
        </p>
      </div>
    </div>
  );
}

// ===== التقارير والتحليلات (متوافق مع تصميم الجوال) =====
function ReportsAnalytics({ onBack, session }) {
  const initial = (session && session.name && session.name.trim()[0]) || "م";
  const monthsShort = ["ينا","فبر","مار","أبر","ماي","يون","يول","أغس","سبت","أكت","نوف","ديس"];
  const monthlyBars = monthsShort.slice(0, 6).map(function (label, i) {
    var a = 40 + i * 12 + (i % 3) * 8;
    var b = 55 + i * 15 + ((i + 1) % 4) * 10;
    return { label: label, values: [a, b] };
  });

  const insectRows = [
    { name: "سوسة النخيل الحمراء", value: 1240, color: "var(--brand)" },
    { name: "حلم الغبار", value: 312, color: "var(--accent)" },
    { name: "دودة الطلع", value: 198, color: "#c47d2a" },
    { name: "غير محدد", value: 97, color: "var(--ink-4)" },
  ];
  var insectMax = Math.max.apply(null, insectRows.map(function (r) { return r.value; }));

  const scheduled = [
    { title: "ملخص أسبوعي", freq: "كل أحد ٨:٠٠ ص", recipients: 5 },
    { title: "تقرير الإصابة الشهري", freq: "أول كل شهر", recipients: 12 },
    { title: "تنبيهات يومية", freq: "يومياً ٧:٠٠ ص", recipients: 3 },
  ];

  const pdfExport = function () {
    window.print();
  };

  return (
    <div className="m-page-anim">
      <div className="m-topbar">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="رجوع">
          <window.I.Arrow size={18}/>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button type="button" className="icon-btn"><window.I.Search size={17}/></button>
          <button type="button" className="icon-btn"><window.I.Bell size={17}/></button>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #8a5824, #5a7a3f)",
            color: "#fff", display: "grid", placeItems: "center",
            fontWeight: 700, fontSize: 14,
          }}>{initial}</div>
        </div>
      </div>

      <div className="m-page">
        <h1 className="m-h1" style={{ marginBottom: 6 }}>التقارير والتحليلات</h1>
        <p style={{ fontSize: 13, color: "var(--ink-3)", margin: "0 0 16px", lineHeight: 1.5 }}>
          رؤى عميقة لمساعدتك في اتخاذ القرار
        </p>

        <div className="row gap-2" style={{ marginBottom: 14, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-secondary btn-sm grow" style={{ justifyContent: "center", flex: "1 1 140px" }} onClick={pdfExport}>
            <window.I.Download size={14}/> تصدير PDF
          </button>
          <button type="button" className="btn btn-secondary btn-sm grow" style={{ justifyContent: "center", flex: "1 1 140px" }}>
            <window.I.Calendar size={14}/> هذا الشهر
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <window.UI.KPI eyebrow="إجمالي الحشرات" value="1,847" delta="+12%" deltaDir="up" spark={[1200,1180,1250,1300,1280,1400,1750,1847]} accent="var(--brand)" />
          <window.UI.KPI eyebrow="معدل اكتشاف مبكر" value="38" unit="%" delta="+8pt" deltaDir="up" spark={[22,24,26,28,30,32,34,38]} accent="var(--accent)" />
          <window.UI.KPI eyebrow="عمليات معالجة" value="14" delta="+3" deltaDir="up" spark={[8,9,10,11,11,12,13,14]} accent="var(--warn)" />
          <window.UI.KPI eyebrow="استجابة متوسطة" value="4.2" unit=" ساعة" delta="−1.1" deltaDir="down" spark={[7,6.5,6,5.5,5.2,4.8,4.5,4.2]} accent="var(--danger)" />
        </div>

        <div className="sect-head"><h3>أنواع الحشرات</h3></div>
        <div className="list-card" style={{ padding: 14, marginBottom: 14 }}>
          {insectRows.map(function (r, i) {
            var pct = Math.round((r.value / insectMax) * 100);
            return (
              <div key={i} style={{ marginBottom: i < insectRows.length - 1 ? 14 : 0 }}>
                <div className="row between" style={{ marginBottom: 6, fontSize: 13 }}>
                  <span>{r.name}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{r.value}</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "var(--bg-3)", overflow: "hidden" }}>
                  <div style={{ width: pct + "%", height: "100%", background: r.color, borderRadius: 4 }}/>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sect-head">
          <h3>المقارنة الشهرية</h3>
          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>●</span> 2025
            <span style={{ marginInlineStart: 10, color: "var(--brand)", fontWeight: 700 }}>●</span> 2026
          </span>
        </div>
        <div className="list-card" style={{ padding: "12px 8px", marginBottom: 14 }}>
          <window.UI.BarChart data={monthlyBars} height={180} colors={["var(--accent)", "var(--brand)"]}/>
        </div>

        <div className="sect-head">
          <h3>التقارير المجدولة</h3>
          <button type="button" className="btn btn-ghost btn-sm" style={{ padding: "4px 8px", fontSize: 11 }}>
            <window.I.Plus size={12}/> تقرير جديد
          </button>
        </div>
        <div className="list-card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 320 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)", color: "var(--ink-3)", fontFamily: "var(--font-mono)", fontSize: 10 }}>
                <th style={{ textAlign: "start", padding: "10px 12px" }}>التقرير</th>
                <th style={{ textAlign: "start", padding: "10px 8px" }}>التكرار</th>
                <th style={{ textAlign: "center", padding: "10px 8px" }}>المستلمون</th>
                <th style={{ textAlign: "center", padding: "10px 8px" }}>الحالة</th>
                <th style={{ width: 40 }}/>
              </tr>
            </thead>
            <tbody>
              {scheduled.map(function (row, i) {
                return (
                  <tr key={i} style={{ borderTop: i ? "1px solid var(--line)" : "none" }}>
                    <td style={{ padding: "12px", fontWeight: 500 }}>{row.title}</td>
                    <td style={{ padding: "12px 8px", color: "var(--ink-2)", fontSize: 11 }}>{row.freq}</td>
                    <td style={{ padding: "12px 8px", textAlign: "center", fontFamily: "var(--font-mono)" }}>{row.recipients}</td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      <span style={{
                        background: "var(--ok-soft)", color: "var(--ok)",
                        fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 600,
                      }}>نشط</span>
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      <button type="button" className="icon-btn"><window.I.Edit size={15}/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== Profile =====
function Profile({ onNav, session, onLogout }) {
  const initial = (session && session.name && session.name.trim()[0]) || "؟";
  const roleLabel = session && session.role === "admin" ? "أدمن" : session && session.role === "engineer" ? "مهندس ميداني" : "مزارع";
  return (
    <div className="m-page-anim">
      <MTopbar title="حسابي"/>
      <div className="m-page">
        <div className="list-card" style={{padding: 18, display:"flex", gap: 14, alignItems:"center", marginBottom: 14}}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #8a5824, #5a7a3f)",
            color:"#fff", display:"grid", placeItems:"center",
            fontFamily:"var(--font-display)", fontSize: 22, fontWeight: 600
          }}>{initial}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight: 600}}>{(session && session.name) || "مستخدم"}</div>
            <div style={{fontSize: 12, color:"var(--ink-3)"}}>{(session && session.subtitle) || roleLabel}</div>
            <div style={{fontFamily:"var(--font-mono)", fontSize: 10, color:"var(--ink-4)", marginTop: 4}}>{(session && session.email) || "—"}</div>
          </div>
          <button className="icon-btn"><window.I.Edit size={16}/></button>
        </div>

        <div className="list-card" style={{
          padding: 14, marginBottom: 14,
          background: "linear-gradient(135deg, var(--brand-soft) 0%, var(--accent-soft) 100%)",
          border: "1px solid var(--brand-soft)"
        }} onClick={() => onNav("subscription")}>
          <div className="row between">
            <div>
              <div style={{fontFamily:"var(--font-mono)", fontSize:10, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".1em"}}>الخطّة الحاليّة</div>
              <div style={{fontFamily:"var(--font-display)", fontSize: 20, fontWeight: 600}}>المزارع</div>
              <div style={{fontSize: 12, color:"var(--ink-3)"}}>تجدّد في 12 يونيو</div>
            </div>
            <window.I.Chevron size={18} stroke="var(--ink-3)"/>
          </div>
        </div>

        <div className="list-card" style={{padding: 0, marginBottom: 14}} onClick={() => onNav("reports")}>
          <div className="list-row" style={{borderBottom:"none"}}>
            <div style={{width:34, height:34, borderRadius:9, background:"var(--bg-2)", display:"grid", placeItems:"center", color:"var(--brand)", flex:"none"}}>
              <window.I.Reports size={16}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight: 600, fontSize: 14}}>التقارير والتحليلات</div>
              <div style={{fontSize: 12, color:"var(--ink-3)", marginTop: 2}}>رؤى ومؤشرات وجداول مجدولة</div>
            </div>
            <window.I.Chevron size={14} stroke="var(--ink-4)"/>
          </div>
        </div>

        {[
          {label:"الإعدادات", icon:"Settings"},
          {label:"الإشعارات", icon:"Bell"},
          {label:"الأمان", icon:"Shield"},
          {label:"اللغة", icon:"Globe", v:"العربيّة"},
          {label:"المساعدة والدعم", icon:"Help"},
        ].map((r, i) => {
          const IconC = window.I[r.icon];
          return (
            <div key={i} className="list-card" style={{padding: 0, marginBottom: i === 4 ? 14 : 8}}>
              <div className="list-row" style={{borderBottom:"none"}}>
                <div style={{width:34, height:34, borderRadius:9, background:"var(--bg-2)", display:"grid", placeItems:"center", color:"var(--ink-2)", flex:"none"}}>
                  <IconC size={16}/>
                </div>
                <div style={{flex:1, fontWeight: 500, fontSize: 14}}>{r.label}</div>
                {r.v && <span style={{fontSize: 12, color:"var(--ink-3)"}}>{r.v}</span>}
                <window.I.Chevron size={14} stroke="var(--ink-4)"/>
              </div>
            </div>
          );
        })}

        <button type="button" className="btn btn-ghost btn-block" style={{color:"var(--danger)", marginTop: 4}} onClick={onLogout}>
          <window.I.Logout size={14}/>
          تسجيل الخروج
        </button>

        <p style={{textAlign:"center", fontSize: 10, color:"var(--ink-4)", marginTop: 18, fontFamily:"var(--font-mono)"}}>
          خوص · v2.4.1
        </p>
      </div>
    </div>
  );
}

// ===== تسجيل دخول حقيقي (Supabase) =====
function MobileLogin({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!window.KhoosAuth || !window.KhoosAuth.configured) {
      setErr("لم يُضبط Supabase — عبّئ ملف supabase-config.js");
      return;
    }
    setLoading(true);
    try {
      await window.KhoosAuth.signIn(email, password);
      if (window.KhoosData) await window.KhoosData.refreshAll();
      onLoggedIn();
    } catch (ex) {
      setErr(ex.message || String(ex));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="m-page m-page-anim" style={{minHeight:"72vh", display:"flex", flexDirection:"column", justifyContent:"center", paddingTop: 8}} onSubmit={submit}>
      <div style={{textAlign:"center", marginBottom: 22}}>
        <div style={{fontFamily:"var(--font-display)", fontSize: 28, fontWeight: 600}}>خوص · الجوال</div>
        <p style={{fontSize: 13, color:"var(--ink-3)", marginTop: 10, lineHeight: 1.5}}>
          سجّل بنفس البريد وكلمة المرور المستخدمين في{" "}
          <span className="t-mono" style={{fontSize: 11}}>index.html</span>
          {" "}— الجلسة محفوظة في المتصفح (Supabase Auth).
        </p>
      </div>
      <div className="col gap-2">
        <div className="field">
          <label>البريد</label>
          <input className="input" type="email" autoComplete="email" value={email} onChange={function (ev) { setEmail(ev.target.value); }} required/>
        </div>
        <div className="field">
          <label>كلمة المرور</label>
          <input className="input" type="password" autoComplete="current-password" value={password} onChange={function (ev) { setPassword(ev.target.value); }} required/>
        </div>
        {err ? <div style={{fontSize: 12, color: "var(--danger)"}}>{err}</div> : null}
        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? "جاري الدخول…" : "تسجيل الدخول"}
        </button>
      </div>
      <a href="index.html" className="btn btn-ghost btn-block" style={{marginTop: 20}}>فتح لوحة الويب الكاملة</a>
    </form>
  );
}

function MobileAdminDash() {
  const [, setTick] = useState(0);
  useEffect(() => {
    var fn = function () {
      setTick(function (x) {
        return x + 1;
      });
    };
    window.addEventListener("khoos-data", fn);
    return function () {
      window.removeEventListener("khoos-data", fn);
    };
  }, []);

  var UD = window.DATA && window.DATA.USERS_DATA ? window.DATA.USERS_DATA : [];
  var TD = window.DATA && window.DATA.TRAPS_DATA ? window.DATA.TRAPS_DATA : [];
  var AD = window.DATA && window.DATA.ALERTS_DATA ? window.DATA.ALERTS_DATA : [];
  var acts = AD.slice(0, 6).map(function (a) {
    return (a.msg || a._title || "").slice(0, 72) || "—";
  });

  return (
    <div className="m-page m-page-anim">
      <div style={{padding: "8px 0 12px"}}>
        <div className="m-greeting">إدارة المنصّة</div>
        <div className="m-name">لوحة الأدمن</div>
      </div>
      <div className="stat-row">
        <div className="stat-tile"><div className="l">مستخدمون</div><div className="v">{UD.length}</div></div>
        <div className="stat-tile"><div className="l">مصايد</div><div className="v">{TD.length}</div></div>
        <div className="stat-tile"><div className="l">تنبيهات</div><div className="v" style={{color: AD.length ? "var(--danger)" : "inherit"}}>{AD.length}</div></div>
      </div>
      <div className="list-card" style={{marginTop: 14, padding: 14}}>
        <div style={{fontWeight: 600, marginBottom: 10}}>آخر التنبيهات</div>
        {acts.length === 0 ? (
          <div style={{fontSize: 13, color: "var(--ink-3)"}}>لا بيانات تنبيهات بعد</div>
        ) : (
          acts.map(function (t, i) {
            return (
              <div key={i} style={{fontSize: 13, padding:"10px 0", borderTop: i ? "1px solid var(--line)" : "none"}}>{t}</div>
            );
          })
        )}
      </div>
      <a href="index.html" className="btn btn-primary btn-block btn-lg" style={{marginTop: 16}}>فتح لوحة الويب (إدارة كاملة)</a>
    </div>
  );
}

function MobileEngineerDash({ onNav }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    var fn = function () {
      setTick(function (x) {
        return x + 1;
      });
    };
    window.addEventListener("khoos-data", fn);
    return function () {
      window.removeEventListener("khoos-data", fn);
    };
  }, []);

  var TD = window.DATA && window.DATA.TRAPS_DATA ? window.DATA.TRAPS_DATA : [];
  var jobs = TD.filter(function (t) {
    return ["تنبيه", "حرج", "صيانة", "بطارية ضعيفة"].indexOf(t.status) !== -1;
  }).slice(0, 12);

  return (
    <div className="m-page m-page-anim">
      <div style={{padding: "8px 0 12px"}}>
        <div className="m-greeting">فريق الميدان</div>
        <div className="m-name">مهام من البيانات الحية</div>
      </div>
      {jobs.length === 0 ? (
        <div className="list-card" style={{padding: 18, fontSize: 13, color: "var(--ink-3)"}}>
          لا مصايد بحالة صيانة أو تنبيه حالياً — أو لم تُضف مصايد بعد.
        </div>
      ) : (
        jobs.map(function (t, i) {
          return (
            <div key={t._uuid || t.id || i} className="list-card" style={{padding: 14, marginBottom: 10}}>
              <div className="t-mono" style={{fontSize: 10, color:"var(--ink-3)", marginBottom: 4}}>{t.id}</div>
              <div style={{fontWeight: 600}}>{t.farm || "—"}</div>
              <div style={{fontSize: 13, color:"var(--ink-2)", marginTop: 4}}>{t.status} · حشرات اليوم {t.today != null ? t.today : "—"}</div>
              <div style={{fontFamily:"var(--font-mono)", fontSize: 11, marginTop: 8, color:"var(--brand)"}}>{t.lastSeen || ""}</div>
              <button type="button" className="btn btn-primary btn-sm" style={{marginTop: 10}} onClick={() => onNav("trap")}>تفاصيل المصيدة</button>
            </div>
          );
        })
      )}
    </div>
  );
}

// ===== Bottom Nav =====
function BottomNav({ tab, onChange, onNav, role, alertCount }) {
  const homeIcon = role === "admin" ? "Shield" : role === "engineer" ? "Zap" : "Home";
  const homeLabel = role === "admin" ? "لوحة" : role === "engineer" ? "مهام" : "الرئيسية";
  const badge = alertCount > 0 ? alertCount : undefined;
  const items = [
    {id:"home", label: homeLabel, icon: homeIcon},
    {id:"trap", label:"المصيدة", icon:"Trap"},
    {id:"_", label:"", fab: true},
    {id:"alerts", label:"التنبيهات", icon:"Bell", badge: badge},
    {id:"profile", label:"حسابي", icon:"User"},
  ];
  return (
    <div className="bottom-nav">
      {items.map((it, i) => {
        if (it.fab) return (
          <div key={i} className="bnav-item" onClick={() => onNav("technician")}>
            <div className="bnav-fab"><window.I.Plus size={22} sw={2.2}/></div>
          </div>
        );
        const IconC = window.I[it.icon];
        const active = tab === it.id;
        return (
          <div key={it.id} className={"bnav-item " + (active ? "active" : "")} onClick={() => onChange(it.id)} style={{position:"relative"}}>
            <IconC size={20}/>
            <span>{it.label}</span>
            {it.badge && <span style={{
              position:"absolute", top: 2, insetInlineEnd: "30%",
              background:"var(--danger)", color:"#fff",
              fontSize: 9, padding: "1px 5px", borderRadius: 999,
              fontFamily:"var(--font-mono)", fontWeight: 600
            }}>{it.badge}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ===== App =====
function App() {
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("home");
  const [overlay, setOverlay] = useState(null);
  const [, setDataTick] = useState(0);

  useEffect(() => {
    if (!window.KhoosAuth || typeof window.KhoosAuth.init !== "function") {
      setAuthReady(true);
      return;
    }
    window.KhoosAuth.init(function (profile) {
      setSession(profile);
      setAuthReady(true);
      if (window.KhoosData) window.KhoosData.refreshAll();
    });
  }, []);

  useEffect(() => {
    function onAuth(ev) {
      setSession(ev.detail);
      if (ev.detail && window.KhoosData) window.KhoosData.refreshAll();
    }
    window.addEventListener("khoos-auth", onAuth);
    return function () {
      window.removeEventListener("khoos-auth", onAuth);
    };
  }, []);

  useEffect(() => {
    function onData() {
      setDataTick(function (x) {
        return x + 1;
      });
    }
    window.addEventListener("khoos-data", onData);
    return function () {
      window.removeEventListener("khoos-data", onData);
    };
  }, []);

  const logout = async function () {
    await window.KhoosSession.clear();
    setSession(null);
    setTab("home");
    setOverlay(null);
  };

  const navTo = function (p, ctx) {
    if (p === "technician") setOverlay(ctx || "technician");
    else if (p === "subscription") setOverlay("subscription");
    else if (p === "reports") setOverlay("reports");
    else if (p === "alerts") setTab("alerts");
    else setTab(p);
  };

  const role = (session && session.role) || "farmer";
  var alertCount = window.DATA && window.DATA.ALERTS_DATA ? window.DATA.ALERTS_DATA.length : 0;

  let body;
  if (!authReady) {
    body = (
      <div className="m-page" style={{textAlign: "center", padding: 48, color: "var(--ink-3)"}}>
        جاري تحميل الجلسة…
      </div>
    );
  } else if (!session) {
    body = (
      <MobileLogin
        onLoggedIn={function () {
          setSession(window.KhoosAuth.getProfile());
        }}
      />
    );
  } else if (overlay === "technician" || (overlay && overlay._uuid)) {
    const t = overlay && overlay._uuid ? overlay : (window.DATA?.TRAPS_DATA?.[0] || null);
    body = <Technician trap={t} onBack={() => setOverlay(null)}/>;
  } else if (overlay === "subscription") body = <Subscription onBack={() => setOverlay(null)}/>;
  else if (overlay === "reports") body = <ReportsAnalytics onBack={() => setOverlay(null)} session={session}/>;
  else if (tab === "home") {
    if (role === "admin") body = <MobileAdminDash />;
    else if (role === "engineer") body = <MobileEngineerDash onNav={navTo}/>;
    else body = <Home onNav={navTo} session={session}/>;
  } else if (tab === "trap") body = <TrapDetail onBack={() => setTab("home")}/>;
  else if (tab === "alerts") body = <Alerts onNav={navTo}/>;
  else if (tab === "profile") body = <Profile onNav={navTo} session={session} onLogout={logout}/>;

  const showShellHeader =
    !!session && !overlay && (tab === "alerts" || tab === "profile" || tab === "trap");

  const padGuest = !session && !overlay;
  const padTop =
    padGuest
      ? window.innerWidth < 481 ? 14 : 70
      : showShellHeader || overlay
        ? window.innerWidth < 481 ? 56 : 100
        : window.innerWidth < 481 ? 14 : 70;

  return (
    <>
      <div className="scroll-body" style={{paddingTop: padTop}}>
        {body}
      </div>
      {session && !overlay && (
        <BottomNav tab={tab} onChange={setTab} onNav={navTo} role={role} alertCount={alertCount}/>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
