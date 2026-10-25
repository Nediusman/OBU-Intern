import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "om" | "am";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar & Accessibility
    skip_to_content: "Skip to main content",
    accessibility: "Accessibility",
    font_size: "Text Size",
    normal: "Normal",
    large: "Large",
    extra_large: "Extra Large",
    high_contrast: "High Contrast",
    
    // Navigation
    home: "Home",
    about: "About OBU",
    academics: "Academics",
    administration: "Administration",
    leadership: "Leadership",
    research: "Research",
    registrar: "Registrar",
    news: "News",
    events: "Events",
    announcements: "Announcements",
    services: "Services",
    contact: "Contact",
    governance: "Website Policy",
    privacy_policy: "Privacy Policy",
    admin_portal: "Staff Portal",

    // Common UI
    last_updated: "Last Updated",
    read_more: "Read More",
    view_all: "View All",
    apply_now: "Apply Now",
    search: "Search...",
    emergency_notice: "Urgent Campus Notice",
    status_draft: "Draft",
    status_pending_review: "Pending Review",
    status_approved: "Approved",
    status_published: "Published",
    status_archived: "Archived",
    
    // Privacy Consent
    consent_checkbox: "I have read and agree to the Oda Bultum University Privacy and Personal Data Protection Policy.",
    data_protection_officer: "Data Protection Focal Person",
    privacy_notice_desc: "We strictly protect your personal information in accordance with FDRE proclamations and OBU Website Governance.",
  },
  om: {
    // Top Bar & Accessibility
    skip_to_content: "Qabiyyee ijoo qaxxaamuri",
    accessibility: "Dandeettii Fayyadamaa",
    font_size: "Guddina Barreeffamaa",
    normal: "Giddu-galeessa",
    large: "Guddaa",
    extra_large: "Baay'ee Guddaa",
    high_contrast: "Halluu Addaa",

    // Navigation
    home: "Fuula Duraa",
    about: "Waa'ee OBU",
    academics: "Barnoota",
    administration: "Bulchiinsa",
    leadership: "Hoggansa",
    research: "Qorannoo fi Qo'annoo",
    registrar: "Reejistiraara",
    news: "Oduu",
    events: "Qophiiwwan",
    announcements: "Beeksisa",
    services: "Tajaajiloota",
    contact: "Nu Qunnamaa",
    governance: "Imaammata Weebsaayitii",
    privacy_policy: "Imaammata Qooda Eegumsa Daataa",
    admin_portal: "Poortaalii Hojjattootaa",

    // Common UI
    last_updated: "Haaromfamuu Dhumate",
    read_more: "Dabalataan Dubbisi",
    view_all: "Hunda Ilaali",
    apply_now: "Amma Galmaa'aa",
    search: "Barbaadi...",
    emergency_notice: "Beeksisa Hatattamaa Yuunivarsiitichaa",
    status_draft: "Wixinee",
    status_pending_review: "Gulaallii Eegaa Jira",
    status_approved: "Ragga'eera",
    status_published: "Maxxanfameera",
    status_archived: "Kuusameera",

    // Privacy Consent
    consent_checkbox: "Imaammata eegumsa daataa fi iccitii Yuunivarsiitii Odaa Bultum dubbiseen itti waliigale.",
    data_protection_officer: "Itti Gaafatamaa Eegumsa Daataa",
    privacy_notice_desc: "Odeeffannoo keessan seera Itoophiyaa fi imaammata weebsaayitii OBU hordofnee eegna.",
  },
  am: {
    // Top Bar & Accessibility
    skip_to_content: "ወደ ዋናው ይዘት ይለፉ",
    accessibility: "የተደራሽነት አገልግሎት",
    font_size: "የጽሑፍ መጠን",
    normal: "መደበኛ",
    large: "ትልቅ",
    extra_large: "በጣም ትልቅ",
    high_contrast: "ከፍተኛ ንፅፅር",

    // Navigation
    home: "መነሻ",
    about: "ስለ ኦዳ ቡልቱም",
    academics: "አካዳሚክስ",
    administration: "አስተዳደር",
    leadership: "አመራር",
    research: "ምርምርና ማህበረሰብ",
    registrar: "ሬጅስትራር",
    news: "ዜናዎች",
    events: "መርሐ-ግብሮች",
    announcements: "ማስታወቂያዎች",
    services: "አገልግሎቶች",
    contact: "ያግኙን",
    governance: "የድረ-ገጽ አስተዳደር ፖሊሲ",
    privacy_policy: "የግል መረጃ ጥበቃ ፖሊሲ",
    admin_portal: "የሰራተኞች ፖርታል",

    // Common UI
    last_updated: "የመጨረሻ ማሻሻያ",
    read_more: "ተጨማሪ ያንብቡ",
    view_all: "ሁሉንም ይመልከቱ",
    apply_now: "አሁን ይመዝገቡ",
    search: "ይፈልጉ...",
    emergency_notice: "አስቸኳይ የዩኒቨርሲቲው ማስታወቂያ",
    status_draft: "ረቂቅ",
    status_pending_review: "ግምገማ በመጠበቅ ላይ",
    status_approved: "የጸደቀ",
    status_published: "የታተመ",
    status_archived: "ማህደር",

    // Privacy Consent
    consent_checkbox: "የኦዳ ቡልቱም ዩኒቨርሲቲ የግል መረጃ ጥበቃና ደህንነት ፖሊሲን አንብቤ ተስማምቻለሁ።",
    data_protection_officer: "የግል መረጃ ጥበቃ ተጠሪ",
    privacy_notice_desc: "የእርስዎን የግል መረጃ በኢ.ፌ.ዲ.ሪ ህጎች እና በኦ.ቡ.ዩ ድረ-ገጽ ፖሊሲ መሰረት በጥብቅ እንጠብቃለን።",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("obu_preferred_language") as Language | null;
      if (saved && (saved === "en" || saved === "om" || saved === "am")) {
        setLanguageState(saved);
      }
    } catch {
      // LocalStorage might be disabled or during SSR
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("obu_preferred_language", lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || translations["en"]?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
