// صلاحيات الصفحات — الجلسة تأتي من Supabase عبر window.KhoosAuth (khoos-bootstrap.mjs)

(function () {
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
    STORAGE_KEY: "khoos_session_v1",

    read: function () {
      return window.KhoosAuth && typeof window.KhoosAuth.getProfile === "function"
        ? window.KhoosAuth.getProfile()
        : null;
    },

    save: function () {
      /* Deprecated — الجلسة من Supabase Auth */
    },

    clear: function () {
      if (window.KhoosAuth && window.KhoosAuth.signOut) return window.KhoosAuth.signOut();
      return Promise.resolve();
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
