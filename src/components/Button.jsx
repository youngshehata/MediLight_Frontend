export default function Button({ onClickFunction, text, cssClass }) {
  return (
    <button onClick={onClickFunction} className={cssClass}>
      {text}
    </button>
  );
}
