// Auth pages: login, signup, forgot, verify

function AuthArt({ title, sub }) {
  return (
    <div className="auth-art">
      <div className="row gap-2">
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg, #d4a35a, #6f4318)",
          display:"grid", placeItems:"center",
          color:"#1f1a14", fontFamily:"var(--font-display)", fontWeight:700, overflow:"hidden"
        }}><img src="assets/khoos-logo.png" alt="خوص" style={{width:32,height:32,objectFit:"contain"}}/></div>
        <div style={{fontFamily:"var(--font-display)", fontSize: 20, fontWeight: 600}}>خوص</div>
      </div>
      <div style={{margin:"auto 0"}}>
        <div className="t-eyebrow" style={{color:"#a89776"}}>منصّة المزارعين الذكيّة</div>
        <h2 className="t-display" style={{fontSize: 38, lineHeight: 1.15, margin: "12px 0 14px"}}>{title}</h2>
        <p style={{color:"#c9bca0", fontSize: 15, maxWidth: 420, lineHeight: 1.6}}>{sub}</p>

        {/* Decorative live preview */}
        <div style={{
          marginTop: 36,
          background: "rgba(0,0,0,.25)",
          border: "1px solid rgba(233,223,201,.1)",
          borderRadius: 14,
          padding: 16,
          maxWidth: 360
        }}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom: 12, fontSize: 11, fontFamily:"var(--font-mono)", color:"#a89776"}}>
            <span>المصيدة TRAP-08</span>
            <span style={{color: "#90b86c"}}>● مباشر</span>
          </div>
          <div style={{fontFamily:"var(--font-display)", fontSize: 32, color:"#f3e2bd"}}>14 <span style={{fontSize:13, color:"#a89776"}}>حشرة / اليوم</span></div>
          <div style={{height: 60, marginTop: 10}}>
            <svg viewBox="0 0 320 60" style={{width:"100%", height:"100%"}} preserveAspectRatio="none">
              <path d="M0 50 L40 40 L80 45 L120 30 L160 36 L200 18 L240 24 L280 12 L320 18 L320 60 L0 60 Z" fill="#d4a35a" opacity=".18"/>
              <path d="M0 50 L40 40 L80 45 L120 30 L160 36 L200 18 L240 24 L280 12 L320 18" fill="none" stroke="#d4a35a" strokeWidth="2"/>
            </svg>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", marginTop: 6, fontSize: 10, fontFamily:"var(--font-mono)", color:"#756752"}}>
            <span>قبل 7 أيام</span>
            <span>الآن</span>
          </div>
        </div>
      </div>
      <div style={{fontSize: 11, color: "#756752", fontFamily:"var(--font-mono)"}}>
        © 2026 KHOOS · جميع البيانات مشفّرة
      </div>
    </div>
  );
}

