// واجهة المهندس الميداني — مهام وزيارات (بيانات تجريبية)

function EngineerHome({ onNav }) {
  var jobs = [
    {
      id: "JOB-104",
      farm: "مزرعة الواحة",
      trap: "TRAP-004",
      task: "استبدال بطارية + فحص فرمون",
      due: "اليوم · ١٦:٠٠",
      sev: "warn",
    },
    {
      id: "JOB-105",
      farm: "مزرعة النور",
      trap: "TRAP-006",
      task: "إعادة ضبط الاتصال — خارج التغطية",
      due: "غداً · صباحاً",
      sev: "critical",
    },
    {
      id: "JOB-106",
      farm: "مزرعة السلام",
      trap: "TRAP-008",
      task: "زيارة تأكيد بعد تنبيه إصابة",
      due: "خلال ٤٨ ساعة",
      sev: "info",
    },
  ];

  function sevBorder(sev) {
    if (sev === "critical") return "var(--danger)";
    if (sev === "warn") return "var(--warn)";
    return "var(--info)";
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="t-eyebrow">فريق الميدان</div>
          <h1 className="page-title">مهامي اليوم</h1>
          <p className="page-sub">جداول زيارة، مصايد تحتاج تدخّل، وتنبيهات مفتوحة.</p>
        </div>
        <div className="row gap-2">
          <button className="btn btn-secondary btn-sm" onClick={() => onNav("map")}>
            <window.I.Map size={14} /> خريطة التوجيه
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNav("traps")}>
            <window.I.Trap size={14} /> كل المصايد
          </button>
        </div>
      </div>

      <div className="row gap-2" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <div className="card card-pad" style={{ flex: "1 1 140px" }}>
          <div className="t-eyebrow">مفتوحة</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600 }}>٦</div>
        </div>
        <div className="card card-pad" style={{ flex: "1 1 140px" }}>
          <div className="t-eyebrow">مكتملة هذا الأسبوع</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600 }}>٢١</div>
        </div>
        <div className="card card-pad" style={{ flex: "1 1 140px" }}>
          <div className="t-eyebrow">متوسط التقييم</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600 }}>٤٫٩</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <div>
            <h3 className="card-title">قائمة الزيارات</h3>
            <p className="card-sub">مرتبة حسب الأولوية</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNav("alerts")}>
            التنبيهات <window.I.Arrow size={12} />
          </button>
        </div>
        <div>
          {jobs.map(function (j, i) {
            return (
              <div
                key={j.id}
                style={{
                  padding: "14px 18px",
                  borderTop: i ? "1px solid var(--line)" : "none",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 4,
                    alignSelf: "stretch",
                    borderRadius: 2,
                    background: sevBorder(j.sev),
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row between" style={{ marginBottom: 4 }}>
                    <span className="t-mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                      {j.id} · {j.trap}
                    </span>
                    <span className="t-mono" style={{ fontSize: 11 }}>{j.due}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{j.farm}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4 }}>{j.task}</div>
                  <div className="row gap-2" style={{ marginTop: 10 }}>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => onNav("traps")}>
                      بدء التنفيذ
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => onNav("map")}>
                      الموقع
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card card-pad" style={{ background: "var(--bg-2)", borderStyle: "dashed" }}>
        <div className="row gap-3">
          <window.I.Info size={20} stroke="var(--info)" />
          <div style={{ fontSize: 13, lineHeight: 1.55 }}>
            هذه الواجهة تعمل محلياً بدون خادم. لاحقاً يمكن ربط المهام بجدول حقيقي من الـ API.
          </div>
        </div>
      </div>
    </>
  );
}

window.EngineerHome = EngineerHome;
