export default function Organization() {
  localStorage.setItem(
    "currentTitle",
    JSON.stringify({
      ar: "نافذة المنظمات",
      en: "Organizations Tab",
    })
  );
  return <div>Organization</div>;
}
