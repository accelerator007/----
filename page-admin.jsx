// لوحة الأدمن — نظرة تشغيلية (بيانات تجريبية محليّة)

function AdminHome({ onNav }) {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const update = () => setTick(x => x + 1);
    window.addEventListener("khoos-data", update);
    return () => window.removeEventListener("khoos-data", update);
  }, []);

  const UD = window.DATA?.USERS_DATA || [];
  const TD = window.DATA?.TRAPS_DATA || [];
  const AD = window.DATA?.ALERTS_DATA || [];

  const criticalAlerts = AD.filter(a => a.sev === "critical").length;

  var rows = [
    { k: "مستخدمون نشطون", v: UD.length, d: "من قاعدة البيانات", ok: true },
    { k: "مصايد متصلة", v: TD.length, d: "إجمالي الأجهزة النشطة", ok: true },
    { k: "تنبيهات حرجة", v: criticalAlerts, d: criticalAlerts > 0 ? "تحتاج متابعة فورية" : "لا توجد تنبيهات حرجة", ok: criticalAlerts === 0 },
    { k: "إجمالي التنبيهات", v: AD.length, d: "آخر 80 تنبيه", ok: true },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <div className="t-eyebrow">لوحة الإدارة</div>
          <h1 className="page-title">مركز تحكم المنصّة</h1>
          <p className="page-sub">إحصاءات تشغيل وتوجيه سريع لأهم الإجراءات.</p>
        </div>
        <div className="row gap-2">
          <button className="btn btn-secondary btn-sm" onClick={() => onNav("reports")}>
            <window.I.Reports size={14} /> تقارير النظام
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNav("users")}>
            <window.I.Users size={14} /> المستخدمون
          </button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 18 }}>
        {rows.map(function (r, i) {
          return (
            <div key={i} className="card card-pad">
              <div className="t-eyebrow">{r.k}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, marginTop: 6 }}>
                {r.v}
              </div>
              <div style={{ fontSize: 12, color: r.ok ? "var(--accent)" : "var(--danger)", marginTop: 4 }}>
                {r.d}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">اختصارات الإدارة</h3>
              <p className="card-sub">أكثر الصفحات استخداماً للأدمن</p>
            </div>
          </div>
          <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["users", "المستخدمون والصلاحيات", window.I.Users],
              ["billing", "الباقات والفوترة", window.I.Card],
              ["alerts", "التنبيهات على مستوى المنصّة", window.I.Alert],
              ["map", "خريطة التغطية", window.I.Map],
            ].map(function (x) {
              var IconC = x[2];
              return (
                <button
                  key={x[0]}
                  type="button"
                  className="btn btn-secondary"
                  style={{ justifyContent: "flex-start", gap: 10 }}
                  onClick={() => onNav(x[0])}
                >
                  <IconC size={16} /> {x[1]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">سجل نشاط · تجريبي</h3>
              <p className="card-sub">آخر الأحداث (واجهة فقط — لا خادم)</p>
            </div>
          </div>
          <div>
            {[
              ["منذ ٣ دقائق", "تسجيل مستخدم جديد — باقة موسم كامل"],
              ["منذ ١٢ دقيقة", "رفع صورة اكتشاف — جهاز rpi-٠١"],
              ["منذ ساعة", "تنبيه حرج مؤكّد — TRAP-٠٠١"],
              ["منذ ٣ ساعات", "تحديث تعريف جهاز — مصيدة الغربية"],
            ].map(function (ev, i) {
              return (
                <div
                  key={i}
                  style={{
                    padding: "12px 18px",
                    borderTop: i ? "1px solid var(--line)" : "none",
                    fontSize: 13,
                  }}
                >
                  <div className="t-mono" style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 4 }}>
                    {ev[0]}
                  </div>
                  <div>{ev[1]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function BillingAdminPage() {
  const [plans] = React.useState([
    { id: "starter", name: "البداية", price: 9, traps: 1, users: 12 },
    { id: "farmer", name: "المزارع", price: 19, traps: 3, users: 84, popular: true },
    { id: "premium", name: "المتميّز", price: 35, traps: 10, users: 32 },
  ]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">إدارة الاشتراكات</h1>
          <p className="page-sub">نظرة شاملة على باقات المستخدمين والإيرادات المتوقعة</p>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 18 }}>
        <window.UI.KPI eyebrow="إجمالي الإيراد الشهري" value="4,820" unit="ر.ع" delta="+5%" deltaDir="up" />
        <window.UI.KPI eyebrow="مشتركين نشطين" value="246" delta="+12" deltaDir="up" />
        <window.UI.KPI eyebrow="معدل الإلغاء (Churn)" value="2.4" unit="%" delta="-0.5pt" deltaDir="down" accent="var(--ok)" />
      </div>

      <div className="card">
        <div className="card-head">
          <h3 className="card-title">توزيع الباقات</h3>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>الباقة</th>
              <th>السعر (ر.ع)</th>
              <th>المشتركين</th>
              <th>إجمالي الإيراد</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(p => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong></td>
                <td className="t-mono">{p.price}</td>
                <td className="t-mono">{p.users}</td>
                <td className="t-mono">{p.users * p.price}</td>
                <td><window.UI.StatusBadge status="نشط" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

window.AdminHome = AdminHome;
window.BillingAdminPage = BillingAdminPage;
