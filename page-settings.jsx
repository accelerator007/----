// Settings (account/billing/integrations/notifications), Users, Reports, Farms, 404, Notifications drawer

// ===== Settings =====
function SettingsPage({ onNav }) {
  const [tab, setTab] = React.useState("account");
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">الإعدادات</h1>
          <p className="page-sub">إدارة حسابك، الفوترة، التكاملات، وتفضيلات الإشعارات</p>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"220px 1fr", gap: 18}}>
        <div className="card" style={{padding: 8, height:"fit-content"}}>
          {[
            ["account","الحساب","User"],
            ["org","المؤسّسة","Tree"],
            ["billing","الفوترة","Card"],
            ["notifications","الإشعارات","Bell"],
            ["thresholds","عتبات التنبيه","Alert"],
            ["integrations","التكاملات","Plug"],
            ["security","الأمان","Shield"],
            ["lang","اللغة والمنطقة","Globe"],
          ].map(([v,l,i]) => {
            const IconC = window.I[i];
            return (
              <div key={v} className={"nav-item " + (tab === v ? "active" : "")}
                   style={{
                     color: tab === v ? "var(--brand)" : "var(--ink-2)",
                     background: tab === v ? "var(--brand-soft)" : "transparent",
                     boxShadow: "none"
                   }}
                   onClick={() => setTab(v)}>
                <IconC size={16}/>
                <span>{l}</span>
              </div>
            );
          })}
        </div>
        <div>
          {tab === "account" && <AccountTab/>}
          {tab === "org" && <OrgTab/>}
          {tab === "billing" && <BillingTab/>}
          {tab === "notifications" && <NotifPrefsTab/>}
          {tab === "thresholds" && <ThresholdsTab/>}
          {tab === "integrations" && <IntegrationsTab/>}
          {tab === "security" && <SecurityTab/>}
          {tab === "lang" && <LangTab/>}
        </div>
      </div>
    </>
  );
}

function SettingsCard({ title, sub, children, footer }) {
  return (
    <div className="card" style={{marginBottom: 16}}>
      <div className="card-head">
        <div>
          <h3 className="card-title">{title}</h3>
          {sub && <p className="card-sub">{sub}</p>}
        </div>
      </div>
      <div className="card-pad">{children}</div>
      {footer && <div style={{padding:"12px 18px", borderTop:"1px solid var(--line)", background:"var(--bg-2)", display:"flex", justifyContent:"flex-end", gap: 8}}>{footer}</div>}
    </div>
  );
}

function AccountTab() {
  return <>
    <SettingsCard title="الملف الشخصي" sub="هذه المعلومات تظهر لزملائك في الفريق"
      footer={<><button className="btn btn-ghost">إلغاء</button><button className="btn btn-primary">حفظ</button></>}>
      <div style={{display:"grid", gridTemplateColumns:"96px 1fr", gap: 20, alignItems:"start"}}>
        <div>
          <div style={{
            width: 96, height: 96, borderRadius: "50%",
            background: "linear-gradient(135deg, #8a5824, #5a7a3f)",
            display:"grid", placeItems:"center",
            color:"#fff", fontFamily:"var(--font-display)", fontWeight: 600, fontSize: 32
          }}>ع</div>
          <button className="btn btn-ghost btn-sm" style={{marginTop: 8, fontSize: 11}}>تغيير الصورة</button>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 14}}>
          <div className="field"><label>الاسم الكامل</label><input className="input" defaultValue="عبدالله الراشد"/></div>
          <div className="field"><label>الكنية</label><input className="input" defaultValue="أبو فيصل"/></div>
          <div className="field" style={{gridColumn:"span 2"}}><label>البريد الإلكتروني</label><input className="input" defaultValue="abdullah@nakhl.sa" dir="ltr"/></div>
          <div className="field" style={{gridColumn:"span 2"}}><label>الجوّال</label><input className="input" defaultValue="+966 50 123 4567" dir="ltr"/></div>
        </div>
      </div>
    </SettingsCard>

    <SettingsCard title="المنطقة الخطرة" sub="إجراءات لا يمكن التراجع عنها">
      <div className="row between" style={{padding: 4}}>
        <div>
          <div style={{fontWeight: 500, color:"var(--danger)"}}>حذف الحساب</div>
          <div style={{fontSize: 12, color:"var(--ink-3)", marginTop: 2}}>سيتم حذف بياناتك بالكامل خلال 30 يوماً.</div>
        </div>
        <button className="btn btn-secondary" style={{borderColor:"var(--danger)", color:"var(--danger)"}}>حذف الحساب</button>
      </div>
    </SettingsCard>
  </>;
}

