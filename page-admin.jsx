// لوحة الأدمن — نظرة تشغيلية (بيانات تجريبية محليّة)

function AdminHome({ onNav }) {
  var rows = [
    { k: "مستخدمون نشطون", v: "128", d: "+12 هذا الشهر", ok: true },
    { k: "مصايد متصلة", v: "1,240", d: "٠٫٢٪ غير متصلة", ok: true },
    { k: "تنبيهات حرجة (٢٤ س)", v: "7", d: "تحتاج متابعة", ok: false },
    { k: "اشتراكات تنتهي خلال ٧ أيام", v: "14", d: "إرسال تذكير تلقائي", ok: false },
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

window.AdminHome = AdminHome;
