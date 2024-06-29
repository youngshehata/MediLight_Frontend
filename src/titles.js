export const setPageTitle = (en, ar) => {
  localStorage.setItem(
    "currentTitle",
    JSON.stringify({
      ar: ar,
      en: en,
    })
  );
};
export const titles = {
  medilight: { en: "Home", ar: "الرئيسية" },
  "medilight-client": { en: "Client", ar: "المستخدم" },
  "medilight-client-organization": {
    en: "Create New Organization",
    ar: "إنشاء منظمة جديدة",
  },
};