function OrgTab() {
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState(window.KhoosAuth.getProfile() || {});

  const handleSave = async () => {
    if (!window.khoosSb || !profile.userId) return;
    setLoading(true);
    try {
      const { error } = await window.khoosSb.from("profiles").update({
        subtitle: profile.subtitle
      }).eq("id", profile.userId);
      if (error) throw error;
      await window.KhoosAuth.init(); // Refresh profile
      alert("تم الحفظ بنجاح");
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return <SettingsCard title="معلومات المؤسّسة"
    footer={<button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading ? "جاري الحفظ..." : "حفظ التغييرات"}</button>}>
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 14}}>
      <div className="field"><label>اسم المؤسّسة</label><input className="input" value={profile.subtitle || ""} onChange={e => setProfile({...profile, subtitle: e.target.value})}/></div>
      <div className="field"><label>السجل التجاري</label><input className="input" defaultValue="1010xxxxxx" dir="ltr"/></div>
      <div className="field"><label>المنطقة</label><select className="select"><option>القصيم</option><option>الأحساء</option></select></div>
      <div className="field"><label>المساحة الإجماليّة (هكتار)</label><input className="input" defaultValue="39"/></div>
      <div className="field" style={{gridColumn:"span 2"}}><label>العنوان</label><textarea className="textarea" rows="2" defaultValue="بريدة، طريق المدينة، حيّ النخيل، رقم 247"/></div>
    </div>
  </SettingsCard>;
}

function UpgradePlanModal({ isOpen, onClose }) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <window.UI.Modal isOpen={isOpen} onClose={onClose} title="ترقية الخطة">
      {success ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--ok-soft)", color: "var(--ok)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
            <window.I.Check size={30} sw={2.5} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 600 }}>تم الترقية بنجاح!</h3>
          <p style={{ color: "var(--ink-3)", marginTop: 8 }}>تم تحديث خطتك بنجاح. ستظهر التغييرات في فاتورتك القادمة.</p>
          <button className="btn btn-primary" style={{ marginTop: 24, width: "100%" }} onClick={onClose}>إغلاق</button>
        </div>
      ) : (
        <div className="col gap-4">
          <div style={{ padding: 16, background: "var(--bg-2)", borderRadius: 12 }}>
            <div className="row between">
              <div>
                <div style={{ fontWeight: 600 }}>الخطة الاحترافية</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>دعم حتى 100 مصيدة + ذكاء اصطناعي</div>
              </div>
              <div style={{ fontWeight: 700 }}>999 ر.س</div>
            </div>
          </div>
          <div className="field">
            <label>بيانات البطاقة</label>
            <div style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <window.I.Card size={18} />
              <div style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 14 }}>•••• •••• •••• 4242</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>12/26</div>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handlePay} disabled={loading}>
            {loading ? "جاري المعالجة..." : "تأكيد الدفع والترقية"}
          </button>
        </div>
      )}
    </window.UI.Modal>
  );
}

