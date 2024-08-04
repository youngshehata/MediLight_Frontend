export default function Selectable({
  id,
  label,
  isSelected,
  handleSelection,
  backgroundColor,
  cssClass,
  color,
}) {
  return (
    <li
      className={cssClass ? cssClass : ""}
      style={
        isSelected ? { backgroundColor: backgroundColor, color: color } : {}
      }
      key={label}
    >
      <div
        style={isSelected ? { borderColor: "#fff" } : {}}
        onClick={() => {
          handleSelection(id);
        }}
      >
        {isSelected ? <img src="/correctWhite.svg" alt="checked" /> : null}
      </div>
      <span>{label}</span>
    </li>
  );
}
