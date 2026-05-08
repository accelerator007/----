// جلسة محليّة (بدون خادم) لتمييز الأدوار: admin · farmer · engineer

(function () {
  var KEY = "khoos_session_v1";

  function inferRole(email) {
    var e = String(email || "").toLowerCase().trim();
    if (e.indexOf("admin@") === 0 || e.indexOf("مدير@") === 0) return "admin";
    if (e.indexOf("engineer@") === 0 || e.indexOf("مهندس@") === 0) return "engineer";
    return "farmer";
  }

  var PAGES = {
    admin: [
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
    ],
    farmer: ["dashboard", "reports", "traps", "alerts", "farms", "map", "billing", "settings"],
    engineer: ["engineer-home", "dashboard", "reports", "traps", "alerts", "farms", "map", "settings"],
  };

  window.KhoosSession = {
    STORAGE_KEY: KEY,

    read: function () {
      try {
        var raw = localStorage.getItem(KEY);
        if (!raw) return null;
        var s = JSON.parse(raw);
        if (!s || !s.role || !s.email) return null;
        if (!PAGES[s.role]) return null;
        return s;
      } catch (err) {
        return null;
      }
    },

    save: function (s) {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          role: s.role,
          email: s.email,
          name: s.name || "",
          subtitle: s.subtitle || "",
          at: Date.now(),
        })
      );
    },

    clear: function () {
      localStorage.removeItem(KEY);
    },

    inferRole: inferRole,

    demoProfile: function (role, email) {
      var em =
        email ||
        (role === "admin"
          ? "admin@demo.khoos.sa"
          : role === "engineer"
            ? "engineer@demo.khoos.sa"
            : "farmer@demo.khoos.sa");
      var r = role === "admin" || role === "engineer" || role === "farmer" ? role : inferRole(em);
      var profiles = {
        admin: { name: "مدير النظام", subtitle: "صلاحيات كاملة · الأدمن" },
        engineer: { name: "خالد العتيبي", subtitle: "مهندس ميداني · الفريق الفني" },
        farmer: { name: "عبدالله الراشد", subtitle: "مزرعة الواحة · مالك" },
      };
      var p = profiles[r];
      return {
        role: r,
        email: em,
        name: p.name,
        subtitle: p.subtitle,
      };
    },

    defaultLandingPage: function (role) {
      if (role === "admin") return "admin-home";
      if (role === "engineer") return "engineer-home";
      return "dashboard";
    },

    canAccess: function (role, page) {
      var list = PAGES[role];
      return list && list.indexOf(page) !== -1;
    },

    pagesForRole: function (role) {
      return PAGES[role] ? PAGES[role].slice() : [];
    },
  };
})();
