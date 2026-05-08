// Shell: sidebar + topbar — عناصر القائمة حسب دور المستخدم

function navGroupsForRole(role) {
  var field = [
    { id: "traps", label: "المصايد", icon: "Trap", page: "traps", badge: "24" },
    { id: "alerts", label: "التنبيهات", icon: "Alert", page: "alerts", badge: "3" },
    { id: "farms", label: "المزارع", icon: "Tree", page: "farms" },
    { id: "map", label: "الخريطة", icon: "Map", page: "map" },
  ];

  if (role === "admin") {
    return [
      {
        group: "الإدارة",
        items: [{ id: "admin-home", label: "لوحة الأدمن", icon: "Shield", page: "admin-home" }],
      },
      {
        group: "نظرة عامة",
        items: [
          { id: "dashboard", label: "لوحة التحكم", icon: "Home", page: "dashboard" },
          { id: "reports", label: "التقارير", icon: "Reports", page: "reports" },
        ],
      },
      { group: "الميدان", items: field },
      {
        group: "التشغيل",
        items: [
          { id: "users", label: "المستخدمون", icon: "Users", page: "users" },
          { id: "billing", label: "الاشتراك والفوترة", icon: "Card", page: "billing" },
          { id: "settings", label: "الإعدادات", icon: "Settings", page: "settings" },
        ],
      },
    ];
  }

  if (role === "engineer") {
    return [
      {
        group: "الميدان",
        items: [{ id: "engineer-home", label: "مهام الميدان", icon: "Zap", page: "engineer-home" }],
      },
      {
        group: "نظرة عامة",
        items: [
          { id: "dashboard", label: "لمحة سريعة", icon: "Home", page: "dashboard" },
          { id: "reports", label: "التقارير", icon: "Reports", page: "reports" },
        ],
      },
      { group: "العمليات", items: field },
      {
        group: "الحساب",
        items: [{ id: "settings", label: "الإعدادات", icon: "Settings", page: "settings" }],
      },
    ];
  }

  // مزارع / مستخدم عادي
  return [
    {
      group: "نظرة عامة",
      items: [
        { id: "dashboard", label: "لوحة التحكم", icon: "Home", page: "dashboard" },
        { id: "reports", label: "التقارير", icon: "Reports", page: "reports" },
      ],
    },
    { group: "الميدان", items: field },
    {
      group: "الحساب",
      items: [
        { id: "billing", label: "الاشتراك والفوترة", icon: "Card", page: "billing" },
        { id: "settings", label: "الإعدادات", icon: "Settings", page: "settings" },
      ],
    },
  ];
}

function Sidebar({ current, onNav, session, onLogout }) {
  var role = (session && session.role) || "farmer";
  var groups = navGroupsForRole(role);
  var initial = (session && session.name && session.name.trim()[0]) || "؟";

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <img src="assets/khoos-logo.png" alt="خوص" style={{ width: 28, height: 28, objectFit: "contain" }} />
        </div>
        <div>
          <div className="brand-name">خوص</div>
          <div className="brand-sub">
            {role === "admin" ? "أدمن" : role === "engineer" ? "مهندس ميداني" : "مزارع"}
          </div>
        </div>
      </div>

      {groups.map(function (group) {
        return (
          <div className="nav-group" key={group.group}>
            <div className="nav-group-label">{group.group}</div>
            {group.items.map(function (it) {
              var IconC = window.I[it.icon];
              var active = current === it.page;
              return (
                <div
                  key={it.id}
                  className={"nav-item " + (active ? "active" : "")}
                  onClick={() => onNav(it.page)}
                >
                  <IconC className="nav-icon" size={17} />
                  <span>{it.label}</span>
                  {it.badge && <span className="nav-badge">{it.badge}</span>}
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="sidebar-foot">
        <div className="avatar">{initial}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#f0e6cf",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {(session && session.name) || "مستخدم"}
          </div>
          <div style={{ fontSize: 11, color: "#a89776" }}>
            {(session && session.subtitle) || ""}
          </div>
        </div>
        <button className="icon-btn" style={{ color: "#a89776" }} onClick={onLogout} title="خروج">
          <window.I.Logout size={16} />
        </button>
      </div>
    </aside>
  );
}

function Topbar({ crumbs = [], onNav, onOpenNotifications, session }) {
  var av =
    session && session.name && String(session.name).trim()
      ? String(session.name).trim()[0]
      : "؟";
  return (
    <div className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <window.I.Chevron className="sep" size={12} style={{ transform: "scaleX(-1)" }} />}
            <span className={i === crumbs.length - 1 ? "last" : ""}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="search">
        <window.I.Search className="icn" size={15} />
        <input placeholder="ابحث عن مصيدة، مزرعة، تنبيه..." />
        <kbd>⌘K</kbd>
      </div>
      <div className="actions">
        <button className="icon-btn" title="مساعدة">
          <window.I.Help size={17} />
        </button>
        <button className="icon-btn" title="التنبيهات" onClick={onOpenNotifications}>
          <window.I.Bell size={17} />
          <span className="dot"></span>
        </button>
        <div style={{ width: 1, height: 22, background: "var(--line)", margin: "0 4px" }} />
        <button className="icon-btn" onClick={() => onNav("settings")} title="الحساب">
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8a5824, #5a7a3f)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {av}
          </div>
        </button>
      </div>
    </div>
  );
}

function AppShell({ current, crumbs, onNav, children, onOpenNotifications, session, onLogout }) {
  return (
    <div className="app-root">
      <Sidebar current={current} onNav={onNav} session={session} onLogout={onLogout} />
      <div className="main">
        <Topbar
          crumbs={crumbs}
          onNav={onNav}
          onOpenNotifications={onOpenNotifications}
          session={session}
        />
        <div className="page">{children}</div>
      </div>
    </div>
  );
}

window.AppShell = AppShell;
window.navGroupsForRole = navGroupsForRole;
