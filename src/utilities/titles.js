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
  medilight_client: { en: "Client", ar: "المستخدم" },
  medilight_client_organization: {
    en: "Organizations",
    ar: "المنظمات",
  },
  medilight_client_organization_add: {
    en: "Add New Organization",
    ar: "إضافة منظمة جديدة",
  },
  medilight_client_organization_edit: {
    en: "Edit Organization",
    ar: "تعديل منظمة",
  },
};