function BillingTab() {
  const [isUpgradeOpen, setIsUpgradeOpen] = React.useState(false);
  return <>
    <UpgradePlanModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    <div className="card" style={{padding: 22, marginBottom: 16, background:"linear-gradient(135deg, #2a2218 0%, #1f1a14 100%)", color:"#f0e6cf"}}>
      <div className="row between">
        <div>
          <div className="t-eyebrow" style={{color:"#a89776"}}>الخطة الحاليّة</div>
          <div className="t-display" style={{fontSize: 26, fontWeight: 600, marginTop: 4, color:"#f3e2bd"}}>المزرعة</div>
          <div style={{fontSize: 13, color:"#c9bca0", marginTop: 6}}>حتى 50 مصيدة · تجدّد في 12 يونيو 2026</div>
        </div>
        <div style={{textAlign:"end"}}>
          <div style={{fontFamily:"var(--font-display)", fontSize: 32, fontWeight: 600}}>599 <span style={{fontSize: 12, color:"#a89776"}}>ر.س / شهر</span></div>
          <button className="btn btn-sm" style={{background:"#d4a35a", color:"#1f1a14", marginTop: 6}} onClick={() => setIsUpgradeOpen(true)}>ترقية الخطّة</button>
        </div>
      </div>
      <div style={{height:1, background:"rgba(233,223,201,.1)", margin:"18px 0"}}/>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap: 12}}>
        <div>
          <div className="t-eyebrow" style={{color:"#a89776"}}>المصايد المستخدمة</div>
          <div style={{fontFamily:"var(--font-display)", fontSize: 22, fontWeight:600, marginTop: 4}}>8 / 50</div>
          <div style={{height: 4, background: "rgba(233,223,201,.15)", borderRadius: 2, marginTop: 6}}>
            <div style={{width: "16%", height:"100%", background:"#d4a35a", borderRadius: 2}}/>
          </div>
        </div>
        <div>
          <div className="t-eyebrow" style={{color:"#a89776"}}>أعضاء الفريق</div>
          <div style={{fontFamily:"var(--font-display)", fontSize: 22, fontWeight:600, marginTop: 4}}>4 / 10</div>
        </div>
        <div>
          <div className="t-eyebrow" style={{color:"#a89776"}}>الفاتورة القادمة</div>
          <div style={{fontFamily:"var(--font-display)", fontSize: 22, fontWeight:600, marginTop: 4}}>599 ر.س</div>
        </div>
      </div>
    </div>

    <SettingsCard title="طريقة الدفع">
      <div className="row gap-3">
        <div style={{
          width: 56, height: 36, borderRadius: 6,
          background: "linear-gradient(135deg, #1a1f71, #4759c4)",
          color:"#fff", display:"grid", placeItems:"center",
          fontFamily:"var(--font-mono)", fontWeight: 700, fontSize: 11
        }}>VISA</div>
        <div style={{flex:1}}>
          <div style={{fontWeight: 500}}>•••• 4242</div>
          <div style={{fontSize: 12, color:"var(--ink-3)"}}>تنتهي 09/2027</div>
        </div>
        <button className="btn btn-secondary btn-sm">تغيير</button>
      </div>
    </SettingsCard>

    <SettingsCard title="الفواتير السابقة">
      <table className="tbl">
        <thead><tr><th>الرقم</th><th>التاريخ</th><th>المبلغ</th><th>الحالة</th><th></th></tr></thead>
        <tbody>
          {[["INV-2026-005","12 مايو 2026","599 ر.س"],["INV-2026-004","12 أبريل 2026","599 ر.س"],["INV-2026-003","12 مارس 2026","599 ر.س"]].map(([n,d,a]) => (
            <tr key={n}>
              <td className="t-mono">{n}</td>
              <td>{d}</td>
              <td className="t-mono">{a}</td>
              <td><span className="badge ok"><span className="pulse"/>مدفوعة</span></td>
              <td><button className="btn btn-ghost btn-sm"><window.I.Download size={13}/>PDF</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </SettingsCard>
  </>;
}

function NotifPrefsTab() {
  return <SettingsCard title="قنوات الإشعار" sub="اختر القنوات لكل نوع تنبيه">
    <table className="tbl">
      <thead><tr><th>النوع</th><th>داخل التطبيق</th><th>البريد</th><th>WhatsApp</th><th>SMS</th></tr></thead>
      <tbody>
        {[
          ["تنبيهات حرجة (تجاوز العتبة)", true, true, true, true],
          ["تنبيهات تحذيريّة", true, true, true, false],
          ["بطّاريّة منخفضة", true, true, false, false],
          ["تقارير أسبوعيّة", false, true, false, false],
          ["تحديثات النظام", true, false, false, false],
        ].map(([n, ...vals], i) => (
          <tr key={i}>
            <td style={{fontWeight: 500}}>{n}</td>
            {vals.map((v, k) => (
              <td key={k}><label className="checkbox"><input type="checkbox" defaultChecked={v}/></label></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </SettingsCard>;
}

function ThresholdsTab() {
  return <SettingsCard title="عتبات التنبيه" sub="ضبط عدد الحشرات الذي يطلق التنبيه"
    footer={<button className="btn btn-primary">حفظ العتبات</button>}>
    <div className="col gap-4">
      {[
        {l:"تنبيه تحذيري", v: 8, c:"var(--warn)", d:"في الـ24 ساعة الأخيرة"},
        {l:"تنبيه حرج",     v: 20, c:"var(--danger)", d:"في الـ24 ساعة الأخيرة"},
        {l:"بطّاريّة ضعيفة", v: 20, c:"var(--warn)", d:"٪ من الشحن المتبقّي"},
      ].map((t,i) => (
        <div key={i} className="row gap-4" style={{padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--line)":"none"}}>
          <div style={{flex: 1}}>
            <div className="row gap-2"><span style={{width:8, height:8, borderRadius:"50%", background:t.c}}/><strong style={{fontSize:14}}>{t.l}</strong></div>
            <div className="t-muted" style={{fontSize: 12}}>{t.d}</div>
          </div>
          <input className="input" defaultValue={t.v} style={{width: 80, textAlign:"center", fontFamily:"var(--font-mono)"}}/>
        </div>
      ))}
    </div>
  </SettingsCard>;
}

function IntegrationsTab() {
  const items = [
    {n:"WhatsApp Business", d:"إرسال التنبيهات والتقارير", icon:"💬", connected: true},
    {n:"Slack", d:"قناة فريق العمل", icon:"💬", connected: false},
    {n:"Google Sheets", d:"تصدير تلقائي للبيانات", icon:"📊", connected: true},
    {n:"Webhook", d:"إرسال الأحداث لنظامك", icon:"🔌", connected: false},
    {n:"Zapier", d:"اربط مع 5000+ تطبيق", icon:"⚡", connected: false},
    {n:"Telegram", d:"تنبيهات فورية", icon:"✈️", connected: false},
  ];
  return <SettingsCard title="التكاملات">
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12}}>
      {items.map((it, i) => (
        <div key={i} className="card card-pad" style={{padding: 14, display:"flex", gap: 12, alignItems:"center"}}>
          <div style={{width: 40, height: 40, borderRadius: 10, background: "var(--bg-2)", display:"grid", placeItems:"center", fontSize: 22, flex:"none"}}>{it.icon}</div>
          <div style={{flex: 1}}>
            <div style={{fontWeight: 500, fontSize: 13}}>{it.n}</div>
            <div style={{fontSize: 11, color:"var(--ink-3)"}}>{it.d}</div>
          </div>
          {it.connected ? <span className="badge ok"><span className="pulse"/>متّصل</span>
            : <button className="btn btn-secondary btn-sm">ربط</button>}
        </div>
      ))}
    </div>
  </SettingsCard>;
}

function SecurityTab() {
  return <>
    <SettingsCard title="كلمة المرور"
      footer={<button className="btn btn-primary">تحديث كلمة المرور</button>}>
      <div className="col gap-3" style={{maxWidth: 400}}>
        <div className="field"><label>كلمة المرور الحاليّة</label><input className="input" type="password"/></div>
        <div className="field"><label>كلمة المرور الجديدة</label><input className="input" type="password"/></div>
        <div className="field"><label>تأكيد كلمة المرور</label><input className="input" type="password"/></div>
      </div>
    </SettingsCard>

    <SettingsCard title="المصادقة الثنائيّة" sub="حماية إضافيّة لحسابك">
      <div className="row between">
        <div>
          <div style={{fontWeight: 500}}>تطبيق المصادقة</div>
          <div className="t-muted" style={{fontSize: 12}}>Google Authenticator أو 1Password</div>
        </div>
        <button className="btn btn-primary btn-sm">تفعيل</button>
      </div>
    </SettingsCard>

    <SettingsCard title="الجلسات النشطة">
      {[
        {d:"iPhone 15 · Safari", l:"الرياض، السعوديّة", t:"نشط الآن", current: true},
        {d:"MacBook Pro · Chrome", l:"الرياض، السعوديّة", t:"قبل 3 ساعات"},
        {d:"iPad Air · Safari", l:"بريدة، السعوديّة", t:"قبل يومين"},
      ].map((s, i) => (
        <div key={i} className="row between" style={{padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--line)":"none"}}>
          <div>
            <div style={{fontWeight: 500, fontSize: 13}}>{s.d} {s.current && <span className="badge ok" style={{marginInlineStart: 8}}><span className="pulse"/>هذا الجهاز</span>}</div>
            <div className="t-muted" style={{fontSize: 11}}>{s.l} · {s.t}</div>
          </div>
          {!s.current && <button className="btn btn-ghost btn-sm" style={{color:"var(--danger)"}}>إنهاء</button>}
        </div>
      ))}
    </SettingsCard>
  </>;
}

function LangTab() {
  return <SettingsCard title="اللغة والمنطقة"
    footer={<button className="btn btn-primary">حفظ</button>}>
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 14}}>
      <div className="field"><label>لغة الواجهة</label>
        <select className="select"><option>العربيّة</option><option>English</option></select></div>
      <div className="field"><label>المنطقة الزمنيّة</label>
        <select className="select"><option>توقيت الرياض (GMT+3)</option></select></div>
      <div className="field"><label>تنسيق التاريخ</label>
        <select className="select"><option>هجري · 1447/10/12</option><option>ميلادي · 12/05/2026</option></select></div>
      <div className="field"><label>العملة</label>
        <select className="select"><option>ريال سعودي (ر.س)</option></select></div>
    </div>
  </SettingsCard>;
}

// ===== Users & roles =====
function UsersPage() {
  const [drawer, setDrawer] = React.useState(false);
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
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

  return <>
    <div className="page-head">
      <div>
        <h1 className="page-title">المستخدمون والصلاحيّات</h1>
        <p className="page-sub">{UD.length} مستخدم (يظهر لصلاحية الأدمن فقط)</p>
      </div>
      <button className="btn btn-primary btn-sm" onClick={() => setDrawer(true)}><window.I.Plus size={14}/>دعوة عضو</button>
    </div>

    <div className="card">
      <table className="tbl">
        <thead>
          <tr><th>العضو</th><th>الدور</th><th>المزارع</th><th>آخر نشاط</th><th>الحالة</th><th></th></tr>
        </thead>
        <tbody>
          {UD.map(u => (
            <tr key={u._uuid || u.id}>
              <td>
                <div className="row gap-3">
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "linear-gradient(135deg, #8a5824, #5a7a3f)",
                    color:"#fff", display:"grid", placeItems:"center", fontWeight: 600
                  }}>{u.name[0]}</div>
                  <div>
                    <div style={{fontWeight: 500}}>{u.name}</div>
                    <div className="id" style={{textTransform:"none"}}>{u.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge" style={{background:"var(--bg-2)", color:"var(--ink-2)"}}>{u.role}</span>
              </td>
              <td className="t-muted" style={{fontSize: 12}}>الواحة، النور</td>
              <td className="t-muted" style={{fontSize: 12}}>{u.last}</td>
              <td><window.UI.StatusBadge status={u.active ? "نشط" : "غير نشط"}/></td>
              <td><button className="icon-btn"><window.I.More size={16}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="card" style={{marginTop: 16, padding: 18}}>
      <h3 className="card-title" style={{marginBottom: 12}}>الأدوار والصلاحيّات</h3>
      <table className="tbl">
        <thead><tr><th>الصلاحيّة</th><th>مالك</th><th>مهندس زراعي</th><th>محلّل</th><th>فنّي ميداني</th></tr></thead>
        <tbody>
          {[
            ["عرض المصايد", "✓", "✓", "✓", "✓"],
            ["إدارة المصايد (إضافة/حذف)", "✓", "✓", "—", "—"],
            ["معايرة الأجهزة", "✓", "✓", "—", "✓"],
            ["إدارة المستخدمين", "✓", "—", "—", "—"],
            ["الفوترة والاشتراك", "✓", "—", "—", "—"],
            ["تصدير التقارير", "✓", "✓", "✓", "—"],
          ].map((r, i) => (
            <tr key={i}>
              <td style={{fontWeight: 500}}>{r[0]}</td>
              {r.slice(1).map((c, k) => <td key={k} style={{color: c === "✓" ? "var(--ok)" : "var(--ink-4)"}}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {drawer && <InviteDrawer onClose={() => setDrawer(false)}/>}
  </>;
}

function InviteDrawer({ onClose }) {
  return <>
    <div className="drawer-bg" onClick={onClose}/>
    <div className="drawer">
      <div style={{padding: 18, borderBottom: "1px solid var(--line)"}}>
        <div className="row between">
          <h2 className="t-display" style={{fontSize: 20, margin: 0}}>دعوة عضو جديد</h2>
          <button className="icon-btn" onClick={onClose}><window.I.X size={18}/></button>
        </div>
      </div>
      <div style={{padding: 18, flex:1, overflow:"auto"}} className="col gap-4">
        <div className="field"><label>البريد الإلكتروني</label><input className="input" placeholder="email@example.com" autoFocus dir="ltr"/></div>
        <div className="field"><label>الاسم (اختياري)</label><input className="input" placeholder="الاسم الكامل"/></div>
        <div className="field"><label>الدور</label>
          <select className="select"><option>مهندس زراعي</option><option>محلّل بيانات</option><option>فنّي ميداني</option></select>
        </div>
        <div className="field"><label>المزارع المسموحة</label>
          <div className="col gap-2">
            <label className="checkbox"><input type="checkbox" defaultChecked/> مزرعة الواحة</label>
            <label className="checkbox"><input type="checkbox"/> مزرعة النور</label>
            <label className="checkbox"><input type="checkbox"/> مزرعة السلام</label>
          </div>
        </div>
        <div className="field"><label>رسالة شخصيّة (اختياريّة)</label><textarea className="textarea" rows="3" placeholder="مرحباً، انضم لفريقنا في خوص..."/></div>
      </div>
      <div style={{padding: 14, borderTop: "1px solid var(--line)", display:"flex", gap: 8}}>
        <button className="btn btn-ghost grow" onClick={onClose}>إلغاء</button>
        <button className="btn btn-primary grow" style={{justifyContent:"center"}} onClick={onClose}>
          <window.I.Send size={14}/>إرسال الدعوة
        </button>
      </div>
    </div>
  </>;
}

// ===== Reports =====
function ReportsPage() {
  return <>
    <div className="page-head">
      <div>
        <h1 className="page-title">التقارير والتحليلات</h1>
        <p className="page-sub">رؤى عميقة لمساعدتك في اتخاذ القرار</p>
      </div>
      <div className="row gap-2">
        <button className="btn btn-secondary btn-sm"><window.I.Calendar size={14}/>هذا الشهر</button>
        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><window.I.Download size={14}/>تصدير PDF</button>
      </div>
    </div>

    <div className="kpi-grid" style={{marginBottom: 16}}>
      <window.UI.KPI eyebrow="إجمالي الحشرات" value="1,847" delta="+12%" deltaDir="up" spark={[120,140,180,160,210,240,260]}/>
      <window.UI.KPI eyebrow="معدّل اكتشاف مبكّر" value="38" unit="٪" delta="+8pt" deltaDir="up" spark={[20,24,28,30,32,35,38]} accent="var(--accent)"/>
      <window.UI.KPI eyebrow="استجابة متوسّطة" value="4.2" unit="ساعة" delta="−1.1" deltaDir="down" spark={[6,5.5,5.2,4.8,4.5,4.3,4.2]}/>
      <window.UI.KPI eyebrow="عمليات معالجة" value="14" delta="+3" deltaDir="up" spark={[2,3,2,4,3,5,3]}/>
    </div>

    <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap: 16, marginBottom: 16}}>
      <div className="card">
        <div className="card-head">
          <div>
            <h3 className="card-title">المقارنة الشهريّة</h3>
            <p className="card-sub">حشرات مرصودة شهريّاً · هذا العام مقابل العام السابق</p>
          </div>
        </div>
        <div className="card-pad">
          <window.UI.BarChart data={[
            {label:"يناير", values:[120, 95]}, {label:"فبراير", values:[140, 130]},
            {label:"مارس", values:[180, 160]}, {label:"أبريل", values:[210, 195]},
            {label:"مايو", values:[260, 220]},
          ]}/>
          <div className="row gap-4" style={{marginTop: 10, fontSize: 12}}>
            <span><span style={{display:"inline-block", width: 10, height:10, background:"var(--brand)", borderRadius:2, marginInlineEnd: 6}}/>2026</span>
            <span><span style={{display:"inline-block", width: 10, height:10, background:"var(--accent)", borderRadius:2, marginInlineEnd: 6}}/>2025</span>
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <h3 className="card-title">أنواع الحشرات</h3>
        <p className="card-sub" style={{marginBottom: 16}}>التركيب النوعي للرصد</p>
        {[
          {n:"سوسة النخيل الحمراء", v: 1240, p: 67, c: "var(--brand)"},
          {n:"حلم الغبار", v: 312, p: 17, c: "var(--accent)"},
          {n:"دودة الطلع", v: 198, p: 11, c: "var(--warn)"},
          {n:"غير محدّد", v: 97, p: 5, c: "var(--ink-4)"},
        ].map((s,i) => (
          <div key={i} style={{padding:"10px 0", borderTop: i? "1px solid var(--line)":"none"}}>
            <div className="row between" style={{marginBottom: 4}}>
              <div style={{fontSize: 13}}>{s.n}</div>
              <div className="t-mono" style={{fontSize: 12}}>{s.v}</div>
            </div>
            <div style={{height: 5, background:"var(--bg-3)", borderRadius:2, overflow:"hidden"}}>
              <div style={{width: s.p+"%", height:"100%", background: s.c}}/>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="card">
      <div className="card-head">
        <h3 className="card-title">التقارير المجدولة</h3>
        <button className="btn btn-secondary btn-sm"><window.I.Plus size={14}/>تقرير جديد</button>
      </div>
      <table className="tbl">
        <thead><tr><th>التقرير</th><th>التكرار</th><th>المستلمون</th><th>الحالة</th><th></th></tr></thead>
        <tbody>
          {[
            ["ملخّص أسبوعي", "كل أحد · 8:00ص", "5 مستلمين"],
            ["تقرير الإصابة الشهري", "أوّل كل شهر", "12 مستلم"],
            ["تنبيهات يوميّة", "يومي · 7:00ص", "3 مستلمين"],
          ].map(([n, f, r], i) => (
            <tr key={i}>
              <td style={{fontWeight: 500}}>{n}</td>
              <td className="t-muted" style={{fontSize: 12}}>{f}</td>
              <td className="t-muted" style={{fontSize: 12}}>{r}</td>
              <td><span className="badge ok"><span className="pulse"/>نشط</span></td>
              <td><button className="icon-btn"><window.I.Edit size={14}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>;
}

// ===== Farms =====
function FarmsPage() {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
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
  var FD = window.DATA && window.DATA.FARMS_DATA ? window.DATA.FARMS_DATA : [];
  var totalHa = FD.reduce(function (s, f) {
    return s + (Number(f.hectares) || 0);
  }, 0);
  var totalTraps = FD.reduce(function (s, f) {
    return s + (Number(f.traps) || 0);
  }, 0);

  return <>
    <div className="page-head">
      <div>
        <h1 className="page-title">المزارع</h1>
        <p className="page-sub">{FD.length} مزرعة · {Math.round(totalHa)} هكتار · {totalTraps} مصيدة</p>
      </div>
      <button className="btn btn-primary btn-sm"><window.I.Plus size={14}/>إضافة مزرعة</button>
    </div>
    <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap: 14}}>
      {FD.map(f => {
        const riskColor = f.risk === "high" ? "var(--danger)" : f.risk === "med" ? "var(--warn)" : "var(--accent)";
        return (
          <div key={f._uuid || f.id} className="card" style={{overflow:"hidden"}}>
            <div style={{
              height: 90,
              background: `linear-gradient(135deg, var(--accent-soft), var(--brand-soft))`,
              position:"relative",
              display:"flex", alignItems:"center", justifyContent:"center"
            }}>
              <window.I.Tree size={42} stroke="var(--brand)" sw={1.2} style={{opacity:.5}}/>
              <div style={{position:"absolute", top: 10, insetInlineEnd: 10}}>
                <span className="badge" style={{background: riskColor, color:"#fff"}}>
                  <span className="pulse" style={{background:"#fff"}}/>
                  {f.risk === "high" ? "خطر مرتفع" : f.risk === "med" ? "خطر متوسط" : "آمنة"}
                </span>
              </div>
            </div>
            <div className="card-pad">
              <div className="t-eyebrow">{f.region}</div>
              <h3 className="t-display" style={{fontSize: 18, fontWeight: 600, margin: "4px 0 6px"}}>{f.name}</h3>
              <div className="row gap-4" style={{fontSize: 12, color:"var(--ink-3)", marginTop: 8}}>
                <span><window.I.Trap size={13}/> {f.traps} مصيدة</span>
                <span><window.I.Map size={13}/> {f.hectares} هكتار</span>
                <span><window.I.User size={13}/> {f.owner}</span>
              </div>
              <div className="row gap-2" style={{marginTop: 14}}>
                <button className="btn btn-secondary btn-sm grow" style={{justifyContent:"center"}}>التفاصيل</button>
                <button className="btn btn-ghost btn-sm"><window.I.More size={16}/></button>
              </div>
            </div>
          </div>
        );
      })}
      {/* Add new card */}
      <div className="card" style={{padding: 30, border:"1px dashed var(--line-2)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", color:"var(--ink-3)", cursor:"pointer", minHeight: 240}}>
        <window.I.Plus size={28}/>
        <div style={{marginTop: 10, fontWeight: 500}}>إضافة مزرعة جديدة</div>
        <div style={{fontSize: 12, marginTop: 4}}>سجّل مزرعتك وأضف مصايدك</div>
      </div>
    </div>
  </>;
}

// ===== 404 =====
function NotFound({ onNav }) {
  return (
    <div style={{minHeight: "100vh", display:"flex", alignItems:"center", justifyContent:"center", padding: 40, background:"var(--bg)"}}>
      <div style={{maxWidth: 440, textAlign:"center"}}>
        <div className="t-mono" style={{fontSize: 96, fontWeight: 700, color: "var(--brand)", lineHeight: 1, letterSpacing:"-.04em"}}>404</div>
        <h1 className="t-display" style={{fontSize: 28, fontWeight: 600, margin: "12px 0 8px"}}>هذه الصفحة في مزرعة أخرى</h1>
        <p className="t-muted" style={{margin:"0 0 24px"}}>الرابط الذي اتّبعته غير موجود، أو قد تكون الصفحة قد نُقلت.</p>
        <div className="row gap-3 center">
          <button className="btn btn-secondary" onClick={() => history.back()}>
            <window.I.Arrow size={14}/>رجوع
          </button>
          <button className="btn btn-primary" onClick={() => onNav("dashboard")}>
            <window.I.Home size={14}/>الذهاب للوحة التحكّم
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Notifications drawer =====
function NotificationsDrawer({ onClose, onNav }) {
  return <>
    <div className="drawer-bg" onClick={onClose}/>
    <div className="drawer">
      <div style={{padding: 18, borderBottom: "1px solid var(--line)"}}>
        <div className="row between">
          <h2 className="t-display" style={{fontSize: 20, margin: 0}}>الإشعارات</h2>
          <div className="row gap-1">
            <button className="btn btn-ghost btn-sm">تأكيد الكل</button>
            <button className="icon-btn" onClick={onClose}><window.I.X size={18}/></button>
          </div>
        </div>
      </div>
      <div style={{flex:1, overflow:"auto"}}>
        {[
          {t:"تنبيه حرج: TRAP-001", d:"تجاوزت العتبة (28 حشرة)", time:"قبل 14 دقيقة", sev:"critical", new: true},
          {t:"بطّاريّة منخفضة: TRAP-004", d:"الشحن المتبقّي 14%", time:"قبل ساعتين", sev:"warn", new: true},
          {t:"تقرير أسبوعي جاهز", d:"ملخّص الأسبوع 18", time:"قبل 4 ساعات", sev:"info", new: true},
          {t:"عضو جديد انضمّ", d:"خالد العتيبي قبل الدعوة", time:"أمس", sev:"info"},
          {t:"المعالجة اكتملت", d:"TRAP-005 · رشّ تلقائي", time:"أمس", sev:"ok"},
          {t:"اشتراكك يجدّد قريباً", d:"بعد 12 يوم", time:"قبل 3 أيام", sev:"info"},
        ].map((n, i) => {
          const c = n.sev === "critical" ? "var(--danger)" : n.sev === "warn" ? "var(--warn)" : n.sev === "ok" ? "var(--ok)" : "var(--info)";
          return (
            <div key={i} style={{padding:"14px 18px", borderBottom: "1px solid var(--line)", background: n.new ? "var(--bg-2)" : "transparent", display:"flex", gap: 12, cursor:"pointer"}}>
              <div style={{width: 8, height: 8, borderRadius:"50%", background: n.new ? c : "transparent", marginTop: 8, flex:"none"}}/>
              <div style={{flex:1}}>
                <div style={{fontSize: 13, fontWeight: 500}}>{n.t}</div>
                <div style={{fontSize: 12, color:"var(--ink-3)", marginTop: 2}}>{n.d}</div>
                <div className="t-mono" style={{fontSize: 10, color:"var(--ink-4)", marginTop: 4}}>{n.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </>;
}

window.SettingsPage = SettingsPage;
window.UsersPage = UsersPage;
window.ReportsPage = ReportsPage;
window.FarmsPage = FarmsPage;
window.NotFound = NotFound;
window.NotificationsDrawer = NotificationsDrawer;
