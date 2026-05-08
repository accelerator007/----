// Traps list (CRUD), trap detail drawer, Alerts page, Farms list, Map, Reports

function TrapsPage({ onNav, onSelectTrap }) {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [view, setView] = React.useState("table");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
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

  var TD = window.DATA && window.DATA.TRAPS_DATA ? window.DATA.TRAPS_DATA : [];
  var nAlerts = TD.filter(function (t) {
    return ["تنبيه", "حرج", "بطارية ضعيفة"].indexOf(t.status) !== -1;
  }).length;
  var nOk = TD.filter(function (t) {
    return t.status === "نشط";
  }).length;
  var nOff = TD.filter(function (t) {
    return t.status === "صيانة";
  }).length;

  const filtered = TD.filter(t => {
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
          <p className="page-sub">{TD.length} مصيدة · بيانات من Supabase</p>
        </div>
        <div className="row gap-2">
          <button className="btn btn-secondary btn-sm"><window.I.Download size={14}/>تصدير</button>
          <button className="btn btn-primary btn-sm" onClick={() => setIsAddOpen(true)}><window.I.Plus size={14}/>إضافة مصيدة</button>
        </div>
      </div>

      <AddTrapModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

      <div className="row gap-3" style={{marginBottom: 14}}>
        <div className="topbar" style={{position:"static", padding:0, background:"transparent", border:"none", flex: 1}}>
          <div className="search" style={{maxWidth: 360}}>
            <window.I.Search className="icn" size={15}/>
            <input placeholder="ابحث بالاسم، المعرّف، أو المزرعة..." value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
        <div className="seg">
          {[["all","الكل",TD.length],["alerts","تنبيه",nAlerts],["ok","نشط",nOk],["off","صيانة",nOff]].map(([v,l,n]) => (
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
          <div>عرض {filtered.length} من {TD.length}</div>
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

          {(() => {
            const rec = window.KhoosAI.getRecommendation(trap);
            const bg = rec.status === "danger" ? "var(--danger-soft)" : rec.status === "warn" ? "var(--warn-soft)" : "var(--accent-soft)";
            const icon = rec.status === "danger" ? "Alert" : rec.status === "warn" ? "Spark" : "Check";
            const IconC = window.I[icon];
            return (
              <div className="card card-pad">
                <h3 className="card-title" style={{marginBottom: 10}}>توصية الذكاء الزراعي</h3>
                <div style={{padding: 14, background: bg, borderRadius: 10, fontSize: 13, color:"var(--ink-2)", display:"flex", gap: 12}}>
                  <div style={{marginTop: 2}}><IconC size={18}/></div>
                  <div>
                    <div style={{fontWeight: 700, marginBottom: 4}}>{rec.title}</div>
                    <div style={{lineHeight: 1.5}}>{rec.body}</div>
                  </div>
                </div>
              </div>
            );
          })()}
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

  var AD = window.DATA && window.DATA.ALERTS_DATA ? window.DATA.ALERTS_DATA : [];
  var nOpen = AD.length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">التنبيهات</h1>
          <p className="page-sub">{nOpen} تنبيه من قاعدة البيانات</p>
        </div>
        <div className="row gap-2">
          <button className="btn btn-secondary btn-sm">إعدادات العتبات</button>
          <button className="btn btn-primary btn-sm"><window.I.Check size={14}/>تأكيد الكل</button>
        </div>
      </div>

      <div className="tabs">
        {[["open","المفتوحة",nOpen],["resolved","المحلولة",0],["all","الكل",nOpen]].map(([v,l,n]) => (
          <div key={v} className={"tab " + (tab === v ? "active" : "")} onClick={() => setTab(v)}>
            {l} <span className="t-mono" style={{opacity:.6, marginInlineStart:4}}>{n}</span>
          </div>
        ))}
      </div>

      <div className="col gap-3">
        {AD.map(a => {
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
  const [traps, setTraps] = React.useState(window.DATA?.TRAPS_DATA || []);

  React.useEffect(() => {
    const update = () => setTraps(window.DATA?.TRAPS_DATA || []);
    window.addEventListener("khoos-data", update);
    return () => window.removeEventListener("khoos-data", update);
  }, []);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">الخريطة التفاعلية</h1>
          <p className="page-sub">عرض جغرافي مباشر لجميع المصايد في الميدان</p>
        </div>
        <div className="row gap-2">
          <button className="btn btn-secondary btn-sm" onClick={() => window.KhoosData.refreshAll()}>
            <window.I.Refresh size={14}/> تحديث البيانات
          </button>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 300px", gap: 16, height: "calc(100vh - 180px)"}}>
        <div className="card" style={{position:"relative", overflow:"hidden", padding: 0}}>
          <FieldMap/>
        </div>
        <div className="card" style={{display:"flex", flexDirection:"column", padding: 0}}>
          <div className="card-head" style={{padding: "14px 18px", borderBottom: "1px solid var(--line)"}}>
            <h3 className="card-title">قائمة المصايد ({traps.length})</h3>
          </div>
          <div style={{flex:1, overflow:"auto"}}>
            {traps.length === 0 ? (
              <div style={{padding: 20, textAlign:"center", color:"var(--ink-3)", fontSize:13}}>لا توجد بيانات مصايد</div>
            ) : (
              traps.map((t,i) => (
                <div key={t._uuid || t.id} style={{padding:"12px 18px", borderTop: i? "1px solid var(--line)":"none", display:"flex", gap: 12, alignItems:"center", cursor: "pointer"}}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: t.status === "حرج" ? "var(--danger)" : t.status === "تنبيه" ? "var(--warn)" : "var(--accent)",
                    color:"#fff", display:"grid", placeItems:"center", fontSize: 12, fontWeight: 700,
                    flex:"none", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}>{t.today}</div>
                  <div style={{flex:1, minWidth: 0}}>
                    <div style={{fontSize: 13, fontWeight: 600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", color: "var(--ink)"}}>{t.name}</div>
                    <div style={{fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)"}}>{t.id} · {t.farm}</div>
                  </div>
                  <window.I.Chevron size={14} stroke="var(--line-2)"/>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function AddTrapModal({ isOpen, onClose }) {
  const [formData, setFormData] = React.useState({
    name: "",
    code: "",
    farm_id: "",
    lat: "",
    lng: ""
  });
  const [loading, setLoading] = React.useState(false);

  const farms = window.DATA?.FARMS_DATA || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.khoosSb) return;
    setLoading(true);
    try {
      const { error } = await window.khoosSb.from("traps").insert([{
        name: formData.name,
        code: formData.code || null,
        farm_id: formData.farm_id,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
        status: "نشط"
      }]);
      if (error) throw error;
      await window.KhoosData.refreshAll();
      onClose();
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <window.UI.Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إضافة مصيدة جديدة"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>إلغاء</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "جاري الحفظ..." : "حفظ المصيدة"}
          </button>
        </>
      }
    >
      <div className="col gap-3">
        <div className="field">
          <label>اسم المصيدة</label>
          <input className="input" placeholder="مثلاً: البئر الشمالي" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="field">
          <label>كود المصيدة (اختياري)</label>
          <input className="input" placeholder="TRAP-XXX" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
        </div>
        <div className="field">
          <label>المزرعة</label>
          <select className="input" value={formData.farm_id} onChange={e => setFormData({...formData, farm_id: e.target.value})} required>
            <option value="">اختر مزرعة...</option>
            {farms.map(f => <option key={f._uuid} value={f._uuid}>{f.name}</option>)}
          </select>
        </div>
        <div className="row gap-2">
          <div className="field grow">
            <label>خط العرض (Lat)</label>
            <input className="input" type="number" step="any" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} />
          </div>
          <div className="field grow">
            <label>خط الطول (Lng)</label>
            <input className="input" type="number" step="any" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} />
          </div>
        </div>
      </div>
    </window.UI.Modal>
  );
}

function FieldMap() {
  const mapRef = React.useRef(null);
  const mapInstance = React.useRef(null);

  React.useEffect(() => {
    if (!window.L || !mapRef.current) return;

    const center = [26.3, 44.0]; // Default القصيم region center
    mapInstance.current = L.map(mapRef.current).setView(center, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    const updateMarkers = () => {
      const traps = window.DATA && window.DATA.TRAPS_DATA ? window.DATA.TRAPS_DATA : [];
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) mapInstance.current.removeLayer(layer);
      });

      traps.forEach(t => {
        if (t.lat && t.lng) {
          const color = t.status === "حرج" ? "var(--danger)" : t.status === "تنبيه" ? "var(--warn)" : "var(--accent)";
          const markerHtml = `
            <div style="background:${color}; width:24px; height:24px; border-radius:50%; border:2px solid #fff; color:#fff; display:grid; place-items:center; font-size:11px; font-weight:700; font-family:var(--font-mono)">
              ${t.today}
            </div>
          `;
          const icon = L.divIcon({ html: markerHtml, className: '', iconSize: [24, 24] });
          L.marker([t.lat, t.lng], { icon }).addTo(mapInstance.current)
            .bindPopup(`<b>${t.name}</b><br>${t.id}<br>حشرات اليوم: ${t.today}`);
        }
      });
    };

    updateMarkers();
    window.addEventListener("khoos-data", updateMarkers);
    return () => {
      window.removeEventListener("khoos-data", updateMarkers);
      if (mapInstance.current) mapInstance.current.remove();
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%", zIndex: 1 }} />;
}

window.TrapsPage = TrapsPage;
window.TrapDrawer = TrapDrawer;
window.AlertsPage = AlertsPage;
window.MapPage = MapPage;