function Login({ onNav, onLoginSuccess }) {
  const [email, setEmail] = React.useState("farmer@demo.khoos.sa");
  const [pw, setPw] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const finishLogin = (profile) => {
    window.KhoosSession.save(profile);
    onLoginSuccess(profile);
  };

  const submit = (e) => {
    e?.preventDefault();
    if (!email.includes("@")) { setErr("بريد غير صالح"); return; }
    setErr(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      var role = window.KhoosSession.inferRole(email);
      var profile = window.KhoosSession.demoProfile(role, email);
      finishLogin(profile);
    }, 500);
  };

  const quickDemo = (role) => {
    var profile = window.KhoosSession.demoProfile(role);
    finishLogin(profile);
  };

  return (
    <div className="auth-wrap">
      <AuthArt title="تابع نخيلك من أيّ مكان" sub="سجّل دخولك لمتابعة قراءات المصايد، استلام التنبيهات، وإدارة فريقك الميداني."/>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <div className="t-eyebrow">تسجيل الدخول</div>
          <h1 className="t-display" style={{fontSize: 28, margin: "8px 0 6px"}}>أهلاً بعودتك</h1>
          <p className="t-muted" style={{fontSize: 13, margin: "0 0 22px"}}>أدخل بريدك للدخول التجريبي (كلمة المرور غير مفعّلة بعد — واجهة فقط).</p>

          <div className="card card-pad" style={{background:"var(--bg-2)", marginBottom: 14, padding: "12px 14px"}}>
            <div style={{fontSize: 11, color: "var(--ink-3)", marginBottom: 8}}>دخول سريع بالدور:</div>
            <div className="row gap-2" style={{flexWrap: "wrap"}}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => quickDemo("farmer")}>مزارع</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => quickDemo("engineer")}>مهندس</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => quickDemo("admin")}>أدمن</button>
            </div>
            <div className="hint" style={{marginTop: 8}}>
              أو اكتب بريداً يبدأ بـ <span className="t-mono">admin@</span> أو <span className="t-mono">engineer@</span> لاختيار الدور تلقائياً.
            </div>
          </div>

          <div className="col gap-3">
            <div className="field">
              <label>البريد الإلكتروني</label>
              <input className={"input " + (err ? "err" : "")} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoFocus/>
              {err && <div className="err">{err}</div>}
            </div>
            <div className="field">
              <div className="row between">
                <label>كلمة المرور</label>
                <a style={{fontSize: 11, color: "var(--brand)", cursor:"pointer"}} onClick={() => onNav("forgot")}>نسيت كلمة المرور؟</a>
              </div>
              <div style={{position:"relative"}}>
                <input className="input" type={show ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" style={{paddingInlineEnd: 38}}/>
                <button type="button" onClick={() => setShow(!show)} className="icon-btn"
                        style={{position:"absolute", insetInlineEnd: 4, top: 2, width: 30, height: 30}}>
                  {show ? <window.I.EyeOff size={15}/> : <window.I.Eye size={15}/>}
                </button>
              </div>
            </div>
            <label className="checkbox" style={{marginTop: 2}}>
              <input type="checkbox" defaultChecked/>
              تذكّرني على هذا الجهاز
            </label>

            <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading}>
              {loading ? <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:"spin 1s linear infinite"}}>
                  <path d="M12 2a10 10 0 110 20" strokeLinecap="round"/>
                </svg>
                جارٍ التحقّق...
              </> : "تسجيل الدخول"}
            </button>

            <div style={{display:"flex", alignItems:"center", gap:10, margin:"6px 0", color:"var(--ink-3)", fontSize: 11}}>
              <div style={{flex:1, height:1, background:"var(--line)"}}/>
              أو
              <div style={{flex:1, height:1, background:"var(--line)"}}/>
            </div>
            <button className="btn btn-secondary btn-block" type="button">
              <window.I.Globe size={14}/>
              المتابعة عبر Google
            </button>
          </div>

          <div style={{textAlign:"center", marginTop: 26, fontSize: 13, color: "var(--ink-3)"}}>
            ليس لديك حساب؟ <a style={{color:"var(--brand)", cursor:"pointer", fontWeight: 500}} onClick={() => onNav("signup")}>أنشئ حساباً</a>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Signup({ onNav, onLoginSuccess }) {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({name:"", email:"", phone:"", pw:"", farm:"", traps: 5});
  const set = (k, v) => setData(d => ({...d, [k]: v}));

  return (
    <div className="auth-wrap">
      <AuthArt title="ابدأ موسمك الزراعي بثقة" sub="14 يوم تجريبيّة، إعداد سريع، وأوّل مصيدة هديّة عند الترقية."/>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={e => {
          e.preventDefault();
          if (step < 3) { setStep(step + 1); return; }
          var profile = window.KhoosSession.demoProfile("farmer", data.email || "farmer@demo.khoos.sa");
          if (data.name && data.name.trim()) profile.name = data.name.trim();
          if (data.farm && data.farm.trim()) profile.subtitle = data.farm.trim() + " · مالك";
          window.KhoosSession.save(profile);
          onLoginSuccess(profile);
        }}>
          <div className="row gap-2" style={{marginBottom: 18}}>
            {[1,2,3].map(s => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: s <= step ? "var(--brand)" : "var(--bg-3)"
              }}/>
            ))}
          </div>
          <div className="t-eyebrow">الخطوة {step} من 3</div>
          <h1 className="t-display" style={{fontSize: 26, margin: "8px 0 6px"}}>
            {step === 1 && "نتعرّف عليك"}
            {step === 2 && "أخبرنا عن مزرعتك"}
            {step === 3 && "تفعيل الحساب"}
          </h1>
          <p className="t-muted" style={{fontSize: 13, margin: "0 0 22px"}}>
            {step === 1 && "بياناتك الأساسيّة لإنشاء حسابك."}
            {step === 2 && "نخصّص لوحة التحكم بناءً على حجم مزرعتك."}
            {step === 3 && "أرسلنا لك رمزاً للتحقّق على هاتفك."}
          </p>

          {step === 1 && <div className="col gap-3">
            <div className="field"><label>الاسم الكامل</label><input className="input" value={data.name} onChange={e => set("name", e.target.value)} placeholder="عبدالله الراشد" autoFocus/></div>
            <div className="field"><label>البريد الإلكتروني</label><input className="input" type="email" value={data.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com"/></div>
            <div className="field"><label>رقم الجوّال</label><input className="input" value={data.phone} onChange={e => set("phone", e.target.value)} placeholder="+966 5x xxx xxxx" dir="ltr"/></div>
            <div className="field">
              <label>كلمة المرور</label>
              <input className="input" type="password" value={data.pw} onChange={e => set("pw", e.target.value)} placeholder="٨ أحرف على الأقل"/>
              <div className="hint">٨+ أحرف، وعلى الأقل رقم واحد ورمز.</div>
            </div>
          </div>}

          {step === 2 && <div className="col gap-3">
            <div className="field"><label>اسم المزرعة</label><input className="input" value={data.farm} onChange={e => set("farm", e.target.value)} placeholder="مزرعة الواحة" autoFocus/></div>
            <div className="field">
              <label>المنطقة</label>
              <select className="select">
                <option>القصيم</option><option>الأحساء</option><option>المدينة المنوّرة</option><option>تبوك</option><option>أخرى</option>
              </select>
            </div>
            <div className="field">
              <label>عدد المصايد المتوقّع</label>
              <div className="row gap-2">
                {[5, 10, 25, 50].map(n => (
                  <button type="button" key={n} className={"btn " + (data.traps === n ? "btn-primary" : "btn-secondary")} style={{flex:1, justifyContent:"center"}} onClick={() => set("traps", n)}>{n}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>هل تستخدم مصايد فرمونات حالياً؟</label>
              <div className="row gap-3">
                <label className="radio"><input type="radio" name="curr" defaultChecked/> نعم</label>
                <label className="radio"><input type="radio" name="curr"/> لا</label>
                <label className="radio"><input type="radio" name="curr"/> أحياناً</label>
              </div>
            </div>
          </div>}

          {step === 3 && <div className="col gap-3">
            <div className="field">
              <label>رمز التحقّق</label>
              <div className="row gap-2" dir="ltr">
                {[0,1,2,3,4,5].map(i => <input key={i} className="input" maxLength={1} style={{textAlign:"center", fontFamily:"var(--font-mono)", fontSize: 18, fontWeight: 600}} defaultValue={["4","2","8","1","9","3"][i]}/>)}
              </div>
              <div className="hint">أُرسل إلى {data.phone || "+966 5x xxx xxxx"} · <a style={{color:"var(--brand)", cursor:"pointer"}}>إعادة الإرسال</a></div>
            </div>
            <div className="card card-pad" style={{background:"var(--bg-2)", borderStyle: "dashed"}}>
              <div className="row gap-3">
                <window.I.Info size={18} stroke="var(--info)"/>
                <div>
                  <div style={{fontWeight: 500, fontSize: 13}}>هديّة الترحيب</div>
                  <div style={{fontSize: 12, color: "var(--ink-3)"}}>سنرسل لك مصيدة خوص هديّة عند تأكيد أوّل اشتراك.</div>
                </div>
              </div>
            </div>
          </div>}

          <div className="row gap-2" style={{marginTop: 22}}>
            {step > 1 && <button type="button" className="btn btn-ghost" onClick={() => setStep(step-1)}>السابق</button>}
            <button className="btn btn-primary grow" type="submit" style={{justifyContent:"center"}}>
              {step < 3 ? "التالي" : "إنشاء الحساب"}
              <window.I.Arrow size={14} style={{transform:"scaleX(-1)"}}/>
            </button>
          </div>

          <div style={{textAlign:"center", marginTop: 18, fontSize: 13, color: "var(--ink-3)"}}>
            لديك حساب؟ <a style={{color:"var(--brand)", cursor:"pointer", fontWeight: 500}} onClick={() => onNav("login")}>سجّل دخولك</a>
          </div>
        </form>
      </div>
    </div>
  );
}

function Forgot({ onNav }) {
  const [sent, setSent] = React.useState(false);
  return (
    <div className="auth-wrap">
      <AuthArt title="استعد الوصول لحسابك" sub="أرسل لنا بريدك ونرسل لك رابط إعادة تعيين كلمة المرور."/>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={e => { e.preventDefault(); setSent(true); }}>
          <a onClick={() => onNav("login")} style={{fontSize: 12, color: "var(--ink-3)", cursor: "pointer", display:"inline-flex", alignItems:"center", gap:4}}>
            <window.I.Arrow size={12}/> العودة لتسجيل الدخول
          </a>
          <h1 className="t-display" style={{fontSize: 28, margin: "12px 0 6px"}}>نسيت كلمة المرور</h1>

          {!sent ? <>
            <p className="t-muted" style={{fontSize: 13, margin: "0 0 22px"}}>أدخل بريدك ونرسل لك رابط الاستعادة خلال دقائق.</p>
            <div className="field"><label>البريد الإلكتروني</label><input className="input" type="email" autoFocus placeholder="you@example.com"/></div>
            <button className="btn btn-primary btn-block btn-lg" type="submit" style={{marginTop: 14}}>إرسال الرابط</button>
          </> : <div className="card card-pad" style={{background:"var(--ok-soft)", borderColor:"var(--ok)"}}>
            <div className="row gap-3">
              <window.I.Check2 size={28} stroke="var(--ok)"/>
              <div>
                <div style={{fontWeight: 600, fontFamily:"var(--font-display)"}}>أُرسل الرابط</div>
                <div style={{fontSize: 12, color: "var(--ink-3)", marginTop: 4}}>تحقّق من بريدك. الرابط صالح لـ 30 دقيقة.</div>
              </div>
            </div>
          </div>}
        </form>
      </div>
    </div>
  );
}

window.Login = Login;
window.Signup = Signup;
window.Forgot = Forgot;
