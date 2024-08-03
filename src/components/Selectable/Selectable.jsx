export default function Selectable({
  label,
  isSelected,
  onClickHandler,
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
        onClick={() => {
          onClickHandler();
        }}
      >
        {isSelected ? <img src="/correctWhite.svg" alt="checked" /> : null}
      </div>
      <span>{label}</span>
    </li>
  );
}
