// Root App: أدوار (أدمن · مزارع · مهندس) + تنقّل + لوحة التعديلات

const PUBLIC_PAGES = ["landing", "login", "signup", "forgot", "404"];

const SHELL_PAGES = [
  "admin-home",
  "engineer-home",
  "dashboard",
  "reports",
  "traps",
  "alerts",
  "farms",
  "map",
  "users",
  "billing",
  "settings",
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "themeMode": "light",
  "primaryColor": "#6f4318",
  "accentColor": "#5a7a3f",
  "density": "regular",
  "landingVariant": "warm",
  "dashVariant": "executive"
}/*EDITMODE-END*/;

function App() {
  const [session, setSession] = React.useState(() => window.KhoosSession.read());
  const [page, setPage] = React.useState(() => {
    var s = window.KhoosSession.read();
    return s ? window.KhoosSession.defaultLandingPage(s.role) : "landing";
  });
  const [selectedTrap, setSelectedTrap] = React.useState(null);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.style.setProperty("--brand", t.primaryColor);
    document.documentElement.style.setProperty("--accent", t.accentColor);
    if (t.themeMode === "dark") {
      document.documentElement.style.setProperty("--bg", "#1a1610");
      document.documentElement.style.setProperty("--bg-2", "#221d15");
      document.documentElement.style.setProperty("--surface", "#2a241a");
      document.documentElement.style.setProperty("--ink", "#f0e6cf");
      document.documentElement.style.setProperty("--ink-2", "#c9bca0");
      document.documentElement.style.setProperty("--ink-3", "#a89776");
      document.documentElement.style.setProperty("--line", "#3a3225");
    } else {
      document.documentElement.style.setProperty("--bg", "#faf6ef");
      document.documentElement.style.setProperty("--bg-2", "#f3ece0");
      document.documentElement.style.setProperty("--surface", "#ffffff");
      document.documentElement.style.setProperty("--ink", "#1f1a14");
      document.documentElement.style.setProperty("--ink-2", "#4a3f2f");
      document.documentElement.style.setProperty("--ink-3", "#756752");
      document.documentElement.style.setProperty("--line", "#e6dcc6");
    }
  }, [t.themeMode, t.primaryColor, t.accentColor]);

  const loginOk = (profile) => {
    setSession(profile);
    setPage(window.KhoosSession.defaultLandingPage(profile.role));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const logout = () => {
    window.KhoosSession.clear();
    setSession(null);
    setPage("landing");
    setSelectedTrap(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const demoEnter = (role) => {
    var profile = window.KhoosSession.demoProfile(role);
    window.KhoosSession.save(profile);
    setSession(profile);
    setPage(window.KhoosSession.defaultLandingPage(profile.role));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const onNav = (p) => {
    var pub = PUBLIC_PAGES.indexOf(p) !== -1;
    var s = session || window.KhoosSession.read();
    if (!pub && !s) {
      setPage("login");
      return;
    }
    if (s && SHELL_PAGES.indexOf(p) !== -1 && !window.KhoosSession.canAccess(s.role, p)) {
      setPage(window.KhoosSession.defaultLandingPage(s.role));
      return;
    }
    setPage(p);
    setSelectedTrap(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const isShell = SHELL_PAGES.indexOf(page) !== -1;

  const crumbsFor = (p) => {
    var map = {
      "admin-home": ["الإدارة", "لوحة الأدمن"],
      "engineer-home": ["الميدان", "مهام الميدان"],
      dashboard: ["لوحة التحكم"],
      reports: ["التقارير"],
      traps: ["الميدان", "المصايد"],
      alerts: ["الميدان", "التنبيهات"],
      farms: ["الميدان", "المزارع"],
      map: ["الميدان", "الخريطة"],
      users: ["الإدارة", "المستخدمون"],
      billing: ["الإدارة", "الفوترة"],
      settings: ["الإدارة", "الإعدادات"],
    };
    return map[p] || [p];
  };

  var content;
  if (page === "landing")
    content = <Landing onNav={onNav} variant={t.landingVariant} onDemoEnter={demoEnter} />;
  else if (page === "login") content = <Login onNav={onNav} onLoginSuccess={loginOk} />;
  else if (page === "signup") content = <Signup onNav={onNav} onLoginSuccess={loginOk} />;
  else if (page === "forgot") content = <Forgot onNav={onNav} />;
  else if (page === "404") content = <NotFound onNav={onNav} />;
  else if (isShell) {
    var pageBody;
    if (page === "admin-home") pageBody = <AdminHome onNav={onNav} />;
    else if (page === "engineer-home") pageBody = <EngineerHome onNav={onNav} />;
    else if (page === "dashboard") pageBody = <Dashboard onNav={onNav} dashVariant={t.dashVariant} />;
    else if (page === "reports") pageBody = <ReportsPage />;
    else if (page === "traps") pageBody = <TrapsPage onNav={onNav} onSelectTrap={setSelectedTrap} />;
    else if (page === "alerts") pageBody = <AlertsPage onNav={onNav} />;
    else if (page === "farms") pageBody = <FarmsPage />;
    else if (page === "map") pageBody = <MapPage />;
    else if (page === "users") pageBody = <UsersPage />;
    else if (page === "billing") pageBody = <BillingShortcut onNav={onNav} />;
    else if (page === "settings") pageBody = <SettingsPage onNav={onNav} />;
    else pageBody = <NotFound onNav={onNav} />;

    content = (
      <AppShell
        current={page}
        crumbs={crumbsFor(page)}
        onNav={onNav}
        session={session}
        onLogout={logout}
        onOpenNotifications={() => setNotifOpen(true)}
      >
        {pageBody}
      </AppShell>
    );
  } else content = <NotFound onNav={onNav} />;

  return (
    <div data-density={t.density}>
      {content}
      {selectedTrap && <TrapDrawer trap={selectedTrap} onClose={() => setSelectedTrap(null)} />}
      {notifOpen && (
        <NotificationsDrawer
          onClose={() => setNotifOpen(false)}
          onNav={(p) => {
            setNotifOpen(false);
            onNav(p);
          }}
        />
      )}

      <TweaksPanel>
        <TweakSection label="التنقّل" />
        <div style={{ padding: "0 4px 8px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
            {[
              ["landing", "الهبوط"],
              ["login", "الدخول"],
              ["signup", "التسجيل"],
              ["admin-home", "أدمن"],
              ["engineer-home", "مهندس"],
              ["dashboard", "داشبورد"],
              ["traps", "المصايد"],
              ["alerts", "التنبيهات"],
              ["map", "الخريطة"],
              ["farms", "المزارع"],
              ["reports", "التقارير"],
              ["users", "المستخدمون"],
              ["settings", "الإعدادات"],
              ["404", "404"],
            ].map(([p, l]) => (
              <button
                key={p}
                onClick={() => onNav(p)}
                style={{
                  padding: "6px 8px",
                  fontSize: 11,
                  borderRadius: 6,
                  background: page === p ? "var(--brand)" : "var(--bg-2)",
                  color: page === p ? "#fff8e8" : "var(--ink-2)",
                  border: "1px solid var(--line)",
                  cursor: "pointer",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <TweakSection label="الهويّة" />
        <TweakRadio
          label="الوضع"
          value={t.themeMode}
          options={[
            { value: "light", label: "فاتح" },
            { value: "dark", label: "داكن" },
          ]}
          onChange={(v) => setTweak("themeMode", v)}
        />
        <TweakColor
          label="اللون الرئيسي"
          value={t.primaryColor}
          options={["#6f4318", "#1f5b3a", "#7a3a18", "#3a4f7a", "#7a4f3a"]}
          onChange={(v) => setTweak("primaryColor", v)}
        />
        <TweakColor
          label="لون التمييز"
          value={t.accentColor}
          options={["#5a7a3f", "#c47d2a", "#3f6d7a", "#7a4d12"]}
          onChange={(v) => setTweak("accentColor", v)}
        />
        <TweakRadio
          label="الكثافة"
          value={t.density}
          options={[
            { value: "compact", label: "مدمج" },
            { value: "regular", label: "عادي" },
            { value: "comfy", label: "مريح" },
          ]}
          onChange={(v) => setTweak("density", v)}
        />
      </TweaksPanel>
    </div>
  );
}

function BillingShortcut({ onNav }) {
  React.useEffect(() => {}, []);
  return <SettingsPage onNav={onNav} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
