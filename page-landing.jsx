// Landing page — sales/marketing site for خوص

function Landing({ onNav, variant = "warm" }) {
  return (
    <div style={{background: "var(--bg)", minHeight: "100vh"}}>
      {/* Nav */}
      <div className="land-nav">
        <div className="row gap-2">
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #d4a35a, #6f4318)",
            display:"grid", placeItems:"center",
            color:"#1f1a14", fontFamily:"var(--font-display)", fontWeight:700, fontSize: 16, overflow:"hidden"
          }}><img src="assets/khoos-logo.png" alt="خوص" style={{width:28,height:28,objectFit:"contain"}}/></div>
          <div style={{fontFamily:"var(--font-display)", fontSize: 18, fontWeight: 600}}>خوص</div>
        </div>
        <nav className="links">
          <a href="#features">المميزات</a>
          <a href="#how">كيف يعمل</a>
          <a href="#pricing">الأسعار</a>
          <a href="#faq">الأسئلة</a>
        </nav>
        <div className="row gap-2" style={{marginInlineStart:"auto"}}>
          <button className="btn btn-ghost btn-sm" onClick={() => onNav("login")}>تسجيل الدخول</button>
          <button className="btn btn-primary btn-sm" onClick={() => onNav("signup")}>ابدأ مجاناً</button>
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <span className="badge-pill"><span className="dot"/>مدعوم بشبكة LoRaWAN منخفضة الطاقة</span>
        <h1>احمِ نخيلك من سوسة النخيل<br/>قبل أن ترى الأعراض</h1>
        <p>خوص منصّة استشعار ذكية تربط مصايد الفرمونات بلوحة تحكم واحدة. اكتشف الإصابات مبكراً، حدّد أماكنها بدقّة، وتدخّل في الوقت المناسب.</p>
        <div className="row gap-3 center">
          <button className="btn btn-primary btn-lg" onClick={() => onNav("signup")}>
            جرّب 14 يوم مجاناً
            <window.I.Arrow size={14} style={{transform:"scaleX(-1)"}}/>
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => onNav("login")}>
            <window.I.Arrow size={14} style={{transform:"scaleX(-1)"}}/>
            تسجيل الدخول
          </button>
        </div>
        <div style={{marginTop: 18, fontSize: 12, color: "var(--ink-3)"}}>
          بدون بطاقة ائتمان · إعداد في 5 دقائق · يدعم العربية والإنجليزية
        </div>

        {/* Hero visual */}
        <div style={{
          marginTop: 56,
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 18,
          boxShadow: "var(--sh-3)",
          padding: 14,
          maxWidth: 1080,
          marginLeft: "auto", marginRight: "auto",
          textAlign: "start",
        }}>
          <HeroPreview/>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)", background: "var(--bg-2)"}}>
        <div style={{maxWidth: 1100, margin: "0 auto", padding: "32px", display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap: 20}}>
          {[
            {k: "+38%", v: "كشف مبكر للإصابات", s: "خلال أول موسم تجربة"},
            {k: "−54%", v: "خفض المبيدات الكيميائية", s: "بفضل الرصد المستهدف"},
            {k: "1,240", v: "مصيدة نشطة في الميدان", s: "موزّعة على 3 مناطق"},
            {k: "24/7", v: "مراقبة مستمرة", s: "تنبيهات فوريّة عبر WhatsApp"},
          ].map((s, i) => (
            <div key={i}>
              <div style={{fontFamily:"var(--font-display)", fontSize: 36, fontWeight: 600, color: "var(--brand)"}}>{s.k}</div>
              <div style={{fontWeight: 500, fontSize: 14, marginTop: 2}}>{s.v}</div>
              <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 2}}>{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{padding: "80px 32px", maxWidth: 1100, margin: "0 auto"}}>
        <div style={{textAlign:"center", marginBottom: 48}}>
          <div className="t-eyebrow">المميزات</div>
          <h2 className="t-display" style={{fontSize: 38, margin: "10px 0", letterSpacing:"-.02em"}}>كل ما يحتاجه مزارع النخيل،<br/>في مكان واحد</h2>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap: 20}}>
          {[
            {i:"Trap", t:"رصد المصايد عن بُعد", d:"اعرف عدد الحشرات في كل مصيدة، حالة البطارية، وقوة الإشارة لحظياً."},
            {i:"Alert", t:"تنبيهات قبل الكارثة", d:"إشعارات فورية حين تتجاوز أيّ مصيدة عتبة الإصابة المحدّدة."},
            {i:"Map", t:"خريطة حرارية للإصابة", d:"تصوّر بصري لمواقع التركّز يوجّه فِرَق المعالجة بدقّة."},
            {i:"Reports", t:"تقارير قابلة للتصدير", d:"تقارير أسبوعية وشهريّة جاهزة لـ PDF و Excel، تشاركها بنقرة."},
            {i:"Wifi", t:"يعمل بلا إنترنت", d:"شبكة LoRaWAN خاصّة تغطي مساحات شاسعة بطاقة بطّارية تدوم سنة."},
            {i:"Users", t:"فريق وصلاحيات", d:"ادعُ مهندسين زراعيين، فنّيين، أو ملاّك مع صلاحيات محدّدة."},
          ].map((f, idx) => {
            const IconC = window.I[f.i];
            return (
              <div key={idx} className="card card-pad" style={{display:"flex", flexDirection:"column", gap: 10}}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "var(--brand-soft)", color: "var(--brand)",
                  display:"grid", placeItems:"center"
                }}>
                  <IconC size={20} sw={1.8}/>
                </div>
                <div style={{fontFamily:"var(--font-display)", fontSize: 17, fontWeight: 600, marginTop: 4}}>{f.t}</div>
                <div style={{fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55}}>{f.d}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{padding: "60px 32px", maxWidth: 1000, margin: "0 auto"}}>
        <div style={{textAlign:"center", marginBottom: 40}}>
          <div className="t-eyebrow">كيف يعمل</div>
          <h2 className="t-display" style={{fontSize: 32, margin: "10px 0"}}>ثلاث خطوات للراحة</h2>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: 24, position:"relative"}}>
          {[
            {n:"01", t:"ركّب المصيدة", d:"علّق المصيدة في موقع استراتيجي بين النخيل، وفعّلها من التطبيق بمسح QR."},
            {n:"02", t:"راقب التدفّق", d:"تستقبل قراءات لحظيّة لعدد الذكور الواقعة، حالة البطّارية، وموقع الجهاز."},
            {n:"03", t:"تدخّل بدقّة", d:"عند تجاوز عتبة الخطر، يُرسل النظام تنبيهاً مع توصية بنوع المعالجة."},
          ].map((s,i) => (
            <div key={i} className="card card-pad" style={{position:"relative"}}>
              <div className="t-mono" style={{fontSize: 28, fontWeight:600, color: "var(--brand)"}}>{s.n}</div>
              <div style={{fontFamily:"var(--font-display)", fontSize: 18, fontWeight: 600, marginTop: 8}}>{s.t}</div>
              <div style={{fontSize: 13, color: "var(--ink-3)", marginTop: 6, lineHeight: 1.6}}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{padding: "60px 32px 80px", maxWidth: 1100, margin: "0 auto"}}>
        <div style={{textAlign:"center", marginBottom: 40}}>
          <div className="t-eyebrow">الاشتراكات</div>
          <h2 className="t-display" style={{fontSize: 32, margin: "10px 0"}}>اختر الخطة التي تناسب حجم مزرعتك</h2>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: 18}}>
          {[
            {n:"البداية", p:"199", u:"ر.س / شهر", d:"حتى 10 مصايد", f:["تنبيهات أساسية", "تقارير أسبوعية", "دعم عبر البريد"]},
            {n:"المزرعة", p:"599", u:"ر.س / شهر", d:"حتى 50 مصيدة", popular: true, f:["تنبيهات WhatsApp", "خريطة حرارية", "تقارير قابلة للتصدير", "صلاحيات فريق"]},
            {n:"المؤسّسة", p:"اتّصل", u:"حسب الحاجة", d:"أكثر من 50 مصيدة", f:["تكامل مخصّص", "مدير حساب", "SLA 99.9%", "تدريب ميداني"]},
          ].map((p,i) => (
            <div key={i} className="card card-pad" style={{
              borderColor: p.popular ? "var(--brand)" : "var(--line)",
              boxShadow: p.popular ? "0 0 0 3px rgba(111,67,24,.10)" : "none",
              position:"relative", display:"flex", flexDirection:"column", gap: 12, padding: 22,
            }}>
              {p.popular && <div style={{
                position:"absolute", top: -10, insetInlineStart: 18,
                background:"var(--brand)", color: "#fff8e8",
                fontSize:10, fontFamily:"var(--font-mono)", letterSpacing:".12em",
                padding:"3px 8px", borderRadius:4, textTransform:"uppercase"
              }}>الأكثر اختياراً</div>}
              <div style={{fontFamily:"var(--font-display)", fontSize: 18, fontWeight: 600}}>{p.n}</div>
              <div style={{fontSize: 12, color:"var(--ink-3)"}}>{p.d}</div>
              <div style={{display:"flex", alignItems:"baseline", gap:6, marginTop:4}}>
                <span style={{fontFamily:"var(--font-display)", fontSize: 36, fontWeight: 600}}>{p.p}</span>
                <span style={{fontSize:12, color:"var(--ink-3)"}}>{p.u}</span>
              </div>
              <div style={{height:1, background:"var(--line)", margin:"4px 0"}}/>
              <ul style={{padding:0, listStyle:"none", margin: 0, display:"flex", flexDirection:"column", gap: 8, fontSize: 13}}>
                {p.f.map((it, j) => (
                  <li key={j} style={{display:"flex", alignItems:"center", gap: 8}}>
                    <window.I.Check size={14} stroke="var(--accent)" sw={2.4}/>
                    {it}
                  </li>
                ))}
              </ul>
              <button className={"btn " + (p.popular ? "btn-primary" : "btn-secondary") + " btn-block"}
                      style={{marginTop:"auto"}}
                      onClick={() => onNav("signup")}>
                {p.popular ? "ابدأ تجربة مجانيّة" : "اختيار"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"40px 32px 80px", maxWidth: 900, margin: "0 auto"}}>
        <div style={{
          background: "linear-gradient(135deg, #2a2218 0%, #1f1a14 100%)",
          color: "#f0e6cf",
          borderRadius: 18,
          padding: "44px 36px",
          display:"flex", justifyContent:"space-between", alignItems:"center", gap: 24,
          flexWrap:"wrap"
        }}>
          <div>
            <h3 className="t-display" style={{fontSize: 24, margin: 0, color: "#f3e2bd"}}>جاهز تحمي محصولك هذا الموسم؟</h3>
            <p style={{margin:"6px 0 0", color:"#a89776", fontSize: 13}}>ابدأ بدون التزام، واحصل على أوّل مصيدة هديّة عند الترقية.</p>
          </div>
          <button className="btn btn-lg" style={{background:"#d4a35a", color:"#1f1a14"}} onClick={() => onNav("signup")}>
            ابدأ الآن
            <window.I.Arrow size={14} style={{transform:"scaleX(-1)"}}/>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{padding:"32px", borderTop:"1px solid var(--line)", color:"var(--ink-3)", fontSize:12, textAlign:"center"}}>
        © 2026 خوص · جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

function HeroPreview() {
  return (
    <div style={{display:"grid", gridTemplateColumns: "200px 1fr", gap: 14, height: 360}}>
      <div style={{background:"#1f1a14", borderRadius: 12, padding: 12, color:"#c9bca0"}}>
        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom: 12}}>
          <div style={{width:22, height:22, borderRadius:6, background: "linear-gradient(135deg, #d4a35a, #6f4318)", display:"grid", placeItems:"center", color:"#1f1a14", fontFamily:"var(--font-display)", fontWeight:700, fontSize:13}}>س</div>
          <div style={{fontFamily:"var(--font-display)", fontSize: 13, color:"#f0e6cf"}}>خوص</div>
        </div>
        {["لوحة التحكم","المصايد","التنبيهات","المزارع","الخريطة","التقارير","الإعدادات"].map((l, i) => (
          <div key={i} style={{
            padding:"6px 8px", borderRadius:6, fontSize:11, marginBottom: 2,
            background: i===0 ? "rgba(212,163,90,.14)" : "transparent",
            color: i===0 ? "#f3e2bd" : "#a89776"
          }}>{l}</div>
        ))}
      </div>
      <div style={{display:"flex", flexDirection:"column", gap: 12}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap: 10}}>
          {[
            {l:"مصايد نشطة", v:"24/26", d:"+2"},
            {l:"تنبيهات اليوم", v:"3", d:"−1"},
            {l:"حشرات هذا الأسبوع", v:"187", d:"+24"},
            {l:"معدل الإصابة", v:"٨٪", d:"−2"},
          ].map((k, i) => (
            <div key={i} className="card" style={{padding: 10}}>
              <div className="t-mono" style={{fontSize: 9, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".1em"}}>{k.l}</div>
              <div style={{fontFamily:"var(--font-display)", fontSize: 22, fontWeight: 600, marginTop: 4}}>{k.v}</div>
              <div style={{fontSize: 10, color: "var(--ok)", fontFamily:"var(--font-mono)"}}>{k.d}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{padding: 14, flex: 1}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom: 8}}>
            <div style={{fontFamily:"var(--font-display)", fontSize: 13, fontWeight: 600}}>تدفّق الرصد · 7 أيام</div>
            <div className="t-mono" style={{fontSize: 10, color:"var(--ink-3)"}}>+18% مقارنة بالأسبوع الماضي</div>
          </div>
          <window.UI.AreaChart series={[12, 18, 14, 28, 22, 38, 31]} labels={["س","ح","ن","ث","ر","خ","ج"]} height={170}/>
        </div>
      </div>
    </div>
  );
}

window.Landing = Landing;
