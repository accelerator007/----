/**
 * تهيئة Supabase + مصادقة + تحميل البيانات لواجهة خوص
 * يُحمَّل كـ ES module بعد supabase-config.js
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const url = globalThis.KHOOS_SUPABASE_URL || "";
const key = globalThis.KHOOS_SUPABASE_ANON_KEY || "";

globalThis.khoosSb =
  url && key
    ? createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

function formatRelative(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 45) return "الآن";
  if (sec < 3600) return `قبل ${Math.floor(sec / 60)} دقيقة`;
  if (sec < 86400) return `قبل ${Math.floor(sec / 3600)} ساعة`;
  if (sec < 86400 * 7) return `قبل ${Math.floor(sec / 86400)} يوم`;
  return d.toLocaleDateString("ar-SA");
}

let profileCache = null;

async function fetchProfileRow(sb, userId) {
  const { data, error } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

function mapSession(user, row) {
  if (!user) return null;
  const role = row && row.role ? row.role : "farmer";
  return {
    userId: user.id,
    email: user.email || (row && row.email) || "",
    role: role,
    name: (row && row.full_name) || (user.email ? user.email.split("@")[0] : "") || "",
    phone: (row && row.phone) || "",
    subtitle:
      (row && row.subtitle) ||
      (row && row.farm_name) ||
      (role === "admin" ? "مدير" : role === "engineer" ? "مهندس ميداني" : "مزارع"),
  };
}

globalThis.DATA = {
  TRAPS_DATA: [],
  ALERTS_DATA: [],
  FARMS_DATA: [],
  USERS_DATA: [],
};

globalThis.KhoosAuth = {
  ready: false,
  configured: !!(url && key),
  getProfile() {
    return profileCache;
  },
  async init(onChange) {
    const sb = globalThis.khoosSb;
    this.ready = false;
    if (!sb) {
      profileCache = null;
      this.ready = true;
      if (onChange) onChange(null);
      globalThis.dispatchEvent(new CustomEvent("khoos-auth", { detail: null }));
      return;
    }
    const {
      data: { session },
    } = await sb.auth.getSession();
    if (session?.user) {
      try {
        const row = await fetchProfileRow(sb, session.user.id);
        profileCache = mapSession(session.user, row);
      } catch (e) {
        console.error("[KhoosAuth]", e);
        profileCache = mapSession(session.user, null);
      }
    } else profileCache = null;
    this.ready = true;
    if (onChange) onChange(profileCache);
    globalThis.dispatchEvent(new CustomEvent("khoos-auth", { detail: profileCache }));

    sb.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const row = await fetchProfileRow(sb, session.user.id);
          profileCache = mapSession(session.user, row);
        } catch (e) {
          console.error("[KhoosAuth]", e);
          profileCache = mapSession(session.user, null);
        }
      } else profileCache = null;
      if (onChange) onChange(profileCache);
      globalThis.dispatchEvent(new CustomEvent("khoos-auth", { detail: profileCache }));
    });
  },
  async signIn(email, password) {
    const sb = globalThis.khoosSb;
    if (!sb) throw new Error("لم يُضبط Supabase — أنشئ ملف supabase-config.js");
    const { data, error } = await sb.auth.signInWithPassword({
      email: String(email).trim(),
      password,
    });
    if (error) throw error;
    return data;
  },
  async signUp(email, password, meta) {
    const sb = globalThis.khoosSb;
    if (!sb) throw new Error("لم يُضبط Supabase — أنشئ ملف supabase-config.js");
    const { data, error } = await sb.auth.signUp({
      email: String(email).trim(),
      password,
      options: { data: meta || {} },
    });
    if (error) throw error;
    return data;
  },
  async signOut() {
    const sb = globalThis.khoosSb;
    if (sb) await sb.auth.signOut();
    profileCache = null;
    globalThis.DATA = {
      TRAPS_DATA: [],
      ALERTS_DATA: [],
      FARMS_DATA: [],
      USERS_DATA: [],
    };
    globalThis.dispatchEvent(new CustomEvent("khoos-data"));
  },
  async resetPassword(email) {
    const sb = globalThis.khoosSb;
    if (!sb) throw new Error("لم يُضبط Supabase");
    const origin = globalThis.location?.origin || "";
    const { error } = await sb.auth.resetPasswordForEmail(String(email).trim(), {
      redirectTo: origin ? `${origin}/index.html` : undefined,
    });
    if (error) throw error;
  },
};

function mapTrap(row) {
  const farmName = row.farms?.name || "—";
  return {
    id: row.code || String(row.id).slice(0, 8),
    name: row.name,
    farm: farmName,
    region: row.region || "—",
    status: row.status || "نشط",
    today: row.insects_today ?? 0,
    week: row.insects_week ?? 0,
    battery: row.battery_pct ?? 0,
    signal: row.signal_pct ?? 0,
    lastSeen: formatRelative(row.last_seen_at),
    lat: row.lat,
    lng: row.lng,
    _uuid: row.id,
    _farm_id: row.farm_id,
  };
}

function mapAlert(row) {
  const t = row.traps;
  const farmName = t?.farms?.name || "—";
  const trapCode = t?.code || (t?.id ? String(t.id).slice(0, 8) : "—");
  return {
    id: row.id,
    sev: row.severity,
    trap: trapCode,
    msg: row.body || row.title || "",
    time: formatRelative(row.created_at),
    farm: farmName,
    _title: row.title,
  };
}

function mapFarm(row, trapsCount) {
  return {
    id: String(row.id).slice(0, 8),
    name: row.name,
    region: row.region || "—",
    traps: trapsCount ?? 0,
    hectares: Number(row.hectares) || 0,
    owner: "",
    risk: row.risk || "low",
    _uuid: row.id,
    _owner_id: row.owner_id,
  };
}

function mapUserProfile(row) {
  return {
    id: row.id,
    name: row.full_name || row.email || "—",
    role: row.role === "admin" ? "مدير" : row.role === "engineer" ? "مهندس" : "مزارع",
    email: row.email || "—",
    phone: row.phone || "—",
    last: formatRelative(row.updated_at || row.created_at),
    active: row.is_active !== false,
    _uuid: row.id,
    _role: row.role,
  };
}

globalThis.KhoosAI = {
  getRecommendation(trap) {
    if (!trap) return { status: "unknown", title: "لا توجد بيانات", body: "بانتظار مزامنة المصايد..." };

    const today = trap.today || 0;
    const battery = trap.battery || 0;
    const signal = trap.signal || 0;

    if (today >= 20) {
      return {
        status: "danger",
        title: "حقن جذع النخيل فوراً",
        body: `العدد (${today}) تجاوز العتبة الحرجة. ننصح باستخدام مبيد الكلوربيريفوس خلال 48 ساعة لمنع انتشار السوسة في الحقل.`,
        action: "اطلب فنّي"
      };
    }

    if (today >= 8) {
      return {
        status: "warn",
        title: "مراقبة مكثفة",
        body: "نمط الإصابة يشير إلى بداية نشاط. راقب المصيدة يومياً؛ إذا استمر الارتفاع لـ 3 أيام، ننصح بتغيير الفرمون أو البدء بالمعالجة الوقائية.",
        action: "جدولة فحص"
      };
    }

    if (battery < 20) {
      return {
        status: "warn",
        title: "صيانة البطارية",
        body: `مستوى الطاقة (${battery}%) منخفض جداً. قد يتوقف الجهاز عن الإرسال قريباً. يرجى استبدال البطارية أو فحص الألواح الشمسية.`,
        action: "حجز صيانة"
      };
    }

    if (signal < 30) {
      return {
        status: "info",
        title: "تحسين الإشارة",
        body: "قوة الاتصال ضعيفة. جرب تغيير زاوية الهوائي أو رفع المصيدة قليلاً لضمان دقة نقل البيانات الحية.",
        action: "دليل التركيب"
      };
    }

    return {
      status: "ok",
      title: "الحالة ممتازة",
      body: "المصيدة تعمل بكفاءة عالية ولا توجد مؤشرات إصابة مقلقة حالياً. استمر في المتابعة الدورية.",
      action: "عرض التفاصيل"
    };
  }
};

globalThis.KhoosData = {
  async refreshAll() {
    const sb = globalThis.khoosSb;
    const profile = profileCache;
    if (!sb || !profile) {
      globalThis.DATA = {
        TRAPS_DATA: [],
        ALERTS_DATA: [],
        FARMS_DATA: [],
        USERS_DATA: [],
      };
      globalThis.dispatchEvent(new CustomEvent("khoos-data"));
      return;
    }

    try {
      const { data: trapsRows, error: te } = await sb
        .from("traps")
        .select("*, farms(name)")
        .order("updated_at", { ascending: false });
      if (te) throw te;
      globalThis.DATA.TRAPS_DATA = (trapsRows || []).map(mapTrap);

      const { data: alertsRows, error: ae } = await sb
        .from("alerts")
        .select("*, traps(code, name, farms(name))")
        .order("created_at", { ascending: false })
        .limit(80);
      if (ae) throw ae;
      globalThis.DATA.ALERTS_DATA = (alertsRows || []).map(mapAlert);

      const { data: farmRows, error: fe } = await sb.from("farms").select("*").order("created_at", { ascending: true });
      if (fe) throw fe;
      const farms = farmRows || [];
      globalThis.DATA.FARMS_DATA = farms.map((f) => {
        const n = globalThis.DATA.TRAPS_DATA.filter((t) => t._farm_id === f.id || t._farm_id === String(f.id)).length;
        return mapFarm(f, n);
      });

      if (profile.role === "admin") {
        const { data: profRows, error: pe } = await sb.from("profiles").select("*").order("created_at", { ascending: false });
        if (pe) throw pe;
        globalThis.DATA.USERS_DATA = (profRows || []).map(mapUserProfile);
      } else {
        globalThis.DATA.USERS_DATA = [];
      }
    } catch (e) {
      console.error("[KhoosData]", e);
      globalThis.DATA.TRAPS_DATA = [];
      globalThis.DATA.ALERTS_DATA = [];
      globalThis.DATA.FARMS_DATA = [];
      globalThis.DATA.USERS_DATA = [];
    }
    globalThis.dispatchEvent(new CustomEvent("khoos-data"));
  },
};

globalThis.dispatchEvent(new Event("khoos-sb-ready"));
